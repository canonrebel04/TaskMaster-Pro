"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Chip,
  Autocomplete,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import SaveIcon from '@mui/icons-material/Save';
import StarBorder from '@mui/icons-material/StarBorder';
import Star from '@mui/icons-material/Star';
import StarHalf from '@mui/icons-material/StarHalf';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import TaskViewModel from '@/viewmodels/TaskViewModel';

interface TaskEditorModalProps {
  open: boolean;
  onClose: () => void;
  viewModel: TaskViewModel;
}

const priorityOptions: { value: TaskPriority; label: string; icon: React.ReactNode }[] = [
  { value: 1, label: 'Low', icon: <StarBorder /> },
  { value: 2, label: 'Medium', icon: <StarHalf /> },
  { value: 3, label: 'High', icon: <Star /> },
];

export default function TaskEditorModal({ open, onClose, viewModel }: TaskEditorModalProps) {
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.up('md'));

  const [local, setLocal] = useState<Omit<Task, 'id' | 'collectionId' | 'collectionName' | 'created' | 'updated'>>() ;
  const [titleError, setTitleError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'error' | 'success' }>({ open: false, message: '' });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [availableTagNames, setAvailableTagNames] = useState<string[]>([]);

  // Initialize local state from viewModel.task (if provided)
  useEffect(() => {
    const t = viewModel.getTaskForEdit();
    if (t) {
      setLocal(t as any);
    } else {
      setLocal({
        title: '',
        description: '',
        dueDate: new Date().toISOString(),
        priority: 2,
        status: TaskStatus.PENDING,
        tags: [],
        expand: { tags: [] },
      } as any);
    }
  }, [open, viewModel]);

  // Auto-save draft on unload/navigation away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (local) viewModel.saveDraft(local as any);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (local) viewModel.saveDraft(local as any);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  const updateLocal = (patch: Partial<typeof local>) => setLocal((s) => ({ ...(s as any), ...(patch as any) }));

  // Load available tags (viewModel may return a Promise or an array)
  useEffect(() => {
    let mounted = true;
    try {
      const res = viewModel.getAvailableTags?.();
      if (!res) return;
      if (typeof (res as any).then === 'function') {
        (res as Promise<any>).then((list) => {
          if (!mounted) return;
          setAvailableTagNames((list || []).map((t: any) => t.name));
        }).catch(() => {});
      } else {
        setAvailableTagNames(((res as any) || []).map((t: any) => t.name));
      }
    } catch (e) {
      // ignore
    }
    return () => { mounted = false; };
  }, [viewModel]);

  // Simple markdown-like toolbar for description (inserts markdown tokens)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const insertAtCursor = (wrapLeft: string, wrapRight?: string) => {
    const el = descriptionRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = el.value.substring(0, start);
    const middle = el.value.substring(start, end);
    const after = el.value.substring(end);
    const right = wrapRight ?? wrapLeft;
    const newVal = before + wrapLeft + middle + right + after;
    updateLocal({ description: newVal } as any);
    // restore selection
    requestAnimationFrame(() => {
      el.selectionStart = start + wrapLeft.length;
      el.selectionEnd = start + wrapLeft.length + middle.length;
      el.focus();
    });
  };

  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const attachment = await viewModel.uploadAttachment(file);
      setSnackbar({ open: true, message: 'Attachment uploaded', severity: 'success' });
      // merge into local attachments if supported
      updateLocal({ ...(local as any), attachments: [...((local as any)?.attachments || []), attachment] } as any);
    } catch (err: any) {
      setSnackbar({ open: true, message: err?.message || 'Upload failed', severity: 'error' });
    }
    e.currentTarget.value = '';
  };

  // TODO: Integrate a rich-text editor (TipTap) here once packages are installed.
  // For now we use the textarea-based markdown-like editor.

  const handleSave = async () => {
    if (!local?.title || local.title.trim() === '') {
      setTitleError('Title is required');
      return;
    }
    setIsSaving(true);
    try {
      await viewModel.saveTask(local as any);
      setSnackbar({ open: true, message: 'Saved', severity: 'success' });
      onClose();
    } catch (err: any) {
      setSnackbar({ open: true, message: err?.message || 'Save failed', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSubtask = () => {
    const subtasks = ((local as any)?.subtasks || []) as { id: string; text: string; done: boolean }[];
    subtasks.push({ id: String(Date.now()), text: '', done: false });
    updateLocal({ subtasks } as any);
  };

  const handleRemoveSubtask = (id: string) => {
    const subtasks = ((local as any)?.subtasks || []).filter((s: any) => s.id !== id);
    updateLocal({ subtasks } as any);
  };

  const fullScreen = isFullScreen;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      aria-labelledby="task-editor-title"
      PaperProps={{
        sx: (theme) => ({
          ...(fullScreen ? {} : { position: 'fixed', bottom: 0, margin: 0, borderTopLeftRadius: 12, borderTopRightRadius: 12 }),
          width: '100%',
          bgcolor: 'background.paper',
        }),
      }}
    >
      <DialogTitle id="task-editor-title" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{(viewModel.getTaskForEdit()?.title ? 'Edit Task' : 'Add Task')}</span>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            required
            label="Title"
            value={local?.title || ''}
            onChange={(e) => { updateLocal({ title: e.target.value } as any); setTitleError(null); }}
            error={!!titleError}
            helperText={titleError}
            inputProps={{ 'aria-label': 'Task title' }}
            InputProps={{
              endAdornment: (
                <IconButton aria-label="voice title" onClick={() => viewModel.startVoiceInput?.('title')}> 
                  <MicIcon />
                </IconButton>
              ),
            }}
          />

          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Button size="small" onClick={() => insertAtCursor('**')}>Bold</Button>
              <Button size="small" onClick={() => insertAtCursor('*')}>Italic</Button>
              <Button size="small" onClick={() => insertAtCursor('- ')}>List</Button>
            </Box>
            <TextField
              multiline
              minRows={4}
              label="Description"
              value={local?.description || ''}
              onChange={(e) => updateLocal({ description: e.target.value } as any)}
              inputRef={descriptionRef}
              InputProps={{
                endAdornment: (
                  <IconButton aria-label="voice description" onClick={() => viewModel.startVoiceInput?.('description')}>
                    <MicIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Due date"
              type="date"
              value={local?.dueDate ? new Date(local.dueDate).toISOString().slice(0, 10) : ''}
              onChange={(e) => {
                const date = e.target.value;
                const prev = local?.dueDate ? new Date(local.dueDate) : new Date();
                const time = prev.toTimeString().split(' ')[0];
                updateLocal({ dueDate: new Date(date + 'T' + time).toISOString() } as any);
              }}
              InputProps={{ startAdornment: <CalendarTodayIcon sx={{ mr: 1 }} /> }}
            />

            <TextField
              label="Time"
              type="time"
              value={local?.dueDate ? new Date(local.dueDate).toTimeString().slice(0,5) : ''}
              onChange={(e) => {
                const time = e.target.value;
                const prevDate = local?.dueDate ? new Date(local.dueDate) : new Date();
                const datePart = prevDate.toISOString().slice(0,10);
                updateLocal({ dueDate: new Date(datePart + 'T' + time).toISOString() } as any);
              }}
            />

            <FormControl>
              <RadioGroup row value={local?.priority?.toString() || '2'} onChange={(e) => updateLocal({ priority: Number(e.target.value) } as any)}>
                {priorityOptions.map((p) => (
                  <FormControlLabel key={p.value} value={String(p.value)} control={<Radio />} label={p.label} />
                ))}
              </RadioGroup>
            </FormControl>

            <FormControl>
              <TextField
                select
                SelectProps={{ native: true }}
                label="Status"
                value={local?.status || TaskStatus.PENDING}
                onChange={(e) => updateLocal({ status: e.target.value as TaskStatus } as any)}
              >
                <option value={TaskStatus.PENDING}>Pending</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.COMPLETED}>Completed</option>
              </TextField>
            </FormControl>
          </Box>

          <Autocomplete
            multiple
            freeSolo
            options={availableTagNames}
            value={local?.expand?.tags?.map((t) => t.name) || []}
            onChange={(e, value) => {
              // convert values to expand.tags shape
              const tags = value.map((v) => ({ id: String(v), name: String(v), color: '#ddd' }));
              updateLocal({ expand: { tags } } as any);
            }}
            renderTags={(value: any[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Tags" />}
          />

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
            <Button startIcon={<AttachFileIcon />} onClick={handleAttachClick}>Add attachment</Button>
            <FormControlLabel control={<Switch checked={!!(local as any)?.reminder} onChange={(e) => updateLocal({ reminder: e.target.checked } as any)} />} label="Reminders" />
            {(local as any)?.reminder && (
              <TextField
                label="Reminder time"
                type="time"
                value={(local as any)?.reminderTime || '09:00'}
                onChange={(e) => updateLocal({ reminderTime: e.target.value } as any)}
              />
            )}
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1">Subtasks</Typography>
            <List>
              {((local as any)?.subtasks || []).map((s: any) => (
                <ListItem key={s.id} secondaryAction={<Button onClick={() => handleRemoveSubtask(s.id)}>Remove</Button>}>
                  <ListItemIcon>
                    <Checkbox checked={!!s.done} onChange={(e) => {
                      const subtasks = ((local as any)?.subtasks || []).map((st: any) => st.id === s.id ? { ...st, done: e.target.checked } : st);
                      updateLocal({ subtasks } as any);
                    }} />
                  </ListItemIcon>
                  <ListItemText>
                    <TextField fullWidth value={s.text} onChange={(e) => {
                      const subtasks = ((local as any)?.subtasks || []).map((st: any) => st.id === s.id ? { ...st, text: e.target.value } : st);
                      updateLocal({ subtasks } as any);
                    }} />
                  </ListItemText>
                </ListItem>
              ))}
            </List>
            <Button onClick={handleAddSubtask}>Add Subtask</Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CloseIcon />}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" startIcon={isSaving ? <CircularProgress size={18} /> : <SaveIcon />}>
          {isSaving ? 'Saving' : 'Save'}
        </Button>
      </DialogActions>

      <Box>
        <SnackbarWrapper open={snackbar.open} message={snackbar.message} onClose={() => setSnackbar({ open: false, message: '' })} />
      </Box>
    </Dialog>
  );
}

function SnackbarWrapper({ open, message, onClose }: { open: boolean; message: string; onClose: () => void }) {
  const [o, setO] = useState(open);
  useEffect(() => setO(open), [open]);
  return (
    <>
      {/* lightweight snackbar */}
      <div aria-live="polite" role="status">
        {o && (
          <Box sx={{ position: 'fixed', bottom: 16, left: 16 }}>
            <Box sx={{ bgcolor: 'background.paper', p: 1, borderRadius: 1, boxShadow: 3 }}>
              <Typography>{message}</Typography>
              <Button onClick={() => { setO(false); onClose(); }}>OK</Button>
            </Box>
          </Box>
        )}
      </div>
    </>
  );
}
