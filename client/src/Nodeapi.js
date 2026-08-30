const BASE_URL = 'http://192.168.0.12:3098/api';

export async function fetchAllNodes() {
  const res = await fetch(`${BASE_URL}/nodes`);
  if (!res.ok) throw new Error('Failed to fetch nodes');
  return res.json();
}

export async function fetchNode(id) {
  const res = await fetch(`${BASE_URL}/nodes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch node');
  return res.json();
}

export async function createNode(data) {
  const res = await fetch(`${BASE_URL}/nodes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create node');
  return res.json();
}

export async function updateNode(id, updates) {
  const res = await fetch(`${BASE_URL}/nodes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to update node');
  return res.json();
}

export async function deleteNode(id) {
  const res = await fetch(`${BASE_URL}/nodes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete node');
}

// Removes just one occurrence of a node -- either its link under a single
// parent (pass parentId) or its "show on Home" placement (pass
// fromTopLevel: true). Only actually deletes the node if that was its
// last remaining reference; returns { deleted, node } either way.
export async function removeNodeOccurrence(id, { parentId, fromTopLevel } = {}) {
  const params = new URLSearchParams();
  if (parentId !== undefined && parentId !== null) params.set('parentId', parentId);
  if (fromTopLevel) params.set('fromTopLevel', 'true');

  const res = await fetch(`${BASE_URL}/nodes/${id}/occurrence?${params.toString()}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to remove node');
  return res.json();
}