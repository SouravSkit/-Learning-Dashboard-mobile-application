import { supabase } from './supabase';
import { News, Comment, Profile } from '../types/database';

// News API
export const fetchNews = async (page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('news')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { data: data as News[], count };
};

export const fetchNewsById = async (id: string) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as News;
};

// Comments API
export const fetchComments = async (newsId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('news_id', newsId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as (Comment & { profiles: Profile })[];
};

export const fetchCommentCount = async (newsId: string) => {
  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('news_id', newsId);

  if (error) throw error;
  return count || 0;
};

export const createComment = async (newsId: string, content: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const trimmedContent = content.trim();
  if (!trimmedContent) throw new Error('Comment cannot be empty');
  if (trimmedContent.length > 500) throw new Error('Comment is too long');

  const { data, error } = await supabase
    .from('comments')
    .insert({
      news_id: newsId,
      user_id: user.id,
      content: trimmedContent,
    })
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .single();

  if (error) throw error;
  return data as Comment & { profiles: Profile };
};

export const updateComment = async (commentId: string, content: string) => {
  const trimmedContent = content.trim();
  if (!trimmedContent) throw new Error('Comment cannot be empty');
  if (trimmedContent.length > 500) throw new Error('Comment is too long');

  const { data, error } = await supabase
    .from('comments')
    .update({ content: trimmedContent, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .select()
    .single();

  if (error) throw error;
  return data as Comment;
};

export const deleteComment = async (commentId: string) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
};

// Profile API
export const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
};

export const uploadAvatar = async (userId: string, file: File | Blob) => {
  const fileName = `${userId}/avatar.jpg`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return publicUrl;
};
