(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var cacheName = "restaurantReviews-01";
var cacheFiles = ["/", "/restaurant.html", "/css/styles.css", "/js/main.js", "/js/restaurant_info.js", "/img/1.jpg", "/img/2.jpg", "/img/3.jpg", "/img/4.jpg", "/img/5.jpg", "/img/6.jpg", "/img/7.jpg", "/img/8.jpg", "/img/9.jpg", "/img/10.jpg"];
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(cacheName).then(function (cache) {
    // console.log("ServiceWorker successfully installed!", cache);
    return cache.addAll(cacheFiles).catch(function (error) {
      console.log("Error! - ", error);
    });
  }).catch(function (error) {
    console.log("Error! - ", error);
  }));
});
self.addEventListener('fetch', function (event) {
  var requestURL = new URL(event.request.url); // console.log(requestURL);

  event.respondWith(caches.match(event.request).then(function (response) {
    if (response) {
      return response;
    }

    var fetchRequest = event.request.clone();
    return fetch(fetchRequest).then(function (response) {
      if (!response) {
        return response;
      }

      var responseCaching = response.clone();
      caches.open(cacheName).then(function (cache) {
        cache.put(event.request, responseCaching);
      });
      return response;
    });
  }));
});

},{}]},{},[1])

//# sourceMappingURL=sw.js.map
