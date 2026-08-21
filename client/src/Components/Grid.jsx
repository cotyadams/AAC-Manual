import GridNode from "./GridNode.jsx"
import React, { useState, useEffect } from "react";
import "../styles/Grid.css"
import * as apiCalls from '../Nodeapi'


export default function Grid({ ttsContent, setTTsContent }) {
  let [data, setData] = useState([])
  useEffect(() => {
    apiCalls.fetchAllNodes().then(setData).then(console.log((data)));
  }, [])
  return (
    <div className="grid">
      {data.map(node => (
        <GridNode
          node={node} key={node.id}
          setTTsContent={setTTsContent} ttsContent={ttsContent}
        />
      ))}
    </div>
  );
}