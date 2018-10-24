var cacheName = "restaurantReviews-01";
var cacheFiles = [
    "/",
    "/restaurant.html",
    "/css/styles.css",
    "/js/main.js",
    "/js/dbhelper.js",
    "/js/restaurant_info.js",
    "/img/1.jpg", 
    "/img/2.jpg", 
    "/img/3.jpg", 
    "/img/4.jpg", 
    "/img/5.jpg", 
    "/img/6.jpg", 
    "/img/7.jpg", 
    "/img/8.jpg",
    "/img/9.jpg",
    "/img/10.jpg",
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(
            function(cache) {
                // console.log("ServiceWorker successfully installed!", cache);
                return cache.addAll(cacheFiles).catch(function(error){
                    console.log("Error! - ", error);
                });
            }
        ).catch(function(error){
            console.log("Error! - ", error);
        })
    )
});

self.addEventListener('fetch', function(event) {
    var requestURL = new URL(event.request.url);
    // console.log(requestURL);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            var fetchRequest = event.request.clone();
            return fetch(fetchRequest).then(function(response) {
                if (!response) {
                    return response;
                }
                var responseCaching = response.clone();
                caches.open(cacheName).then(function(cache) {
                    cache.put(event.request, responseCaching);
                })
                return response;
            })
        })
    )
});