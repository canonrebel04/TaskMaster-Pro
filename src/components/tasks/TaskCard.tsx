'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Checkbox,
  Chip,
  IconButton,
} from '@mui/material';
import { Task, TaskStatus } from '@/types/task';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { getDueDateColor } from './taskUtils';
import { getPriorityIcon } from './taskUtilsIcons';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface TaskCardProps {
  task: Task;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskCard = ({ task, onUpdateTask, onDeleteTask }: TaskCardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id, status: task.status },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked ? TaskStatus.COMPLETED : TaskStatus.PENDING;
    onUpdateTask({ ...task, status: newStatus });
  };

  // react-dnd returns a connector function. Use a callback ref to attach it to a DOM node.
  let dragRef: HTMLDivElement | null = null;
  const setDragRef = (node: HTMLDivElement | null) => {
    dragRef = node;
    // @ts-ignore - react-dnd connector accepts HTMLElement | null
    drag(node);
  };

  return (
    <div ref={setDragRef} style={{ display: 'block' }}>
      <Card
        sx={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'grab',
        }}
      >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {task.title}
          </Typography>
          <Checkbox
            checked={task.status === TaskStatus.COMPLETED}
            onChange={handleStatusChange}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {task.description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={new Date(task.dueDate).toLocaleDateString()}
            size="small"
            sx={{ backgroundColor: getDueDateColor(task.dueDate) }}
          />
          {getPriorityIcon(task.priority)}
        </Box>
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {task.expand?.tags?.map((tag) => (
            <Chip key={tag.id} label={tag.name} size="small" sx={{ backgroundColor: tag.color }} />
          ))}
        </Box>
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton size="small" onClick={() => { /* Handle Edit */ }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDeleteTask(task.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
      </Card>
    </div>
  );
};

export default TaskCard;
