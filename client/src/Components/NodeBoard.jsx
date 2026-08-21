import React, { useState } from 'react';
import { useNodes } from '../hooks/useNodes';
import { createNode, deleteNode } from '../api/nodeApi';

// parentId={null} shows top-level (root) nodes.
// Pass a node's id as parentId to show that node's children instead.
export default function NodeBoard({ parentId = null }) {
  const { nodes, loading, error, refresh } = useNodes();
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('');

  if (loading) return <p>Loading board…</p>;
  if (error) return <p>Something went wrong: {error.message}</p>;

  const visibleNodes =
    parentId === null
      ? nodes.filter((n) => n.parents.length === 0)
      : nodes.filter((n) => n.parents.includes(parentId));

  async function handleAdd() {
    if (!newLabel.trim()) return;
    await createNode({
      label: newLabel,
      icon: newIcon,
      parentIds: parentId !== null ? [parentId] : [],
    });
    setNewLabel('');
    setNewIcon('');
    refresh();
  }

  async function handleDelete(id, event) {
    event.stopPropagation();
    await deleteNode(id);
    refresh();
  }

  return (
    <div>
      <div >
        {visibleNodes.map((node) => (
          <button
            key={node.id}
            onClick={() => alert(node.description || node.label)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 12,
              minWidth: 80,
            }}
          >
            <span style={{ fontSize: '2rem' }}>{node.icon}</span>
            <span>{node.label}</span>
            <small onClick={(e) => handleDelete(node.id, e)}>✕ remove</small>
          </button>
        ))}
      </div>

      <div >
        <input
          placeholder="icon (emoji)"
          value={newIcon}
          onChange={(e) => setNewIcon(e.target.value)}
          style={{ width: 60, marginRight: 8 }}
        />
        <input
          placeholder="label"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
}
