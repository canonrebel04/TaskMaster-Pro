import { Box, Typography, Paper, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { useDrag } from 'react-dnd';
import { Task } from '@/hooks/useTaskCalendarViewModel';

interface TaskListProps {
  date: Date;
  tasks: Task[];
  onUpdateDueDate: (taskId: string, newDate: Date) => void;
}

const TaskItem = ({ task, onUpdateDueDate }: { task: Task; onUpdateDueDate: (taskId: string, newDate: Date) => void }) => {
  const theme = useTheme();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item: { id: string }, monitor: any) => {
      const dropResult = monitor.getDropResult() as { date: Date };
      if (dropResult) {
        onUpdateDueDate(task.id, dropResult.date);
      }
    },
  }));

  return (
    <Paper
      ref={drag}
      elevation={isDragging ? 4 : 1}
      sx={{
        p: 2,
        mb: 1,
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        borderLeft: `4px solid ${theme.palette[task.status === 'done' ? 'success' : task.status === 'in_progress' ? 'warning' : 'info'].main}`,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      <Typography variant="subtitle2">{task.title}</Typography>
      {task.description && (
        <Typography variant="body2" color="text.secondary" noWrap>
          {task.description}
        </Typography>
      )}
    </Paper>
  );
};

export default function TaskList({ date, tasks, onUpdateDueDate }: TaskListProps) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tasks for {format(date, 'MMMM d, yyyy')}
      </Typography>
      {tasks.length === 0 ? (
        <Typography color="text.secondary">No tasks for this day</Typography>
      ) : (
        tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdateDueDate={onUpdateDueDate}
          />
        ))
      )}
    </Box>
  );
}
