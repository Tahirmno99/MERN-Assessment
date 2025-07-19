import { useState, useEffect, useCallback } from 'react';

const cache = new Map();

export const useApi = (url, options = {}, { skip = false } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    const cacheKey = JSON.stringify({ url, options });

    if (cache.has(cacheKey)) {
      setData(cache.get(cacheKey));
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const result = await response.json();
      cache.set(cacheKey, result);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  const refetch = () => {
    const cacheKey = JSON.stringify({ url, options });
    cache.delete(cacheKey);
    fetchData();
  };

  useEffect(() => {
    if (!skip) fetchData();
  }, [fetchData, skip]);

  return { data, loading, error, refetch, run: fetchData };
};
