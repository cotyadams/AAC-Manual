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
  data,
  setData,
  oldData,
  setOldData
}) {
  return (
    <div className="grid">
      {data.map(node => (
        <GridNode
          node={node} key={node.id}
          setTTsContent={setTTsContent} ttsContent={ttsContent}
          isSelectLeaf={isSelectLeaf} setIsSelectLeaf={setIsSelectLeaf}
          showAdminScreen={showAdminScreen} setShowAdminScreen={setShowAdminScreen}
          setShowAdminForm={setShowAdminForm}
          addChild={addChild} setAddChild={setAddChild}
          data={data} setData={setData}
          oldData={oldData} setOldData={setOldData}
        />
      ))}
    </div>
  );
}