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
// higher than express's 100kb default -- uploaded icons are stored as
// base64 data URLs on the node itself, so a single request body can be
// a few hundred KB even after the client-side thumbnail downscaling
app.use(express.json({ limit: '5mb' }));

// GET all nodes
app.get('/api/nodes', (req, res) => {
  res.json(store.getAllNodes());
});

// GET a full dump of the board -- save this file and hand it to someone
// else so they can load your data into their own copy of the app via
// POST /api/import.
app.get('/api/export', (req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename="aac-export.json"');
  res.json(store.exportAll());
});

// REPLACE all nodes and relationships with a previously exported dump.
// body: the JSON produced by GET /api/export (or just its `nodes` array)
app.post('/api/import', (req, res) => {
  try {
    const nodes = store.importAll(req.body);
    res.json({ imported: nodes.length, nodes });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
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

// DELETE a single occurrence of a node -- unlink it from one parent, or
// clear its "show on Home" placement -- rather than deleting it outright.
// Only actually deletes the node if that was its last remaining reference.
// query: ?parentId=<id>  and/or  ?fromTopLevel=true
app.delete('/api/nodes/:id/occurrence', (req, res) => {
  try {
    const { parentId, fromTopLevel } = req.query;
    const result = store.removeNodeOccurrence(Number(req.params.id), {
      parentId: parentId !== undefined ? Number(parentId) : null,
      fromTopLevel: fromTopLevel === 'true',
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a node entirely -- removes it and every link to/from it,
// regardless of how many parents (or Home) it currently appears under.
app.delete('/api/nodes/:id', (req, res) => {
  store.deleteNode(Number(req.params.id));
  res.status(204).send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AAC API running at http://localhost:${PORT}`);
});