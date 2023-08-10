import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

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

async function fetchAndDisplayFirestoreJokes() {
    const savedJokesList = document.getElementById("saved-jokes");

    try {
        const jokesSnapshot = await getDocs(collection(db, "jokes")); // Use getDocs() here
        jokesSnapshot.forEach((doc) => {
            const jokeData = doc.data();
            const jokeItem = createListItem(jokeData.joke || `${jokeData.setup} ${jokeData.delivery}`);
            savedJokesList.appendChild(jokeItem);
        });
    } catch (error) {
        console.error("Error fetching jokes from Firestore:", error);
    }
}
function speakJoke(jokeText) {
    const utterance = new SpeechSynthesisUtterance(jokeText);
    speechSynthesis.speak(utterance);
}

// Event listener for "Speak Joke" button
const speakButton = document.getElementById("speak-button");
speakButton.addEventListener("click", () => {
    const jokeText = document.getElementById("joke-text").value;
    speakJoke(jokeText);
});

// Event listener for "Save Joke" button
const saveButton = document.getElementById("save-button");
saveButton.addEventListener("click", async () => {
    const jokeText = document.getElementById("joke-text").value;

    try {
        await addDoc(collection(db, "jokes"), {
            joke: jokeText,
            timestamp: new Date().toISOString()
        });
        fetchAndDisplayFirestoreJokes(); // Refresh the list of jokes after saving
    } catch (error) {
        console.error("Error saving joke to Firestore:", error);
    }
});

// Call the function to fetch and display jokes from Firestore when the DOM is ready
document.addEventListener("DOMContentLoaded", fetchAndDisplayFirestoreJokes);
