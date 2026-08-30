// Checks that a parsed JSON file looks like a dump produced by
// GET /api/export, before it's sent on to POST /api/import.
// Returns an error message string if invalid, or null if it looks valid.
export default function validateImportPayload(parsed) {
    const nodes = Array.isArray(parsed)
        ? parsed
        : parsed && Array.isArray(parsed.nodes)
            ? parsed.nodes
            : null;

    if (!nodes) {
        return 'Expected a "nodes" array (the format produced by the Export button).';
    }

    for (const node of nodes) {
        if (typeof node !== 'object' || node === null) {
            return 'Every entry in "nodes" must be an object.';
        }
        if (node.id === undefined || node.id === null) {
            return 'Every node needs an "id".';
        }
        if (typeof node.label !== 'string' || !node.label.trim()) {
            return `Node ${node.id} is missing a non-empty "label".`;
        }
        if (node.children !== undefined && !Array.isArray(node.children)) {
            return `Node ${node.id}'s "children" must be an array.`;
        }
    }

    return null;
}