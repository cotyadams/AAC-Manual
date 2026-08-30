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
  data,
  setData,
  oldData,
  setOldData
}) {
  return (
    <button className="grid-node" aria-label={node.label} onClick={(event) => {
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
        data,
        setData,
        oldData,
        setOldData
      })
    }}>
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
  data,
  setData,
  oldData,
  setOldData
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

    await apiCalls.updateNode(isSelectLeaf.id, newNode);

    return
  }

  else if (showAdminScreen) {
    setIsSelectLeaf(node)
    setShowAdminScreen(false)
    setShowAdminForm(true)
    return
  }
  else if (node.children.length > 0) {
    // add current data to oldData array for future backtracking
    //backtrack length against array length to prevent duplicate old state at end of train?

    console.log('children: ', node.children)
    setOldData([...oldData, data]);

    console.log("oldData onFunction: ", oldData)
    console.log("oldData.len onFunction: ", oldData.length)

    let newData = [];

    // node.children.map(async (childID) => {
    //   newData = [...newData, await apiCalls.fetchNode(childID)];
    // })
    for (let i = 0; i < node.children.length; i++) {
      newData = [...newData, await apiCalls.fetchNode(node.children[i])]
    }

    console.log("newData: ", newData)
    console.log("oldData: ", oldData)
    setData([...newData])
  }

  await setTTsContent(ttsContent + node.description + ' ')
  speak(node.description);
}

function appendChildItem(node, isSelectLeaf) {
  node.children.push(isSelectLeaf)
}
