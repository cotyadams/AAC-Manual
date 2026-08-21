export default function speak (description) {
    
    if ('speechSynthesis' in window) {
        // Cancel any current speech and start new one immediately
        window.speechSynthesis.cancel();
        
        if (description && 'getVoices' in window.speechSynthesis) {
            // Wait for voices to load (Chrome needs this)
            if (!window.voicesLoaded) {
                window.speechSynthesis.onvoiceschanged = () => {
                    window.voicesLoaded = true;
                };
            }
            
            const utterance = new SpeechSynthesisUtterance(description);
            
            // Try to find a good voice
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                utterance.voice = voices.find(v => v.lang.includes('en')) || voices[0];
            }
            
            utterance.rate = 1; // Normal speed
            utterance.pitch = 1; // Normal pitch
            
            window.speechSynthesis.speak(utterance);
        } else if (description) {
            // Fallback for browsers without getVoices
            const utterance = new SpeechSynthesisUtterance(description);
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    } else {
        console.log('Web Speech API not supported');
    }
}