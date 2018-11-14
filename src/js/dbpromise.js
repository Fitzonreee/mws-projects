import idb from 'idb';

const dbPromise = {
 // creation and updating of database happens here.
 db: idb.open('restaurant-reviews-db', 2, function (upgradeDb) {
   switch (upgradeDb.oldVersion) {
     case 0:
       upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
     case 1:
      upgradeDb.createObjectStore('reviews', { keyPath: 'id'})
        .createIndex('restaurant_id', 'restaurant_id');
   }
 }),

  /**
   * Save a restaurant or array of restaurants into idb, using promises. If second argument
   * is passed a boolean true, data will be forcibly updated.
   */
  putRestaurants(restaurants, forceUpdate = false) {
    if (!restaurants.push) restaurants = [restaurants];
    return this.db.then(db => {
      const store = db.transaction('restaurants', 'readwrite').objectStore('restaurants');
      Promise.all(restaurants.map(networkRestaurant => {
        return store.get(networkRestaurant.id).then(idbRestaurant => {
          if (forceUpdate) return store.put(networkRestaurant);
          if (!idbRestaurant || new Date(networkRestaurant.updatedAt) > new Date(idbRestaurant.updatedAt)) {
            return store.put(networkRestaurant);
          }
        });
      })).then(function () {
        return store.complete;
      });
    });
  },

 /**
  * Get a restaurant, by its id, or all stored restaurants in idb using promises.
  * If no argument is passed, all restaurants will returned.
  */
 getRestaurants(id = undefined) {
   return this.db.then(db => {
     const store = db.transaction('restaurants').objectStore('restaurants');
     if (id) return store.get(Number(id));
     return store.getAll();
   });
 },

  /**
   * Save a review or array of reviews into idb, using promises
   */
  putReviews(reviews) {
    if (!reviews.push) reviews = [reviews];
    return this.db.then(db => {
      const store = db.transaction('reviews', 'readwrite').objectStore('reviews');
      Promise.all(reviews.map(networkReview => {
        return store.get(networkReview.id).then(idbReview => {
          if (!idbReview || new Date(networkReview.updatedAt) > new Date(idbReview.updatedAt)) {
            return store.put(networkReview);
          }
        });
      })).then(function () {
        return store.complete;
      });
    });
  },

  /**
   * Get all reviews for a specific restaurant, by its id, using promises.
   */
  getReviewsForRestaurant(id) {
    return this.db.then(db => {
      const storeIndex = db.transaction('reviews').objectStore('reviews').index('restaurant_id');
      return storeIndex.getAll(Number(id));
    });
  },

    /**
   * Offline - Sync favorite restaurants
   */
  syncFavorites() {

    if(!window.syncManager || !navigator.serviceWorker) {
      // Do a regular fetch to the PUT API endpoint
    } else {

    }

    // Update data in idb 
    // You need to update two properties - isfavorite and updatedAt - For updatedAt you can use - new Date().toISOString

    // In a new idb store named offline-favorites, store the restaurant id and the value of isfavorite
    // so it can be synced using Background sync later
    // For example, if restaurant 1 is marked as favorite, store a new record -- {restaurant_id: 1, is favorite: true}

    // Register the background sync, giving it a name like syncFavorite

    // In the service worker, listen for background sync and when triggered, open offline-favorites store
    // and for each record stored there, do a PUT request to the API
    // If the user is online, this will happen right away
    // If the user is offline, it will happen when the browser decides
    // That's why we needed to update the data on idb in step 2 - so the info is available

    // Still in the Service Worker, for each PUT request that is successful - with the data we get back from the server
    // we forcibly update the restaurant in idb and .then we remove the offline-favorite record for the specific questions

  },

  /**
   * Offline - Sync favorite restaurants
   */
  syncReviews() {

    if(!window.syncManager || !navigator.serviceWorker) {
      // Do a regular fetch to the PUT API endpoint
    } else {

    }

    // In a new idb stroe, called offline-reviews store this new review so it is available offline
    // and Background Sync knows what data needs to be POSTED
    // You will have to refactor your code for fetching reviews - so it includes all reviews from this store

      // Note that this store will also need to have an index for restaurant_id - as we'll need to access offline reviews for specific restaurants
      // This has to be a key pair store, meaning that data will have an auto-incremented key as its id, and the value will be the review object
      // Since we're not going to store an in in the object, the id won't be inside like in previous stores
      // You can use autoIncrement: true like so - upgradeDb.createObjectStore('offline-reviews', {autoIncrement: true})

    // Register for a background sync with name Sync Reviews

    // In the service worker, listen for background syncs with the name syncReviews
      // When triggered, open offline-reviews and for every record in the store, do a POST fetch request using it's data
      // When offline, data will sync instantly

    // Still in the service worker, for each successful POST request, store the new review in the reviews store, and delete the offline-review record


  }

};

export default dbPromise;