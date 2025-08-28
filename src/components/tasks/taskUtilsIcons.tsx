import React from 'react';
import { TaskPriority } from '@/types/task';
import { Star, StarBorder, StarHalf } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

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

export default getPriorityIcon;
