import reviewForm from "./review-form";

self.addEventListener('DOMContentLoaded', function(event) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(
            
            function(registration) {
                console.log("Successfully registered ServiceWorker");

                if ('sync' in registration) {
                    // do stuff here
                    console.log('BackgroundSync is supported!');
                    
                }
            }

        ).catch(
            function(error) {
                console.log("Error registering ServiceWorker", error);
            }
        )
    }
});

