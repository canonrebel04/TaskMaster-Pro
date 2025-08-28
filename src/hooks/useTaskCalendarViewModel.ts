import { useState, useCallback } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, isWithinInterval, startOfDay } from 'date-fns';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'todo' | 'in_progress' | 'done';
}

export const useTaskCalendarViewModel = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]); // In real app, this would be from your backend

  const getDaysInMonth = useCallback(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    });
  }, [currentMonth]);

  const getTasksByDate = useCallback((date: Date) => {
    return tasks.filter(task => 
      isSameDay(new Date(task.dueDate), date)
    );
  }, [tasks]);

  const getTaskColorByDueDate = useCallback((dueDate: Date) => {
    const today = startOfDay(new Date());
    const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return 'error.main'; // overdue
    if (daysUntilDue <= 3) return 'warning.main'; // due soon
    return 'success.main'; // due later
  }, []);

  const updateTaskDueDate = useCallback((taskId: string, newDate: Date) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, dueDate: newDate }
          : task
      )
    );
  }, []);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentMonth(prev => addMonths(prev, direction === 'next' ? 1 : -1));
  }, []);

  return {
    currentMonth,
    selectedDate,
    setSelectedDate,
    getDaysInMonth,
    getTasksByDate,
    getTaskColorByDueDate,
    updateTaskDueDate,
    navigateMonth,
    tasks, // Expose tasks for drag and drop functionality
  };
};
