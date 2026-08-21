import { useState, useEffect, useCallback } from 'react';
import { fetchAllNodes } from '../api/nodeApi';

export function useNodes() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchAllNodes()
      .then(setNodes)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { nodes, loading, error, refresh };
}