/**
 * nodeStore.js
 *
 * Data access layer for the AAC node graph.
 * Built for `better-sqlite3` (synchronous, Node/Electron-side).
 *
 * npm install better-sqlite3
 *
 * If you're running SQLite in-browser via sql.js/wa-sqlite instead,
 * the SQL below is identical -- you'll just need to await queries
 * and swap .prepare()/.run()/.get()/.all() for that library's API.
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

function createStore(dbPath = 'aac.db') {
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);

  // ---------- internal helpers ----------

  function getChildIds(nodeId) {
    return db
      .prepare('SELECT child_id FROM node_relationships WHERE parent_id = ?')
      .all(nodeId)
      .map((row) => row.child_id);
  }

  function getParentIds(nodeId) {
    return db
      .prepare('SELECT parent_id FROM node_relationships WHERE child_id = ?')
      .all(nodeId)
      .map((row) => row.parent_id);
  }

  function rowToNode(row) {
    if (!row) return null;
    return {
      id: row.id,
      label: row.label,
      icon: row.icon,
      description: row.description,
      children: getChildIds(row.id),
      parents: getParentIds(row.id),
    };
  }

  // ---------- reads ----------

  function getNode(id) {
    const row = db.prepare('SELECT * FROM nodes WHERE id = ?').get(id);
    return rowToNode(row);
  }

  function getAllNodes() {
    const rows = db.prepare('SELECT * FROM nodes').all();
    return rows.map(rowToNode);
  }

  // ---------- relationship helpers ----------

  function linkExists(parentId, childId) {
    return !!db
      .prepare(
        'SELECT 1 FROM node_relationships WHERE parent_id = ? AND child_id = ?'
      )
      .get(parentId, childId);
  }

  /**
   * Would linking parentId -> childId create a cycle?
   * True if parentId is already reachable by walking downward (via child
   * links) starting from childId -- i.e. childId is already an ancestor
   * path away from looping back to parentId.
   */
  function wouldCreateCycle(parentId, childId) {
    if (parentId === childId) return true;

    const visited = new Set();
    const stack = [childId];

    while (stack.length > 0) {
      const current = stack.pop();
      if (current === parentId) return true;
      if (visited.has(current)) continue;
      visited.add(current);
      for (const next of getChildIds(current)) {
        if (!visited.has(next)) stack.push(next);
      }
    }

    return false;
  }

  function addChild(parentId, childId) {
    if (parentId === childId) throw new Error('A node cannot be its own child.');
    if (wouldCreateCycle(parentId, childId)) {
      throw new Error(
        `Cannot link ${parentId} -> ${childId}: this would create a cycle ` +
          `(${childId} can already reach ${parentId}).`
      );
    }
    db.prepare(
      'INSERT OR IGNORE INTO node_relationships (parent_id, child_id) VALUES (?, ?)'
    ).run(parentId, childId);
  }

  function removeChild(parentId, childId) {
    db.prepare(
      'DELETE FROM node_relationships WHERE parent_id = ? AND child_id = ?'
    ).run(parentId, childId);
  }

  function addParent(childId, parentId) {
    addChild(parentId, childId);
  }

  function removeParent(childId, parentId) {
    removeChild(parentId, childId);
  }

  // ---------- create ----------

  /**
   * Create a new node.
   * @param {Object} data
   * @param {string} data.label
   * @param {string} [data.icon]
   * @param {string} [data.description]
   * @param {number[]} [data.parentIds] - existing node ids to link as parents
   * @param {number[]} [data.childIds]  - existing node ids to link as children
   * @returns {Object} the newly created node (with resolved parents/children)
   */
  const addNode = db.transaction((data) => {
    const { label, icon = null, description = null, parentIds = [], childIds = [] } = data;

    if (!label) throw new Error('label is required.');

    const info = db
      .prepare('INSERT INTO nodes (label, icon, description) VALUES (?, ?, ?)')
      .run(label, icon, description);

    const newId = info.lastInsertRowid;

    for (const pId of parentIds) addChild(pId, newId);
    for (const cId of childIds) addChild(newId, cId);

    return getNode(newId);
  });

  // ---------- update ----------

  /**
   * Edit a node's attributes and/or relationships in one call.
   *
   * @param {number} id
   * @param {Object} updates
   * @param {string} [updates.label]
   * @param {string} [updates.icon]
   * @param {string} [updates.description]
   * @param {number[]} [updates.addParents]    - parent ids to link
   * @param {number[]} [updates.removeParents]  - parent ids to unlink
   * @param {number[]} [updates.addChildren]    - child ids to link
   * @param {number[]} [updates.removeChildren] - child ids to unlink
   * @returns {Object} the updated node
   */
  const editNode = db.transaction((id, updates) => {
    const existing = db.prepare('SELECT * FROM nodes WHERE id = ?').get(id);
    if (!existing) throw new Error(`No node with id ${id}`);

    const fields = {};
    if (updates.label !== undefined) fields.label = updates.label;
    if (updates.icon !== undefined) fields.icon = updates.icon;
    if (updates.description !== undefined) fields.description = updates.description;

    if (Object.keys(fields).length > 0) {
      const setClause = Object.keys(fields)
        .map((key) => `${key} = @${key}`)
        .join(', ');
      db.prepare(`UPDATE nodes SET ${setClause} WHERE id = @id`).run({
        ...fields,
        id,
      });
    }

    (updates.addParents || []).forEach((pId) => addParent(id, pId));
    (updates.removeParents || []).forEach((pId) => removeParent(id, pId));
    (updates.addChildren || []).forEach((cId) => addChild(id, cId));
    (updates.removeChildren || []).forEach((cId) => removeChild(id, cId));

    return getNode(id);
  });

  // ---------- delete ----------

  function deleteNode(id) {
    // ON DELETE CASCADE in the schema cleans up node_relationships automatically.
    db.prepare('DELETE FROM nodes WHERE id = ?').run(id);
  }

  return {
    db, // exposed in case you need raw access / to call db.close()
    getNode,
    getAllNodes,
    addNode,
    editNode,
    deleteNode,
    addChild,
    removeChild,
    addParent,
    removeParent,
    wouldCreateCycle,
  };
}

module.exports = { createStore };