import react from "react";
import "../styles/Grid.css"
import speak from '../Functions/speak'
import fetchData from "../Functions/fetchData";
import * as apiCalls from '../Nodeapi'
import AdminForm from "./AdminForm";

export default function GridNode({
  node,
  ttsContent,
  setTTsContent,
  showAdminScreen,
  isSelectLeaf,
  setIsSelectLeaf,
  setShowAdminForm,
  setShowAdminScreen,
  addChild,
  setAddChild,
  addParent,
  setAddParent,
  data,
  setData,
  oldData,
  setOldData,
  currentParentId,
  setCurrentParentId,
  oldParentIds,
  setOldParentIds,
  disabled
}) {
  return (
    <button
      className="grid-node"
      aria-label={node.label}
      disabled={disabled}
      onClick={(event) => {
        console.log("on click: ", oldData)
        onSelect({
          event,
          node,
          ttsContent,
          setTTsContent,
          isSelectLeaf,
          setIsSelectLeaf,
          showAdminScreen,
          setShowAdminScreen,
          setShowAdminForm,
          addChild,
          setAddChild,
          addParent,
          setAddParent,
          data,
          setData,
          oldData,
          setOldData,
          currentParentId,
          setCurrentParentId,
          oldParentIds,
          setOldParentIds
        })
      }}
    >
      <span className="grid-node-icon" aria-hidden="true">{node.icon}</span>
      <span className="grid-node-label">{node.label}</span>
    </button>
  );
}



async function onSelect({
  event,
  node,
  ttsContent,
  setTTsContent,
  isSelectLeaf,
  setIsSelectLeaf,
  showAdminScreen,
  setShowAdminScreen,
  setShowAdminForm,
  addChild,
  setAddChild,
  addParent,
  setAddParent,
  data,
  setData,
  oldData,
  setOldData,
  currentParentId,
  setCurrentParentId,
  oldParentIds,
  setOldParentIds
}) {


  function clearData() {
    setData([])
  }

  if (addChild) {
    console.log('Parent: ', isSelectLeaf)
    console.log('Child: ', node)

    const newNode = {
      addChildren: [node.id]
    }

    try {
      const updatedParent = await apiCalls.updateNode(isSelectLeaf.id, newNode);

      // the parent's cached children list is now stale wherever it's
      // sitting (current level and every level on the back stack) --
      // patch it in place so the new child shows up without a refresh
      const patchParent = (n) => (n.id === updatedParent.id ? updatedParent : n);
      setData(data.map(patchParent));
      setOldData(oldData.map((level) => level.map(patchParent)));
      if (isSelectLeaf.id === updatedParent.id) {
        setIsSelectLeaf(updatedParent);
      }
    } catch (err) {
      alert(`Failed to add child: ${err.message}`);
    }

    return
  }

  else if (addParent) {
    console.log('Child (node being edited): ', isSelectLeaf)
    console.log('Parent: ', node)

    // the reverse of addChild: the node being edited (isSelectLeaf) gets
    // appended to the *clicked* node's children, so the clicked node
    // becomes a parent of the node being edited
    const newNode = {
      addChildren: [isSelectLeaf.id]
    }

    try {
      const updatedParent = await apiCalls.updateNode(node.id, newNode);

      // the clicked node's cached children list is now stale wherever
      // it's sitting (current level and every level on the back stack) --
      // patch it in place so it reflects the new relationship without a refresh
      const patchParent = (n) => (n.id === updatedParent.id ? updatedParent : n);
      setData(data.map(patchParent));
      setOldData(oldData.map((level) => level.map(patchParent)));
    } catch (err) {
      alert(`Failed to add parent: ${err.message}`);
    }

    return
  }

  else if (showAdminScreen) {
    setIsSelectLeaf(node)
    setShowAdminScreen(false)
    setShowAdminForm(true)
    return
  }
  else if (node.children.length > 0) {
    // fetch the child nodes BEFORE touching any navigation state. If we
    // update oldData/currentParentId first and only set `data` once the
    // fetches resolve, React renders an in-between frame where `data`
    // still holds the previous layer's full node list but Grid's
    // isHome check has already flipped -- which briefly shows the raw
    // (unfiltered) list before the real child data lands. Fetching first
    // and committing all the state together avoids that extra render.
    let newData = [];
    for (let i = 0; i < node.children.length; i++) {
      newData = [...newData, await apiCalls.fetchNode(node.children[i])]
    }

    setOldData([...oldData, data]);
    setOldParentIds([...oldParentIds, currentParentId]);
    setCurrentParentId(node.id);
    setData(newData)
  }

  if (node.description) {
    await setTTsContent(ttsContent + node.description + ' ')
    speak(node.description);

  }
}

function appendChildItem(node, isSelectLeaf) {
  node.children.push(isSelectLeaf)
}