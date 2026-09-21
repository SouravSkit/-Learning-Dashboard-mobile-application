import { useState, useEffect, useCallback } from 'react';
import { News } from '../types/database';
import { fetchNews, fetchNewsById, fetchCommentCount } from '../lib/api';

interface NewsWithCount extends News {
  comment_count: number;
}

interface UseNewsReturn {
  news: NewsWithCount[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  loadMore: () => void;
  refresh: () => void;
  hasMore: boolean;
}

export const useNews = (): UseNewsReturn => {
  const [news, setNews] = useState<NewsWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadNews = async (pageNum: number, isRefresh: boolean = false) => {
    try {
      setError(null);
      const { data, count } = await fetchNews(pageNum, 10);

      // Fetch comment counts for each news item
      const newsWithCounts = await Promise.all(
        (data || []).map(async (item: News) => {
          const commentCount = await fetchCommentCount(item.id);
          return { ...item, comment_count: commentCount };
        })
      );

      if (isRefresh) {
        setNews(newsWithCounts);
      } else {
        setNews((prev) => [...prev, ...newsWithCounts]);
      }

      // Check if there are more items
      const totalLoaded = pageNum * 10;
      setHasMore(totalLoaded < (count || 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews(1, true);
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNews(nextPage);
    }
  }, [page, loading, hasMore]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    loadNews(1, true);
  }, []);

  return {
    news,
    loading,
    error,
    refreshing,
    loadMore,
    refresh,
    hasMore,
  };
};

// Hook for single news item
export const useNewsItem = (id: string) => {
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const data = await fetchNewsById(id);
        setNews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [id]);

  return { news, loading, error };
};
