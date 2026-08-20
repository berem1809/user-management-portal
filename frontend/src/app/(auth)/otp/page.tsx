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
  Snackbar,
  InputAdornment
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';

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
        background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #C7D2FE 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background blobs */}
      <Box sx={{
        position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%)',
        borderRadius: '50%',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0) 70%)',
        borderRadius: '50%',
      }} />

      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Card 
          sx={{ 
            width: '100%', 
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            borderRadius: '24px',
          }}
        >
          <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box 
                sx={{ 
                  width: 56, height: 56, mb: 2, 
                  background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                  borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)'
                }}
              >
                <SecurityOutlinedIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              <Typography component="h1" variant="h4" sx={{ fontWeight: 800, color: 'text.primary', textAlign: 'center' }} gutterBottom>
                Two-Factor Auth
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                Please enter the 6-digit OTP code sent to your terminal
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: '12px' }}>
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
                  slotProps={{ 
                    htmlInput: { maxLength: 6, style: { textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.25rem', fontWeight: 700 } },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyOutlinedIcon color="action" />
                        </InputAdornment>
                      ),
                    }
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
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
        <Alert severity="success" sx={{ width: '100%', boxShadow: 3, borderRadius: '12px' }}>
          OTP Verified! Redirecting to Dashboard...
        </Alert>
      </Snackbar>
    </Box>
  );
}
