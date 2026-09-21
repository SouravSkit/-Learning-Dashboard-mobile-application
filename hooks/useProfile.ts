import { useState, useEffect, useCallback } from 'react';
import { Profile } from '../types/database';
import { fetchProfile, updateProfile, uploadAvatar } from '../lib/api';

interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  updateAvatar: (file: File | Blob) => Promise<void>;
  refresh: () => void;
}

export const useProfile = (userId: string | undefined): UseProfileReturn => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadProfile = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await fetchProfile(userId);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const updateProfileData = useCallback(async (updates: Partial<Profile>) => {
    if (!userId) throw new Error('Not authenticated');

    try {
      setUpdating(true);
      const data = await updateProfile(userId, updates);
      setProfile(data);
    } catch (err) {
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [userId]);

  const updateAvatar = useCallback(async (file: File | Blob) => {
    if (!userId) throw new Error('Not authenticated');

    try {
      setUpdating(true);
      const avatarUrl = await uploadAvatar(userId, file);
      await updateProfileData({ avatar_url: avatarUrl });
    } catch (err) {
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [userId, updateProfileData]);

  const refresh = useCallback(() => {
    setLoading(true);
    loadProfile();
  }, [userId]);

  return {
    profile,
    loading,
    error,
    updating,
    updateProfile: updateProfileData,
    updateAvatar,
    refresh,
  };
};
