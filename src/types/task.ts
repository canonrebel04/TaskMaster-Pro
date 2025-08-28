export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  title: string;
  description: string;
  dueDate: string; // ISO 8601 date string
  priority: 1 | 2 | 3; // 1 (low) to 3 (high)
  status: TaskStatus;
  tags?: string[]; // Array of tag IDs
  subtasks?: { id: string; text: string; done: boolean }[];
  attachments?: { id: string; url: string; name?: string }[];
  expand?: {
    tags: Tag[];
  };
}

export type TaskPriority = 1 | 2 | 3;
