'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  TextField,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Typography,
  LinearProgress,
  Snackbar,
  Alert,
  useTheme,
} from '@mui/material';
import Confetti from 'react-confetti';
import { AuthContext } from '@/contexts/AuthContext';

interface PasswordStrength {
  score: number;
  color: 'error' | 'warning' | 'success';
  label: string;
}

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const router = useRouter();
  const theme = useTheme();
  const { signUp } = React.useContext(AuthContext) ?? { signUp: undefined };
  if (!signUp) {
    throw new Error('AuthContext not properly initialized');
  }

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  const validateEmail = (email: string): boolean => {
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

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, color: 'error', label: 'Password is required' };
    }

    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[a-z]/)) score += 1;
    if (password.match(/\d/)) score += 1;
    if (password.match(/[^A-Za-z0-9]/)) score += 1;

    if (score < 2) return { score: 20, color: 'error', label: 'Weak' };
    if (score < 4) return { score: 60, color: 'warning', label: 'Medium' };
    return { score: 100, color: 'success', label: 'Strong' };
  };

  const validatePassword = (password: string): boolean => {
    const strength = calculatePasswordStrength(password);
    if (strength.score <= 20) {
      setPasswordError('Password is too weak. Include uppercase, lowercase, numbers, and special characters.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSignUp = async () => {
    if (!validateEmail(email) || !validatePassword(password) || !validateConfirmPassword(password, confirmPassword)) {
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('Please accept the Terms and Privacy Policy');
      setSnackbarOpen(true);
      return;
    }

    try {
      await signUp(email, password);
      setShowConfetti(true);
      setSuccessDialogOpen(true);
      setTimeout(() => {
        setShowConfetti(false);
        setSuccessDialogOpen(false);
        router.push('/login');
      }, 3000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      setErrorMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const passwordStrength = calculatePasswordStrength(password);

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
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <Box
        sx={{
          maxWidth: 400,
          width: '100%',
          p: theme.spacing(3),
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[4],
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Create Account
        </Typography>

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
            if (confirmPassword) {
              validateConfirmPassword(e.target.value, confirmPassword);
            }
          }}
          error={!!passwordError}
          helperText={passwordError}
          margin="normal"
          autoComplete="new-password"
          aria-label="Password input"
        />

        <Box sx={{ mt: 1, mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={passwordStrength.score}
            color={passwordStrength.color}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="caption" color="textSecondary">
            Password Strength: {passwordStrength.label}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setConfirmPassword(e.target.value);
            validateConfirmPassword(password, e.target.value);
          }}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
          margin="normal"
          autoComplete="new-password"
          aria-label="Confirm password input"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              color="primary"
              aria-label="Accept terms checkbox"
            />
          }
          label={
            <Typography variant="body2">
              I accept the Terms of Service and Privacy Policy
            </Typography>
          }
          sx={{ mt: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSignUp}
          disabled={!acceptTerms || !email || !password || !confirmPassword}
          size="large"
          sx={{ mt: 3 }}
        >
          Sign Up
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link href="/login" style={{ color: theme.palette.primary.main }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Box>

      <Dialog
        open={successDialogOpen}
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-description"
      >
        <DialogTitle id="success-dialog-title">
          Account Created Successfully! 🎉
        </DialogTitle>
        <DialogContent>
          <Typography id="success-dialog-description">
            Welcome to TaskMaster Pro! Redirecting you to login...
          </Typography>
        </DialogContent>
      </Dialog>

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

export default SignupPage;
