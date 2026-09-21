import { useState, useEffect, useCallback } from 'react';
import { Comment, Profile } from '../types/database';
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from '../lib/api';

type CommentWithProfile = Comment & { profiles: Profile };

interface UseCommentsReturn {
  comments: CommentWithProfile[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  addComment: (content: string) => Promise<void>;
  editComment: (commentId: string, content: string) => Promise<void>;
  removeComment: (commentId: string) => Promise<void>;
  refresh: () => void;
}

export const useComments = (newsId: string): UseCommentsReturn => {
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    try {
      setError(null);
      const data = await fetchComments(newsId);
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [newsId]);

  const addComment = useCallback(async (content: string) => {
    try {
      setSubmitting(true);
      const newComment = await createComment(newsId, content);
      setComments((prev) => [newComment, ...prev]);
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [newsId]);

  const editComment = useCallback(async (commentId: string, content: string) => {
    try {
      setSubmitting(true);
      await updateComment(commentId, content);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, content, updated_at: new Date().toISOString() }
            : comment
        )
      );
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const removeComment = useCallback(async (commentId: string) => {
    try {
      setSubmitting(true);
      await deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    loadComments();
  }, [newsId]);

  return {
    comments,
    loading,
    error,
    submitting,
    addComment,
    editComment,
    removeComment,
    refresh,
  };
};
