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
  Alert
} from '@mui/material';

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
      if (onSuccess) onSuccess(`User successfully ${actionText}d`);
      onClose(); // Close on success
    } catch (err: any) {
      setErrorMsg(`Failed to ${actionText} user`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={!loading ? onClose : undefined} maxWidth="xs" fullWidth>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Are you sure you want to <strong>{actionText}</strong> the user{' '}
          {user.first_name} {user.last_name} ({user.email})?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color={isCurrentlyActive ? 'error' : 'success'}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Processing...' : `Yes, ${actionText}`}
        </Button>
      </DialogActions>

      <Snackbar open={!!errorMsg} autoHideDuration={6000} onClose={() => setErrorMsg(null)}>
        <Alert onClose={() => setErrorMsg(null)} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
