// Function to open the IndexedDB database
function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("jokes_db", 1);
  
      request.onerror = (event) => {
        reject("Error opening IndexedDB database");
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore("jokes_store", { keyPath: "id", autoIncrement: true });
      };
    });
  }
  
  // Function to save a joke to IndexedDB
  async function saveJokeToIndexedDB(joke) {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(["jokes_store"], "readwrite");
      const store = transaction.objectStore("jokes_store");
      await store.add(joke);
    } catch (error) {
      console.error("Error saving joke to IndexedDB:", error);
    }
  }
  
  // Function to get all jokes from IndexedDB
  async function getAllJokesFromIndexedDB() {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(["jokes_store"], "readonly");
      const store = transaction.objectStore("jokes_store");
      const jokes = await store.getAll();
      return jokes;
    } catch (error) {
      console.error("Error fetching jokes from IndexedDB:", error);
      return [];
    }
  }
  