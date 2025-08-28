import { Box, Typography, Paper, useTheme } from '@mui/material';
import { format, isToday, isSameMonth } from 'date-fns';
import { useDrop } from 'react-dnd';
import { Task } from '@/hooks/useTaskCalendarViewModel';

interface CalendarProps {
  viewModel: {
    currentMonth: Date;
    selectedDate: Date | null;
    setSelectedDate: (date: Date) => void;
    getDaysInMonth: () => Date[];
    getTasksByDate: (date: Date) => Task[];
    getTaskColorByDueDate: (date: Date) => string;
  };
}

export default function Calendar({ viewModel }: CalendarProps) {
  const theme = useTheme();
  const days = viewModel.getDaysInMonth();

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 1,
      width: '100%',
    }}>
      {/* Weekday headers */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <Box
          key={day}
          sx={{
            p: 1,
            textAlign: 'center',
            fontWeight: 'bold',
            color: theme.palette.text.secondary,
          }}
        >
          <Typography variant="subtitle2">{day}</Typography>
        </Box>
      ))}

      {/* Calendar days */}
      {days.map(date => {
        const isSelected = viewModel.selectedDate && 
          format(date, 'yyyy-MM-dd') === format(viewModel.selectedDate, 'yyyy-MM-dd');
        const tasksForDay = viewModel.getTasksByDate(date);

        const [{ isOver }, drop] = useDrop(() => ({
          accept: 'task',
          drop: (item: { id: string }) => {
            // This will be handled by the parent component
            return { date };
          },
          collect: (monitor: any) => ({
            isOver: !!monitor.isOver(),
          }),
        }));

        return (
          <Paper
            ref={drop}
            key={date.toISOString()}
            elevation={isSelected ? 4 : 0}
            sx={{
              p: 1,
              cursor: 'pointer',
              backgroundColor: theme => ({
                ...(isSelected && {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                }),
                ...(isOver && {
                  backgroundColor: theme.palette.action.hover,
                }),
                ...(isToday(date) && {
                  border: `2px solid ${theme.palette.primary.main}`,
                }),
                ...(!isSameMonth(date, viewModel.currentMonth) && {
                  opacity: 0.5,
                }),
              }),
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
            onClick={() => viewModel.setSelectedDate(date)}
          >
            <Typography variant="body2" align="center">
              {format(date, 'd')}
            </Typography>
            {/* Task indicators */}
            {tasksForDay.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 0.5, 
                justifyContent: 'center',
                mt: 0.5 
              }}>
                {tasksForDay.map(task => (
                  <Box
                    key={task.id}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: viewModel.getTaskColorByDueDate(task.dueDate),
                    }}
                  />
                ))}
              </Box>
            )}
          </Paper>
        );
      })}
    </Box>
  );
}
