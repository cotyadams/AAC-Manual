import { useState, useEffect } from 'react'
import GridNode from './GridNode.jsx'
import * as apiCalls from '../Nodeapi'
import "../styles/Grid.css"

// Admin screen: unlike Grid (which only shows topLevel nodes at the root
// layer), this always lists every node so any node can be found and edited,
// regardless of its topLevel flag or position in the tree.
export default function AdminScreen({
  ttsContent,
  setTTsContent,
  isSelectLeaf,
  setIsSelectLeaf,
  showAdminScreen,
  setShowAdminScreen,
  setShowAdminForm,
  addChild,
  setAddChild,
}) {
  const [allNodes, setAllNodes] = useState([])

  useEffect(() => {
    apiCalls.fetchAllNodes().then(setAllNodes)
  }, [])

  return (
    <div className="grid admin-screen-container">
      {allNodes.map(node => (
        <GridNode
          node={node} key={node.id}
          ttsContent={ttsContent} setTTsContent={setTTsContent}
          isSelectLeaf={isSelectLeaf} setIsSelectLeaf={setIsSelectLeaf}
          showAdminScreen={showAdminScreen} setShowAdminScreen={setShowAdminScreen}
          setShowAdminForm={setShowAdminForm}
          addChild={addChild} setAddChild={setAddChild}
          data={allNodes} setData={setAllNodes}
          oldData={[]} setOldData={() => { }}
        />
      ))}
    </div>
  )
}