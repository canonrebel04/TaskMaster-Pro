import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  language: 'en' | 'es' | 'fr';
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    taskReminders: boolean;
  };
  dataSync: 'auto' | 'manual';
}

export const useProfileViewModel = () => {
  const router = useRouter();
  const theme = useTheme();
  
  // In a real app, these would come from your backend
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: null,
    language: 'en',
    theme: 'system',
    notifications: {
      email: true,
      push: true,
      taskReminders: true,
    },
    dataSync: 'auto',
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Task Master',
      description: '100 tasks completed',
      icon: '🏆',
      unlockedAt: new Date(),
    },
    {
      id: '2',
      title: 'Early Bird',
      description: 'Completed 10 tasks before 9 AM',
      icon: '🌅',
      unlockedAt: new Date(),
    },
    {
      id: '3',
      title: 'Streak Master',
      description: 'Maintained a 7-day streak',
      icon: '🔥',
      unlockedAt: new Date(),
    },
  ]);

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      // In a real app, upload to your backend
      const fakeUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, avatarUrl: fakeUrl }));
      return true;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return false;
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      // In a real app, save to your backend
      setProfile(prev => ({ ...prev, ...updates }));
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  }, []);

  const backupData = useCallback(async () => {
    try {
      // In a real app, implement backup logic
      const data = {
        profile,
        achievements,
        // Add other data to backup
      };
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `taskmaster-backup-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Error backing up data:', error);
      return false;
    }
  }, [profile, achievements]);

  const restoreData = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      // In a real app, validate data and restore to backend
      setProfile(data.profile);
      return true;
    } catch (error) {
      console.error('Error restoring data:', error);
      return false;
    }
  }, []);

  const clearCache = useCallback(async () => {
    try {
      // In a real app, implement cache clearing logic
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // In a real app, implement logout logic
      router.push('/login');
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  }, [router]);

  const deleteAccount = useCallback(async () => {
    try {
      // In a real app, implement account deletion logic
      router.push('/login');
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  }, [router]);

  return {
    profile,
    achievements,
    uploadAvatar,
    updateProfile,
    backupData,
    restoreData,
    clearCache,
    logout,
    deleteAccount,
  };
};
