'use client';

import { useState, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Link,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PhotoCamera,
  Brightness4,
  Brightness7,
  Language,
  Sync,
  DeleteForever,
  Logout,
  Settings,
} from '@mui/icons-material';
import { useProfileViewModel, UserProfile } from '@/hooks/useProfileViewModel';

export default function ProfilePage() {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up('md'));
  const viewModel = useProfileViewModel();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await viewModel.uploadAvatar(file);
    }
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = event.target.checked ? 'dark' : 'light';
    viewModel.updateProfile({ theme: newTheme });
  };

  const handleLanguageChange = (event: any) => {
    viewModel.updateProfile({ language: event.target.value });
  };

  const handleDataSyncChange = (event: any) => {
    viewModel.updateProfile({ dataSync: event.target.value });
  };

  const handleDeleteAccount = async () => {
    await viewModel.deleteAccount();
    setDeleteDialogOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
            <Avatar
              src={viewModel.profile.avatarUrl || undefined}
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
              onClick={handleAvatarClick}
            >
              {viewModel.profile.name.charAt(0)}
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'background.paper',
                }}
                size="small"
              >
                <PhotoCamera />
              </IconButton>
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {viewModel.profile.name}
            </Typography>
            <Typography color="text.secondary">
              {viewModel.profile.email}
            </Typography>
          </Paper>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Achievements
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 2,
              }}
            >
              {viewModel.achievements.map((achievement) => (
                <Paper
                  key={achievement.id}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Typography variant="h4" component="span">
                    {achievement.icon}
                  </Typography>
                  <Box>
                    <Typography variant="subtitle1">
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {achievement.description}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={viewModel.profile.theme === 'dark'}
                    onChange={handleThemeChange}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {viewModel.profile.theme === 'dark' ? (
                      <Brightness4 />
                    ) : (
                      <Brightness7 />
                    )}
                    Theme
                  </Box>
                }
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Language />
                <Select
                  value={viewModel.profile.language}
                  onChange={handleLanguageChange}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="fr">Français</MenuItem>
                </Select>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Sync />
                <Select
                  value={viewModel.profile.dataSync}
                  onChange={handleDataSyncChange}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="auto">Auto Sync</MenuItem>
                  <MenuItem value="manual">Manual Sync</MenuItem>
                </Select>
              </Box>

              <Button
                variant="outlined"
                onClick={viewModel.backupData}
                startIcon={<Settings />}
              >
                Backup Data
              </Button>
              
              <Button
                variant="outlined"
                component="label"
                startIcon={<Settings />}
              >
                Restore Data
                <input
                  type="file"
                  hidden
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) viewModel.restoreData(file);
                  }}
                />
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* About & Danger Zone */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" paragraph>
                TaskMaster Pro v1.0.0
              </Typography>
              <Typography variant="body2" paragraph>
                Built with PocketBase 
                <Link 
                  href="https://github.com/pocketbase/pocketbase"
                  target="_blank"
                  sx={{ ml: 1 }}
                >
                  GitHub
                </Link>
              </Typography>
              <Typography variant="body2">
                © 2025 TaskMaster Pro. All rights reserved.
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom color="error">
              Danger Zone
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteForever />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete Account
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Logout />}
                onClick={viewModel.logout}
              >
                Logout
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
          <Typography color="error" sx={{ mt: 2 }}>
            All your tasks, settings, and achievements will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
