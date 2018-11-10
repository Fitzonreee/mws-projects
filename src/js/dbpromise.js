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
        
        case 2:
        // const putRequestStore = upgradeDb.createObjectStore('syncFavorites', {autoIncrement: true});
        // Using the restaurant id as key will allow me to easily update local iDB data,
        // remove successful put requests, and even handle last chance Background Syncs.
        // Another plus, is that if the user toggles the favorite button
        // more than once while offline, only the latest action will be synced, saving requests.
  
        // Store an object instead of a URL: {restaurant_id: id, url: "url"}
        const syncFavoriteStore = upgradeDb.createObjectStore('syncFavorites', {keyPath: 'restaurant_id'});
      case 3:
        const offlineReviewStore = upgradeDb.createObjectStore('offlineReviews', {keyPath: 'id', autoIncrement: true});
        offlineReviewStore.createIndex('restaurant_id', 'restaurant_id');
   
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
    }

    // Update data in idb 
    // You need to update two properties - isfavorite and updatedAt
      // For updatedAt you can use - new Date().toISOString

    // In a new idb store named offline-favorites, store the restaurant id and the value of isfavorite
    // so it can be synced using Background sync later
    // For example, if restaurant 1 is marked as favorite, store a new record -- {restaurant_id: 1, is favorite: true}

    // Register the background sync, giving it a name like syncFavorite

    // In the service worker, listen for background sync and when triggered, open offline-favorites store
    // and for each record stored there, do a PUT request to the API
    // If the user is online, this will happen right away
    // If the user is offline, it will happen when the browser decides
    // That's why we needed to update the data on idb in step 2 - so the info is available

    // 


    

  },

  /**
   * Offline - Sync favorite restaurants
   */
  syncReviews() {

  }

};

export default dbPromise;