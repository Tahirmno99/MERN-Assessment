import { useEffect, useState, useRef, useCallback } from 'react';
import { useApi } from './useApi';

export const useInfiniteScrollFeed = ({ baseUrl, token }) => {
  const [page, setPage] = useState(1);
  const [feed, setFeed] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [localLoading, setLocalLoading] = useState(false);
  const observer = useRef();

  const url = `${baseUrl}/feed?page=${page}&limit=5`;
  const headers = { Authorization: `Bearer ${token}` };
  const { data, error, loading, run } = useApi(url, { headers }, { skip: true });

  const lastPostRef = useCallback((node) => {
    if (loading || localLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, localLoading]);

  useEffect(() => {
    const fetchNext = async () => {
      setLocalLoading(true);
      await run();
      setLocalLoading(false);
    };

    fetchNext();
  }, [page]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setFeed((prev) => [...prev, ...data]);
      setHasMore(data.length === 5);
    }
  }, [data]);

  return {
    feed,
    loading: loading || localLoading,
    error,
    lastPostRef,
  };
};
