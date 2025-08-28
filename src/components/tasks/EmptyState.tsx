'use client';

import { Box, Typography, Button } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';

const EmptyState = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        textAlign: 'center',
        color: 'text.secondary',
      }}
    >
      <AddTaskIcon sx={{ fontSize: 80, mb: 2 }} />
      <Typography variant="h5" component="p" gutterBottom>
        No tasks yet!
      </Typography>
      <Typography variant="body1">
        Click the "Add Task" button to create your first task.
      </Typography>
    </Box>
  );
};

export default EmptyState;
