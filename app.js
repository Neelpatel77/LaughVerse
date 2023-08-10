import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB73mqOwxNZsXkBHr3w7779WTwI7FheXSA",
  authDomain: "jokesapp-proj-progressiveweb.firebaseapp.com",
  projectId: "jokesapp-proj-progressiveweb",
  storageBucket: "jokesapp-proj-progressiveweb.appspot.com",
  messagingSenderId: "1066849461799",
  appId: "1:1066849461799:web:61023d4e2beba58bbd1002",
  measurementId: "G-GYHRSL6LSQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function createListItem(text) {
    const listItem = document.createElement("li");
    listItem.textContent = text;
    return listItem;
}

async function fetchAndDisplayJokes() {
    const jokeList = document.getElementById("joke-list");

    try {
        const response = await fetch("https://v2.jokeapi.dev/joke/Any");
        const jokeData = await response.json();

        if (jokeData.type === "single") {
            const jokeItem = createListItem(jokeData.joke);
            jokeList.appendChild(jokeItem);

            await addDoc(collection(db, "jokes"), {
                joke: jokeData.joke,
                timestamp: new Date().toISOString()
            });

            // Display a notification
            if ('Notification' in window && Notification.permission === 'granted') {
                const notification = new Notification("New Joke", {
                    body: jokeData.joke
                });
            }
        } else if (jokeData.type === "twopart") {
            const setupItem = createListItem(jokeData.setup);
            const deliveryItem = createListItem(jokeData.delivery);
            jokeList.appendChild(setupItem);
            jokeList.appendChild(deliveryItem);

            await addDoc(collection(db, "jokes"), {
                setup: jokeData.setup,
                delivery: jokeData.delivery,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error("Error fetching jokes:", error);
    }
}

async function registerBackgroundSync() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register('sync-jokes');
        } catch (error) {
            console.error('Background sync registration failed:', error);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchAndDisplayJokes();
    registerBackgroundSync();
});
