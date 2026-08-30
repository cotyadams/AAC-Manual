-- AAC board schema
-- A node graph (not strictly a tree) since a node like "Apple" might
-- reasonably live under both a "Food" parent and a "Colors" parent.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS nodes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    label       TEXT NOT NULL,
    icon        TEXT,               -- emoji or icon identifier/path
    description TEXT,
    topLevel    INTEGER NOT NULL DEFAULT 0,  -- 1 if node should show on the Home grid
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
);

-- Edge table: one row per parent->child link.
-- A node's "children" = rows where it is parent_id.
-- A node's "parents"  = rows where it is child_id.
CREATE TABLE IF NOT EXISTS node_relationships (
    parent_id INTEGER NOT NULL,
    child_id  INTEGER NOT NULL,
    PRIMARY KEY (parent_id, child_id),
    FOREIGN KEY (parent_id) REFERENCES nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id)  REFERENCES nodes(id) ON DELETE CASCADE,
    CHECK (parent_id != child_id)
);

CREATE INDEX IF NOT EXISTS idx_rel_parent ON node_relationships(parent_id);
CREATE INDEX IF NOT EXISTS idx_rel_child  ON node_relationships(child_id);

-- Keep updated_at fresh automatically
CREATE TRIGGER IF NOT EXISTS trg_nodes_updated_at
AFTER UPDATE ON nodes
FOR EACH ROW
BEGIN
    UPDATE nodes SET updated_at = datetime('now') WHERE id = OLD.id;
END;