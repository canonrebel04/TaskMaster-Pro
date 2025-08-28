'use client';

import {
  Box,
  Typography,
  Paper,
  IconButton,
  Collapse,
} from '@mui/material';
import { useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import TaskCard from './TaskCard';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskColumn = ({
  status,
  tasks,
  onUpdateTask,
  onDeleteTask,
}: TaskColumnProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item: { id: string; status: TaskStatus }) => {
      if (item.status !== status) {
        const updatedTask = { ...item, status };
        onUpdateTask(updatedTask as Task);
      }
      return { name: status };
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;

  return (
    // Attach the drop ref to a plain div so the react-dnd connector receives a DOM node.
    <div ref={(node) => {
      // @ts-ignore - react-dnd connector accepts HTMLElement | null
      drop(node as any);
    }}>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          backgroundColor: isActive ? 'action.hover' : 'background.paper',
          transition: 'background-color 0.2s ease-in-out',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Typography variant="h6" component="h2">
          {status.replace('-', ' ').toUpperCase()} ({tasks.length})
        </Typography>
        <IconButton
          sx={{
            transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.2s ease-in-out',
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>
      <Collapse in={!isCollapsed}>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minHeight: 100, // To ensure the drop zone is always present
          }}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
          {tasks.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              No tasks here.
            </Typography>
          )}
        </Box>
      </Collapse>
      </Paper>
    </div>
  );
};

export default TaskColumn;
