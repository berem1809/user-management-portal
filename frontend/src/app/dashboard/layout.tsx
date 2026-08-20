'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Avatar,
  Tooltip
} from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setIsReady(true);
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (!isReady) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="sticky" 
        color="transparent" 
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 72, md: 80 } }}>
            <Box sx={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: 'primary.main', borderRadius: '14px', width: 44, height: 44, mr: 2,
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}>
              <AdminPanelSettingsRoundedIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
              Portal
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 } }}>
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5, px: 2, py: 1, borderRadius: '50px', bgcolor: 'rgba(0,0,0,0.03)' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: '0.875rem', fontWeight: 700 }}>A</Avatar>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>Admin User</Typography>
              </Box>
              <Tooltip title="Securely Log Out">
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  onClick={handleLogout} 
                  endIcon={<LogoutRoundedIcon />}
                  sx={{ 
                    borderColor: 'divider', 
                    color: 'text.secondary',
                    borderRadius: '12px',
                    px: 2,
                    '&:hover': { borderColor: 'error.main', color: 'error.main', bgcolor: 'error.50' } 
                  }} 
                >
                  Logout
                </Button>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
}
