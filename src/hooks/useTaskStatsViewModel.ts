import { useState, useCallback, useMemo } from 'react';
import { format, startOfDay, subDays, isWithinInterval, isSameDay } from 'date-fns';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: Date;
  completedAt?: Date;
}

interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  streak: number;
  productivityScore: number;
  completedByDay: { date: string; count: number }[];
}

export const useTaskStatsViewModel = () => {
  // In a real app, this would come from your backend
  const [tasks] = useState<Task[]>([
    // Sample data - replace with real data
    { id: '1', title: 'Task 1', status: 'completed', dueDate: new Date(), completedAt: new Date() },
    { id: '2', title: 'Task 2', status: 'in_progress', dueDate: new Date() },
    { id: '3', title: 'Task 3', status: 'pending', dueDate: new Date() },
  ]);

  const getTaskStats = useCallback((): TaskStats => {
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(now, i));
    
    // Calculate task counts
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    
    // Calculate streak
    let streak = 0;
    let currentDate = startOfDay(now);
    
    while (true) {
      const tasksCompletedToday = tasks.filter(task => 
        task.status === 'completed' && 
        task.completedAt && 
        isSameDay(task.completedAt, currentDate)
      ).length;
      
      if (tasksCompletedToday > 0) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }

    // Calculate productivity score (0-100)
    const overdueTasks = tasks.filter(task => 
      task.status !== 'completed' && 
      new Date(task.dueDate) < now
    ).length;
    
    const productivityScore = Math.round(
      (completed / (completed + overdueTasks || 1)) * 100
    );

    // Calculate completed tasks by day
    const completedByDay = last7Days.map(date => ({
      date: format(date, 'MMM dd'),
      count: tasks.filter(task => 
        task.status === 'completed' && 
        task.completedAt && 
        isSameDay(task.completedAt, date)
      ).length
    })).reverse();

    return {
      total: tasks.length,
      completed,
      inProgress,
      pending,
      streak,
      productivityScore,
      completedByDay,
    };
  }, [tasks]);

  const exportStats = useCallback(() => {
    const stats = getTaskStats();
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Tasks', stats.total],
      ['Completed Tasks', stats.completed],
      ['In Progress Tasks', stats.inProgress],
      ['Pending Tasks', stats.pending],
      ['Current Streak', stats.streak],
      ['Productivity Score', `${stats.productivityScore}%`],
      [''],
      ['Date', 'Completed Tasks'],
      ...stats.completedByDay.map(day => [day.date, day.count])
    ]
      .map(row => row.join(','))
      .join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `taskmaster-stats-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [getTaskStats]);

  return {
    getTaskStats,
    exportStats
  };
};
