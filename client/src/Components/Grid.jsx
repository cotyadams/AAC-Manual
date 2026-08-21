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
  setShowAdminForm
}) {
  const [data, setData] = fetchData();
  console.log("grid", data)
  return (
    <div className="grid">
      {data.map(node => (
        <GridNode
          node={node} key={node.id}
          setTTsContent={setTTsContent} ttsContent={ttsContent}
          isSelectLeaf={isSelectLeaf} setIsSelectLeaf={setIsSelectLeaf}
          showAdminScreen={showAdminScreen} setShowAdminScreen={setShowAdminScreen}
          setShowAdminForm={setShowAdminForm}
        />
      ))}
    </div>
  );
}