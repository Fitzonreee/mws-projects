import DBHelper from "./dbhelper";
import dbPromise from "./dbpromise";


function handleClick() {
  const restaurantId = this.dataset.id;
  const fav = this.getAttribute('aria-pressed') == 'true';
  const url = `${DBHelper.API_URL}/restaurants/${restaurantId}/?is_favorite=${!fav}`;
  const PUT = {method: 'PUT'};

  // TODO: use Background Sync to sync data with API server
  
  if(!window.syncManager || !navigator.serviceWorker) {
   
   // Do a regular fetch to the PUT API endpoint
   return fetch(url, PUT).then(response => {
    if (!response.ok) return Promise.reject("We couldn't mark restaurant as favorite.");
    return response.json();
  }).then(updatedRestaurant => {
    // update restaurant on idb
    // You need to update two properties - isfavorite and updatedAt - For updatedAt you can use - new Date().toISOString
    dbPromise.putRestaurants(updatedRestaurant, true);
    // change state of toggle button
    this.setAttribute('aria-pressed', !fav);
  }).catch(err => {
   
   // We are offline
   console.log("You are offline!");
   
   // Create new IDB store named offline-favorites
   // dbPromise.syncFavoriteStore(restaurantId);

   console.log('Was restaurant - ' + restaurantId + ' stored in syncFavorites?');

   
   
   // Store the restaurant id and the value of isfavorite
   // so it can be synced using Background sync later
   
   
   
   // For example, if restaurant 1 is marked as favorite, store a new record -- {restaurant_id: 1, is favorite: true}


      // DBHelper.updateIDBRestaurant(restaurant) -- find or creat this function
      //  .then(() => {
      //   // add to queue...
      //   console.log('Add favorite request to queue');
      //   console.log(`DBHelper.addRequestToQueue(${url}, {}, ${method}, '')`);
      //   DBHelper.addRequestToQueue(url, {}, method, '')
      //     .then(offline_key => console.log('returned offline_key', offline_key));
      // });

    
    
    
    
    
    
  
    
    // Register the background sync, giving it a name like syncFavorite

    // In the service worker, listen for background sync and when triggered, open offline-favorites store
    // and for each record stored there, do a PUT request to the API
    // If the user is online, this will happen right away
    // If the user is offline, it will happen when the browser decides
    // That's why we needed to update the data on idb in step 2 - so the info is available

    // Still in the Service Worker, for each PUT request that is successful - with the data we get back from the server
    // we forcibly update the restaurant in idb and .then we remove the offline-favorite record for the specific questions

  
  
  

  });
 }
}

export default function favoriteButton(restaurant) {
  const button = document.createElement('button');
  button.innerHTML = "&#x2764;"; // this is the heart symbol in hex code
  button.className = "fav"; // you can use this class name to style your button
  button.dataset.id = restaurant.id; // store restaurant id in dataset for later
  button.setAttribute('aria-label', `Mark ${restaurant.name} as a favorite`);
  button.setAttribute('aria-pressed', restaurant.is_favorite);
  button.onclick = handleClick;

  return button;
}