'use client';


import {
  Box,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Task, TaskStatus } from '@/types/task';

interface TaskSearchFilterProps {
  onAddTask: (task: Omit<Task, 'id' | 'collectionId' | 'collectionName' | 'created' | 'updated'>) => void;
}

const TaskSearchFilter = ({ onAddTask }: TaskSearchFilterProps) => {
  const handleClose = () => {
    // Placeholder for filter close handler
    console.log('Filter closed');
  };

  const handleAddTask = () => {
    // A simplified new task. In a real app, this would open a detailed dialog.
    onAddTask({
      title: 'New Task',
      description: '',
      dueDate: new Date().toISOString(),
      priority: 1,
      status: TaskStatus.PENDING,
      tags: [],
    });
    handleClose();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 1,
        backgroundColor: 'background.paper',
        borderRadius: 1,
      }}
    >
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search tasks..."
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{ flexGrow: 1 }}
      />
      <IconButton>
        <FilterListIcon />
      </IconButton>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddTask}
      >
        Add Task
      </Button>
    </Box>
  );
};

export default TaskSearchFilter;
