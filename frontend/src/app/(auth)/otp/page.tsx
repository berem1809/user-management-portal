'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Card, 
  CardContent,
  Alert,
  Snackbar
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verifyOtpThunk, clearError } from '@/store/slices/authSlice';

const schema = yup.object({
  otp: yup.string()
    .required('OTP is required')
    .length(6, 'OTP must be exactly 6 characters'),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function OtpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, pendingToken, isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Security check: if there is no pendingToken and user isn't authenticated, redirect back to login
  useEffect(() => {
    if (!pendingToken && !isAuthenticated) {
      router.push('/login');
    }
  }, [pendingToken, isAuthenticated, router]);

  const [showSuccess, setShowSuccess] = React.useState(false);

  // Success check: if authenticated, redirect to the dashboard
  useEffect(() => {
    if (isAuthenticated) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        router.push('/dashboard/users');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = (data: FormData) => {
    dispatch(verifyOtpThunk({ otp: data.otp }));
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #E0E7FF 0%, #D1FAE5 100%)',
        position: 'relative',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Card 
          sx={{ 
            width: '100%', 
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }} gutterBottom>
                Two-Factor Auth
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                Please enter the 6-digit OTP code sent to your terminal
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="otp"
                  label="OTP Code"
                  autoFocus
                  {...register('otp')}
                  error={!!errors.otp}
                  helperText={errors.otp?.message as string | undefined}
                  slotProps={{ htmlInput: { maxLength: 6 } }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 4, mb: 1, py: 1.5, fontSize: '1rem' }}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Snackbar 
        open={showSuccess} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', boxShadow: 3 }}>
          OTP Verified! Redirecting to Dashboard...
        </Alert>
      </Snackbar>
    </Box>
  );
}
