import react from "react";
import "../styles/Grid.css"
import speak from '../Functions/speak'
import * as apiCalls from '../Nodeapi'

export default function GridNode({ node, ttsContent, setTTsContent }) {
  return (
    <button className="grid-node" aria-label={node.label} onClick={(event) => { onSelect(event, node, ttsContent, setTTsContent, vocab, setVocab) }}>
      <span className="grid-node-icon" aria-hidden="true">{node.icon}</span>
      <span className="grid-node-label">{node.label}</span>
    </button>
  );
}

async function onSelect(event, node, ttsContent, setTTsContent) {
  await setTTsContent(node.description)

  if (node.children.length) {
    setVocab(node.children)
  }

  speak(node.description);
}
