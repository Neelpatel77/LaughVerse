// WebSpeech.js

// Check if the browser supports the Web Speech API
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure recognition options if needed
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Do something with the transcribed speech (e.g., display it)
        console.log('Transcript:', transcript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

    // Start recognition
    recognition.start();
} else {
    console.log('Web Speech API not supported');
}

// Check if the browser supports the Web Speech API for speech synthesis
if ('SpeechSynthesisUtterance' in window) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance('Hello, how are you?');

    // Configure synthesis options if needed
    utterance.lang = 'en-US';

    synth.speak(utterance);
} else {
    console.log('Web Speech API not supported');
}
