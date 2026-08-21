import TTSBar from './Components/TTSBar.jsx'
import './styles/App.css';
import Controls from './Components/Controls.jsx'
import Grid from './Components/Grid.jsx';
import { useState } from 'react'
import * as vocabFile from "./Data/Vocab.json"

function App() {
  const [ttsContent, setTTsContent] = useState('');
  const [vocab, setVocab] = useState([...vocabFile.values()]);
  return (
    <div className="App">
      <div className="app-main">
        <TTSBar
          ttsContent={ttsContent} setTTsContent={setTTsContent}
        />

        <Controls
          ttsContent={ttsContent} setTTsContent={setTTsContent}
        />

        <Grid
          ttsContent={ttsContent} setTTsContent={setTTsContent}
          vocab={vocab} setVocab={setVocab}
        />
      </div >
    </div>
  );
}

export default App;
