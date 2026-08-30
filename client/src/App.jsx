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
  // when in admin mode, show every node flat (for easy editing) instead of the normal tree
  const [showAllNodes, setShowAllNodes] = useState(false)
  // when editing a node, this is the node to edit
  const [isSelectLeaf, setIsSelectLeaf] = useState({})
  // when adding child to existing node indicator
  const [addChild, setAddChild] = useState(false)
  const [data, setData] = fetchData();
  const [oldData, setOldData] = useState([]);
  // when creating a child item for a current node
  // const [createChild, setCreateChild] = useState()
  // bool to indicate topLevel

  console.log('table: ', {
    "showAdminScreen": showAdminScreen,
    "showAdminForm": showAdminForm,
    "showPassForm": showPassForm,
    "isSelectLeaf": isSelectLeaf,
  })


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
          addChild={addChild} setAddChild={setAddChild}
          data={data} setData={setData}
          isSelectLeaf={isSelectLeaf} setIsSelectLeaf={setIsSelectLeaf}
          oldData={oldData} setOldData={setOldData}
          showAllNodes={showAllNodes} setShowAllNodes={setShowAllNodes}

        />

        {!showAdminForm && !showPassForm &&
          <Grid
            ttsContent={ttsContent} setTTsContent={setTTsContent}
            data={data} setData={setData}
            oldData={oldData} setOldData={setOldData}
            fetchData={fetchData}
            setShowAdminScreen={setShowAdminScreen} showAdminScreen={showAdminScreen}
            isSelectLeaf={isSelectLeaf} setIsSelectLeaf={setIsSelectLeaf}
            setShowAdminForm={setShowAdminForm}
            addChild={addChild} setAddChild={setAddChild}
            showAllNodes={showAllNodes}
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
            addChild={addChild} setAddChild={setAddChild}
            data={data} setData={setData}

          />
        }
      </div >
    </div>
  );
}

export default App;
