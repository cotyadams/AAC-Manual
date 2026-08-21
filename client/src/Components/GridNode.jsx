import react from "react";
import "../styles/Grid.css"
import speak from '../Functions/speak'
import fetchData from "../Functions/fetchData";
import * as apiCalls from '../Nodeapi'
import AdminForm from "./AdminForm";

export default function GridNode({ node, ttsContent, setTTsContent, showAdminScreen, isSelectLeaf, setIsSelectLeaf, setShowAdminForm, setShowAdminScreen }) {
  const [data, setData] = fetchData();
  return (
    <button className="grid-node" aria-label={node.label} onClick={(event) => { onSelect(event, node, ttsContent, setTTsContent, isSelectLeaf, setIsSelectLeaf, showAdminScreen, setShowAdminScreen, setShowAdminForm) }}>
      <span className="grid-node-icon" aria-hidden="true">{node.icon}</span>
      <span className="grid-node-label">{node.label}</span>
    </button>
  );
}

async function onSelect(event, node, ttsContent, setTTsContent, isSelectLeaf, setIsSelectLeaf, showAdminScreen, setShowAdminScreen, setShowAdminForm) {

  if (showAdminScreen) {
    await setIsSelectLeaf(node)
    await setShowAdminScreen(false)
    await setShowAdminForm(true)
    return
  }

  await setTTsContent(node.description)

  if (node.children.length) {
    setData(node.children)
  }

  speak(node.description);
}

function appendChildItem(node, isSelectLeaf) {
  node.children.push(isSelectLeaf)
}
