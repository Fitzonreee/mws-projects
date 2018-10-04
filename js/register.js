if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(
        function(registration) {
            console.log("Successfully registered ServiceWorker");
        }
    ).catch(
        function(error) {
            console.log("Error registering ServiceWorker", error);
        }
    )
}