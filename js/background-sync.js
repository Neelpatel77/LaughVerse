// Function to register background sync
async function registerBackgroundSync() {
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register("backgroundSync");
        console.log("Background sync registered");
      } catch (error) {
        console.error("Error registering background sync:", error);
      }
    }
  }
  
  // Event listener for background sync
  self.addEventListener("sync", async (event) => {
    if (event.tag === "backgroundSync") {
      try {
        const jokes = await getAllJokesFromIndexedDB();
        if (jokes.length > 0) {
          // Send jokes to Firebase or perform other synchronization
          console.log("Syncing offline data:", jokes);
        }
      } catch (error) {
        console.error("Error performing background sync:", error);
      }
    }
  });
  