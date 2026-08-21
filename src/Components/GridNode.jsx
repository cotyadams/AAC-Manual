import react from "react";
import "../styles/Grid.css"
import speak from '../Functions/speak'

/* 
    {
    "id": "eat",
    "label": "Eat",
    "icon": "🍎",
    "description": "I want to eat",
    "children": [
      {
        "id": "apple",
        "label": "Apple",
        "icon": "🍎",
        "description": "I want an apple",
        "children": []
      },
      {
        "id": "banana",
        "label": "Banana",
        "icon": "🍌",
        "description": "I want a banana",
        "children": []
      },
      {
        "id": "bread",
        "label": "Bread",
        "icon": "🍞",
        "description": "I want bread",
        "children": []
      }
    ]
  }
*/
export default function GridNode({ node, ttsContent, setTTsContent, vocab, setVocab }) {
  return (
    <button className="grid-node" aria-label={node.label} onClick={(event) => { onSelect(event, node, ttsContent, setTTsContent, vocab, setVocab) }}>
      <span className="grid-node-icon" aria-hidden="true">{node.icon}</span>
      <span className="grid-node-label">{node.label}</span>
    </button>
  );
}

async function onSelect(event, node, ttsContent, setTTsContent, vocab, setVocab) {
  await setTTsContent(node.description)

  if (node.children.length) {
    setVocab(node.children)
  }

  speak(node.description);
}
