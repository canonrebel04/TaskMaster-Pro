import React from 'react';
import { TaskPriority } from '@/types/task';
import { Star, StarBorder, StarHalf } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

export const getDueDateColor = (dueDate: string): string => {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return '#f44336'; // red
  if (diffDays <= 3) return '#ff9800'; // orange
  return '#4caf50'; // green
};

export const getPriorityIcon = (priority: TaskPriority): React.ReactElement<SvgIconProps> => {
  switch (priority) {
    case 1:
      return <StarBorder color="action" />;
    case 2:
      return <StarHalf color="warning" />;
    case 3:
      return <Star color="error" />;
    default:
      return <StarBorder color="action" />;
  }
};

// Lightweight string indicator for places that prefer plain text
export const getPriorityIndicator = (priority: TaskPriority): string => {
  switch (priority) {
    case 1:
      return '☆';
    case 2:
      return '⯨';
    case 3:
      return '★';
    default:
      return '☆';
  }
};
