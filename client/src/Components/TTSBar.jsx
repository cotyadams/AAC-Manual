import '../styles/TTSBar.css'
import { useState } from 'react';

export default function TTSBar({ttsContent, setTTsContent}) {


    return (<input
        type="text"
        className="tts-bar"
        value={ttsContent}
        onChange={(event) => setTTsContent(event.target.value)}
    />);
}

// function changeHandler (value) {
//     const ttsBarElement = document.querySelector('.tts-bar');

//     ttsBarElement.addEventListener('input', (event) => {
//         value = event.target.value;
//         console.log(value)
//     });
//     return value
// }