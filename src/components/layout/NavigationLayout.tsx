'use client';

import { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  IconButton,
  Typography,
  Dialog,
  TextField,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  WifiOff as WifiOffIcon,
} from '@mui/icons-material';
import NavigationMenu from './NavigationMenu';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

// Add motion variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    x: -10,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 10,
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function NavigationLayout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const t = useTranslations('Common');

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; title: string; description: string; }>>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [undoSnackbar, setUndoSnackbar] = useState({
    open: false,
    message: '',
    action: null as (() => void) | null,
  });

  // Handle offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Hide app bar on certain routes
  const hideAppBar = ['/', '/login', '/signup'].includes(pathname);

  // Get page title based on route
  const getPageTitle = () => {
    switch (pathname) {
      case '/tasks':
        return t('tasks');
      case '/calendar':
        return t('calendar');
      case '/stats':
        return t('statistics');
      case '/profile':
        return t('profile');
      default:
        return pathname.includes('/task/')
          ? t('taskDetails')
          : 'TaskMaster Pro';
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    // In a real app, this would call your search API
    // const results = await viewModel.searchTasks(query);
    // setSearchResults(results);
  };

  // Handle search results update
  const handleSearchResults = (results: Array<{ id: string; title: string; description: string }>) => {
    setSearchResults(results);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Offline Banner */}
      <Snackbar 
        open={isOffline} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="warning" 
          icon={<WifiOffIcon />}
          sx={{ width: '100%' }}
        >
          {t('offlineMessage')}
        </Alert>
      </Snackbar>

      {/* App Bar */}
      {!hideAppBar && (
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            {pathname !== '/tasks' && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => router.back()}
                aria-label={t('back')}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            
            <Typography 
              variant="h6" 
              component="h1" 
              sx={{ flexGrow: 1 }}
            >
              {getPageTitle()}
            </Typography>

            <IconButton
              color="inherit"
              onClick={() => setSearchOpen(true)}
              aria-label={t('search')}
            >
              <SearchIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: hideAppBar ? 0 : 8,
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Search Dialog */}
      <Dialog
        fullScreen={isMobile}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        aria-labelledby="search-dialog"
      >
        <Box sx={{ p: 2 }}>
          <TextField
            autoFocus
            fullWidth
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            variant="outlined"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
          />
          <List>
            {searchResults.map((result) => (
              <ListItem
                key={result.id}
                button
                onClick={() => {
                  router.push(`/task/${result.id}`);
                  setSearchOpen(false);
                }}
              >
                <ListItemText
                  primary={result.title}
                  secondary={result.description}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Dialog>

      {/* Undo Snackbar */}
      <Snackbar
        open={undoSnackbar.open}
        autoHideDuration={6000}
        onClose={() => setUndoSnackbar({ ...undoSnackbar, open: false })}
        message={undoSnackbar.message}
        action={
          undoSnackbar.action && (
            <IconButton
              size="small"
              color="inherit"
              onClick={() => {
                undoSnackbar.action?.();
                setUndoSnackbar({ ...undoSnackbar, open: false });
              }}
            >
              {t('undo')}
            </IconButton>
          )
        }
      />

      {/* Navigation Menu */}
      <NavigationMenu />
    </Box>
  );
}
