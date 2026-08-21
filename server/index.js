const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { createStore } = require('./nodeStore');

const app = express();

// In Docker we'll point this at a mounted volume (e.g. /app/data/aac.db)
// so the database survives container rebuilds. Locally it just defaults
// to a file in this folder, same as before.
const dbPath = process.env.DB_PATH || 'aac.db';
fs.mkdirSync(path.dirname(dbPath) || '.', { recursive: true });
const store = createStore(dbPath);

app.use(cors());        // allows the React dev server (different port) to call this API
app.use(express.json());

// GET all nodes
app.get('/api/nodes', (req, res) => {
  res.json(store.getAllNodes());
});

// GET one node
app.get('/api/nodes/:id', (req, res) => {
  const node = store.getNode(Number(req.params.id));
  if (!node) return res.status(404).json({ error: 'Node not found' });
  res.json(node);
});

// CREATE a node
// body: { label, icon, description, parentIds, childIds }
app.post('/api/nodes', (req, res) => {
  try {
    const node = store.addNode(req.body);
    res.status(201).json(node);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// EDIT a node (attributes and/or relationships)
// body: { label?, icon?, description?, addParents?, removeParents?, addChildren?, removeChildren? }
app.put('/api/nodes/:id', (req, res) => {
  try {
    const node = store.editNode(Number(req.params.id), req.body);
    res.json(node);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a node
app.delete('/api/nodes/:id', (req, res) => {
  store.deleteNode(Number(req.params.id));
  res.status(204).send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AAC API running at http://localhost:${PORT}`);
});