'use client';

import { useState, useEffect, useCallback } from 'react';
import PocketBase from 'pocketbase';
import { Task } from '@/types/task';

const pb = new PocketBase('http://127.0.0.1:8090');

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
  const records = await pb.collection('tasks').getFullList({
        sort: '-created',
        expand: 'tags',
      });
      setTasks(records);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Real-time updates
    let unsub: (() => void) | undefined;
    (async () => {
      try {
        const res = await pb.collection('tasks').subscribe('*', (e: any) => {
          fetchTasks(); // Refetch all on any change
          // handle event
        });
        // Some PocketBase clients return a Promise that resolves to an unsubscribe function
        if (typeof res === 'function') {
          unsub = res as () => void;
        } else if (res && typeof (res as any).unsubscribe === 'function') {
          // fallback if an object with unsubscribe method is returned
          unsub = () => (res as any).unsubscribe();
        }
      } catch (err) {
        console.warn('Realtime subscribe failed:', err);
      }
    })();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      try {
        if (unsub) unsub();
      } catch (err) {
        /* ignore */
      }
    };
  }, [fetchTasks]);

  const syncTasks = async () => {
    await fetchTasks();
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'collectionId' | 'collectionName' | 'created' | 'updated'>) => {
    try {
      await pb.collection('tasks').create(taskData);
      // Real-time subscription will handle the update
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const updateTask = async (task: Task) => {
    try {
      await pb.collection('tasks').update(task.id, task);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await pb.collection('tasks').delete(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return { tasks, isLoading, isOffline, syncTasks, addTask, updateTask, deleteTask };
};

export default useTasks;
