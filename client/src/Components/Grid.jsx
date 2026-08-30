import GridNode from "./GridNode.jsx"
import React, { useState, useEffect } from "react";
import "../styles/Grid.css"
import * as apiCalls from '../Nodeapi'


export default function Grid({
  ttsContent,
  setTTsContent,
  fetchData,
  isSelectLeaf,
  showAdminScreen,
  setShowAdminScreen,
  setIsSelectLeaf,
  setShowAdminForm,
  addChild,
  setAddChild,
  addParent,
  setAddParent,
  data,
  setData,
  oldData,
  setOldData,
  showAllNodes,
  currentParentId,
  setCurrentParentId,
  oldParentIds,
  setOldParentIds,
  searchActive,
  enabledNodeIds
}) {
  const [allNodes, setAllNodes] = useState([]);

  useEffect(() => {
    if (showAdminScreen && showAllNodes) {
      apiCalls.fetchAllNodes().then(setAllNodes);
    }
    // `data` is included so add/delete mutations (which update `data`)
    // also refresh this flat listing without needing a page reload
  }, [showAdminScreen, showAllNodes, data]);

  // Home (root) only shows nodes flagged topLevel; deeper layers show
  // whatever children were navigated into. Admin's "show all" toggle
  // bypasses both to show every node flat for easy editing.
  const isHome = oldData.length === 0;
  const visibleNodes = showAdminScreen && showAllNodes
    ? allNodes
    : isHome ? data.filter(node => node.topLevel) : data;

  return (
    <div className="grid">
      {visibleNodes.map(node => (
        <GridNode
          node={node} key={node.id}
          setTTsContent={setTTsContent} ttsContent={ttsContent}
          isSelectLeaf={isSelectLeaf} setIsSelectLeaf={setIsSelectLeaf}
          showAdminScreen={showAdminScreen} setShowAdminScreen={setShowAdminScreen}
          setShowAdminForm={setShowAdminForm}
          addChild={addChild} setAddChild={setAddChild}
          addParent={addParent} setAddParent={setAddParent}
          data={data} setData={setData}
          oldData={oldData} setOldData={setOldData}
          currentParentId={currentParentId} setCurrentParentId={setCurrentParentId}
          oldParentIds={oldParentIds} setOldParentIds={setOldParentIds}
          disabled={searchActive && !!enabledNodeIds && !enabledNodeIds.has(node.id)}
        />
      ))}
    </div>
  );
}