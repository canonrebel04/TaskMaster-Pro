'use client';

import { Box, Container, Typography, IconButton, useTheme, Paper, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight, CalendarMonth } from '@mui/icons-material';
import { format } from 'date-fns';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Calendar from '@/components/calendar/Calendar';
import TaskList from '@/components/calendar/TaskList';
import { useTaskCalendarViewModel } from '@/hooks/useTaskCalendarViewModel';

export default function CalendarPage() {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up('md'));
  const viewModel = useTaskCalendarViewModel();

  return (
    <DndProvider backend={HTML5Backend}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          {/* Calendar Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 3 
          }}>
            <Typography variant="h4" component="h1">
              Calendar
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => viewModel.navigateMonth('prev')}
                aria-label="Previous month"
              >
                <ChevronLeft />
              </IconButton>
              <Typography variant="h6">
                {format(viewModel.currentMonth, 'MMMM yyyy')}
              </Typography>
              <IconButton
                onClick={() => viewModel.navigateMonth('next')}
                aria-label="Next month"
              >
                <ChevronRight />
              </IconButton>
              <IconButton
                aria-label="Sync with Google Calendar"
                sx={{ ml: 2 }}
                onClick={() => {/* TODO: Implement Google Calendar sync */}}
              >
                <CalendarMonth />
              </IconButton>
            </Box>
          </Box>

          {/* Calendar Grid and Task List */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: isTablet ? '3fr 1fr' : '1fr',
            gap: 3,
          }}>
            <Calendar viewModel={viewModel} />
            {viewModel.selectedDate && (
              <TaskList
                date={viewModel.selectedDate}
                tasks={viewModel.getTasksByDate(viewModel.selectedDate)}
                onUpdateDueDate={viewModel.updateTaskDueDate}
              />
            )}
          </Box>
        </Paper>
      </Container>
    </DndProvider>
  );
}
