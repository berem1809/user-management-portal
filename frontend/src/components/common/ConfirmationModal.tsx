import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  IconButton
} from '@mui/material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { useAppDispatch } from '@/store/hooks';
import { changeUserStatusThunk } from '@/store/slices/userSlice';
import { User } from '@/types';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  user: User;
}

export default function ConfirmationModal({ open, onClose, onSuccess, user }: ConfirmationModalProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isCurrentlyActive = user.status === 'active';
  const actionText = isCurrentlyActive ? 'deactivate' : 'activate';
  const newStatus = isCurrentlyActive ? 'inactive' : 'active';

  const handleConfirm = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await dispatch(changeUserStatusThunk({ id: user.id, status: newStatus })).unwrap();
      if (onSuccess) onSuccess(`User access has been successfully ${actionText}d.`);
      onClose(); // Close on success
    } catch (err: any) {
      setErrorMsg(`Failed to ${actionText} user`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={!loading ? onClose : undefined} 
      maxWidth="xs" 
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ 
            width: 40, height: 40, borderRadius: '50%', 
            bgcolor: isCurrentlyActive ? 'error.50' : 'success.50',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <WarningRoundedIcon sx={{ color: isCurrentlyActive ? 'error.main' : 'success.main' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Confirm Action
          </Typography>
        </Box>
        <IconButton onClick={onClose} disabled={loading} sx={{ color: 'text.secondary' }}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ px: 3, py: 2 }}>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Are you sure you want to <strong>{actionText}</strong> the account access for{' '}
          <strong style={{ color: '#0F172A' }}>{user.first_name} {user.last_name}</strong>?
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
          {isCurrentlyActive 
            ? "They will immediately lose access to the portal." 
            : "They will regain their previous access permissions."}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={loading} 
          color="inherit"
          sx={{ color: 'text.secondary' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color={isCurrentlyActive ? 'error' : 'success'}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ borderRadius: '12px' }}
        >
          {loading ? 'Processing...' : `Yes, ${actionText}`}
        </Button>
      </DialogActions>

      <Snackbar open={!!errorMsg} autoHideDuration={6000} onClose={() => setErrorMsg(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setErrorMsg(null)} severity="error" sx={{ width: '100%', borderRadius: '12px', boxShadow: 3 }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
