import TTSBar from './Components/TTSBar.jsx'
import './styles/App.css';
import Controls from './Components/Controls.jsx'
import Grid from './Components/Grid.jsx';
import { useState, useEffect } from 'react'
import * as apiCalls from "./Nodeapi.js"
import AuthenticationForm from './Components/AuthenticationForm.jsx';
import AdminForm from './Components/AdminForm.jsx';
import AdminScreen from './Components/AdminScreen.jsx'
import fetchData from './Functions/fetchData.js';


function App() {
  const [ttsContent, setTTsContent] = useState('');
  const [showPassForm, setShowPassForm] = useState(false)
  const [showAdminScreen, setShowAdminScreen] = useState(false)
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [isSelectLeaf, setIsSelectLeaf] = useState({})

  console.log('table: ', {
    "showAdminScreen": showAdminScreen,
    "showAdminForm": showAdminForm,
    "showPassForm": showPassForm,
    "isSelectLeaf": isSelectLeaf,
  })

  const [data, setData] = fetchData();

  return (
    <div className="App">
      <div className="app-main">
        <TTSBar
          ttsContent={ttsContent} setTTsContent={setTTsContent}
        />

        <Controls
          ttsContent={ttsContent} setTTsContent={setTTsContent}
          showPassForm={showPassForm} setShowPassForm={setShowPassForm}
          showAdminScreen={showAdminScreen} setShowAdminScreen={setShowAdminScreen}
          showAdminForm={showAdminForm} setShowAdminForm={setShowAdminForm}
        />

        {!showAdminForm && !showPassForm && <Grid
          ttsContent={ttsContent} setTTsContent={setTTsContent}
          data={data} setData={setData}
          fetchData={fetchData}
          setShowAdminScreen={setShowAdminScreen} showAdminScreen={showAdminScreen}
          isSelectLeaf={isSelectLeaf} setIsSelectLeaf={setIsSelectLeaf}
          setShowAdminForm={setShowAdminForm}
        />
        }
        {
          showPassForm &&
          <AuthenticationForm
            showAdminScreen={showAdminScreen} setShowAdminScreen={setShowAdminScreen}
            showPassForm={showPassForm} setShowPassForm={setShowPassForm}
          />
        }
        {
          showAdminForm &&
          <AdminForm
            setShowAdminScreen={setShowAdminScreen}
            setShowAdminForm={setShowAdminForm}
            isSelectLeaf={isSelectLeaf} setIsSelectLeaf={setIsSelectLeaf}
          />
        }
      </div >
    </div>
  );
}

export default App;
