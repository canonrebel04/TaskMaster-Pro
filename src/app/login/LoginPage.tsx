'use client';

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Grid,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Fingerprint as FingerprintIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
} from '@mui/icons-material';
import { AuthContext } from '@/contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const router = useRouter();
  const theme = useTheme();
  const { login } = React.useContext(AuthContext) ?? { login: undefined };
  if (!login) {
    throw new Error('AuthContext not properly initialized');
  }

  // Check for WebAuthn support
  React.useEffect(() => {
    setBiometricAvailable(
      typeof window !== 'undefined' && 
      window.PublicKeyCredential !== undefined
    );
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid credentials';
      setErrorMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const handlePasswordReset = async () => {
    if (!validateEmail(resetEmail)) {
      return;
    }
    
    try {
      // Placeholder for password reset functionality
      // await sendPasswordReset(resetEmail);
      setResetDialogOpen(false);
      setErrorMessage('Password reset email sent');
      setSnackbarOpen(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send password reset email';
      setErrorMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const handleBiometricLogin = async () => {
    // Placeholder for WebAuthn implementation
    console.log('Biometric login - implement WebAuthn');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: theme.spacing(2),
        bgcolor: theme.palette.background.default,
      }}
    >
      <Grid
        container
        component="main"
        justifyContent="center"
        sx={{
          maxWidth: theme.breakpoints.values.sm,
          width: '100%',
        }}
      >
        <Grid item component="section" xs={12} sm={8} md={6}>
          <Box
            sx={{
              p: theme.spacing(3),
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              boxShadow: theme.shadows[4],
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{ mb: 4 }}
            >
              TaskMaster Pro
            </Typography>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              margin="normal"
              autoComplete="email"
              aria-label="Email input"
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              margin="normal"
              autoComplete="current-password"
              aria-label="Password input"
            />

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="text"
                onClick={() => setResetDialogOpen(true)}
                sx={{ textTransform: 'none' }}
              >
                Forgot Password?
              </Button>
              {biometricAvailable && (
                <IconButton
                  onClick={handleBiometricLogin}
                  aria-label="Login with biometrics"
                  title="Biometric login"
                >
                  <FingerprintIcon />
                </IconButton>
              )}
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogin}
              size="large"
              sx={{ mt: 3 }}
            >
              Login
            </Button>

            <Button
              component={Link}
              href="/signup"
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
            >
              Sign Up
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Or continue with
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <IconButton
                  disabled
                  onClick={() => console.log('Implement Google OAuth')}
                  aria-label="Login with Google"
                >
                  <GoogleIcon />
                </IconButton>
                <IconButton
                  disabled
                  onClick={() => console.log('Implement Facebook OAuth')}
                  aria-label="Login with Facebook"
                >
                  <FacebookIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Password Reset Dialog */}
      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={resetEmail}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setResetEmail(e.target.value)}
            margin="dense"
            autoComplete="email"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePasswordReset} variant="contained">
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
