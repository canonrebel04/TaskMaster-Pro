'use client';

import { Alert, Button, Box, CircularProgress } from '@mui/material';

interface OfflineBannerProps {
  onSync: () => void;
  isSyncing: boolean;
}

const OfflineBanner = ({ onSync, isSyncing }: OfflineBannerProps) => {
  return (
    <Alert
      severity="warning"
      action={
        <Button color="inherit" size="small" onClick={onSync} disabled={isSyncing}>
          {isSyncing ? <CircularProgress size={24} /> : 'Sync Now'}
        </Button>
      }
      sx={{ mb: 2 }}
    >
      You are offline. Some data may be outdated.
    </Alert>
  );
};

export default OfflineBanner;
