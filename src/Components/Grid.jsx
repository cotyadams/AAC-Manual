import GridNode from "./GridNode.jsx"
import react from "react";
import "../styles/Grid.css"

export default function Grid({ttsContent, setTTsContent, vocab, setVocab}) {
  return (
    <div className="grid">
      {vocab.map(node => (
        <GridNode node={node} key={node.id} setTTsContent={setTTsContent} ttsContent={ttsContent} vocab={vocab} setVocab={setVocab}/>
      ))}
    </div>
  );
}


//<h1>{node.icon}</h1>
//<p>{node.label}</p>