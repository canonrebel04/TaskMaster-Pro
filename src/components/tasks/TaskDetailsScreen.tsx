"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Chip, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Grid, Card, CardMedia } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import { Task } from '@/types/task';
import TaskViewModel from '@/viewmodels/TaskViewModel';
import { useRouter } from 'next/navigation';

interface Props {
  taskId: string;
  viewModel: TaskViewModel;
}

export default function TaskDetailsScreen({ taskId, viewModel }: Props) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [related, setRelated] = useState<Task[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const t = await viewModel.fetchTaskById(taskId);
      if (!mounted) return;
      setTask(t);
      const c = await viewModel.getComments(taskId);
      setComments(c || []);
      const h = await viewModel.getTaskHistory(taskId);
      setHistory(h || []);
      const r = await viewModel.getRelatedTasks(taskId);
      setRelated(r || []);
    };
    load();
    return () => { mounted = false; };
  }, [taskId, viewModel]);

  const onEdit = () => router.push(`/tasks/${taskId}/edit`);
  const onShare = async () => {
    const link = await viewModel.shareTask(taskId);
    // simple share fallback
    if (navigator.share) {
      try { await navigator.share({ title: task?.title, url: link }); } catch {};
    } else {
      await navigator.clipboard.writeText(link);
      alert('Link copied to clipboard');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">{task?.title}</Typography>
        <Box>
          <IconButton aria-label="edit" onClick={onEdit}><EditIcon /></IconButton>
          <IconButton aria-label="share" onClick={onShare}><ShareIcon /></IconButton>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6">Description</Typography>
          <Box sx={{ mb: 2 }} dangerouslySetInnerHTML={{ __html: viewModel.renderMarkdown(task?.description || '') }} />

          <Typography variant="h6">Subtasks</Typography>
          <List>
            {(task?.subtasks || []).map((s: any) => (
              <ListItem key={s.id}>
                <ListItemText primary={s.text} secondary={s.done ? 'Done' : 'Pending'} />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6">Attachments</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {(task as any)?.attachments?.map((a: any) => (
              <Card key={a.id} sx={{ width: 120 }}>
                <CardMedia component="img" height="80" image={a.url} alt={a.name} />
              </Card>
            ))}
          </Box>

          <Typography variant="h6" sx={{ mt: 2 }}>Comments</Typography>
          <List>
            {comments.map((c) => (
              <ListItem key={c.id}>
                <ListItemAvatar>
                  <Avatar>{(c.author || 'U')[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={c.text} secondary={new Date(c.created).toLocaleString()} />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6">History</Typography>
          <List>
            {history.map((h) => (
              <ListItem key={h.id}><ListItemText primary={h.message} secondary={new Date(h.date).toLocaleString()} /></ListItem>
            ))}
          </List>

          <Typography variant="h6" sx={{ mt: 2 }}>Related Tasks</Typography>
          <Box sx={{ display: 'flex', overflowX: 'auto', gap: 1 }}>
            {related.map((r) => (
              <Chip key={r.id} label={r.title} clickable onClick={() => router.push(`/tasks/${r.id}`)} />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
