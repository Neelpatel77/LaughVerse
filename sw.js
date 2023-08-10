// Service Worker installation and caching
self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open("joke-wave-cache").then((cache) => {
        return cache.addAll([
          "/",
          "/index.html",
          "/app.js"
          // Add more URLs for caching
        ]);
      })
    );
  });
  
  // Service Worker activation
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((cacheName) => {
            return cacheName !== "joke-wave-cache";
          }).map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
  
  // Fetching resources from cache
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  
  // Background Sync
  self.addEventListener("sync", async (event) => {
    if (event.tag === "backgroundSync") {
      try {
        const response = await fetch("https://v2.jokeapi.dev/joke/Any");
        const jokeData = await response.json();
  
        if (jokeData.type === "single") {
          await saveJokeToIndexedDB({
            joke: jokeData.joke,
            timestamp: new Date().toISOString()
          });
        } else if (jokeData.type === "twopart") {
          await saveJokeToIndexedDB({
            setup: jokeData.setup,
            delivery: jokeData.delivery,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("Error fetching jokes for background sync:", error);
      }
    }
  });
  