'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  CircularProgress,
} from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task, TaskStatus } from '@/types/task';
import { default as TaskColumn } from '@/components/tasks/TaskColumn';
import { default as TaskSearchFilter } from '@/components/tasks/TaskSearchFilter';
import { default as EmptyState } from '@/components/tasks/EmptyState';
import { default as OfflineBanner } from '@/components/tasks/OfflineBanner';
import useTasks from '@/hooks/useTasks';

const TaskListScreen = () => {
  const {
    tasks,
    isLoading,
    isOffline,
    syncTasks,
    addTask,
    updateTask,
    deleteTask,
  } = useTasks();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await syncTasks();
    setIsSyncing(false);
  };

  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const status = task.status || TaskStatus.PENDING;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [tasks]);

  if (isLoading && tasks.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        <TaskSearchFilter onAddTask={addTask} />

        {isOffline && <OfflineBanner onSync={handleSync} isSyncing={isSyncing} />}

        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, 1fr)',
              },
              gap: 2,
              mt: 2,
            }}
          >
            <TaskColumn
              status={TaskStatus.PENDING}
              tasks={groupedTasks[TaskStatus.PENDING] || []}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
            <TaskColumn
              status={TaskStatus.IN_PROGRESS}
              tasks={groupedTasks[TaskStatus.IN_PROGRESS] || []}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
            <TaskColumn
              status={TaskStatus.COMPLETED}
              tasks={groupedTasks[TaskStatus.COMPLETED] || []}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </Box>
        )}
      </Box>
    </DndProvider>
  );
};

export default TaskListScreen;
