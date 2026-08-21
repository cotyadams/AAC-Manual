import TTSBar from './Components/TTSBar.jsx'
import './styles/App.css';
import Controls from './Components/Controls.jsx'
import Grid from './Components/Grid.jsx';
import { useState } from 'react'
import * as apiCalls from "./Nodeapi.js"
import AuthenticationForm from './Components/AuthenticationForm.jsx';
import AdminForm from './Components/AdminScreen.jsx';

function App() {
  const [ttsContent, setTTsContent] = useState('');
  const [showPassForm, setShowPassForm] = useState(false)
  const [showAdminForm, setShowAdminForm] = useState(false)
  console.log(apiCalls)
  return (
    <div className="App">
      <div className="app-main">
        <TTSBar
          ttsContent={ttsContent} setTTsContent={setTTsContent}
        />

        <Controls
          ttsContent={ttsContent} setTTsContent={setTTsContent}
          showPassForm={showPassForm} setShowPassForm={setShowPassForm}
          showAdminForm={showAdminForm} setShowAdminForm={setShowAdminForm}
        />

        <Grid
          ttsContent={ttsContent} setTTsContent={setTTsContent}
        />
        {
        showPassForm &&
          <AuthenticationForm
            showAdminForm={showAdminForm} setShowAdminForm={setShowAdminForm}
            showPassForm={showPassForm} setShowPassForm={setShowPassForm}
          />
        }
        {
          showAdminForm &&
          <AdminForm />
        }
      </div >
    </div>
  );
}

export default App;
