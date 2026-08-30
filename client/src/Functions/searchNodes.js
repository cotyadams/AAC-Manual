// Search helpers used by the TTS bar search feature.
//
// `allNodes` is expected to be the flat list returned by
// apiCalls.fetchAllNodes() -- every node in the graph, each carrying its
// own `children` and `parents` id arrays (see server/nodeStore.js). That
// full graph (not whatever subset is currently on screen) is what lets us
// walk up to ancestors and down to descendants regardless of which layer
// the user is currently viewing.

// Returns the ids of every node whose label or description contains
// `query` (case-insensitive).
export function findMatchingNodeIds(allNodes, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return allNodes
    .filter((node) => {
      const label = (node.label || '').toLowerCase();
      const description = (node.description || '').toLowerCase();
      return label.includes(normalized) || description.includes(normalized);
    })
    .map((node) => node.id);
}

// Given the matched node ids, returns a Set of every node id that lies on
// a path leading to one of those matches: the matches themselves, every
// ancestor of a match (so there's a clickable route down to it from Home),
// and every descendant of a match (so the rest of a found node's subtree
// stays reachable once you've navigated into it).
export function computeAllowedNodeIds(allNodes, matchIds) {
  const byId = new Map(allNodes.map((node) => [node.id, node]));
  const allowed = new Set(matchIds);

  const ancestorQueue = [...matchIds];
  while (ancestorQueue.length) {
    const node = byId.get(ancestorQueue.pop());
    if (!node) continue;
    for (const parentId of node.parents || []) {
      if (!allowed.has(parentId)) {
        allowed.add(parentId);
        ancestorQueue.push(parentId);
      }
    }
  }

  const descendantQueue = [...matchIds];
  while (descendantQueue.length) {
    const node = byId.get(descendantQueue.pop());
    if (!node) continue;
    for (const childId of node.children || []) {
      if (!allowed.has(childId)) {
        allowed.add(childId);
        descendantQueue.push(childId);
      }
    }
  }

  return allowed;
}