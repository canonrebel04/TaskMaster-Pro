import { TaskPriority } from '@/types/task';

// Pure TypeScript helpers (no JSX) to avoid parsing issues in .ts files.
export const getDueDateColor = (dueDate: string): string => {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return '#f44336'; // red
  if (diffDays <= 3) return '#ff9800'; // orange
  return '#4caf50'; // green
};

// Provide a lightweight, non-JSX priority indicator for code paths that
// import the .ts file. The richer JSX-based icons live in taskUtils.tsx.
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

// Re-export the JSX icon helper from the .tsx module so consumers can import from './taskUtils'
// Note: JSX icons live in taskUtilsIcons.tsx; import them directly where needed.
