import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
  IconButton
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { useAppDispatch } from '@/store/hooks';
import { createUserThunk, updateUserThunk } from '@/store/slices/userSlice';
import { User } from '@/types';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  user?: User | null;
}

const schema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address (e.g., name@domain.com)')
    .required('Email is required'),
  employee_code: yup.string().required('Employee code is required'),
  title: yup.string().required('Job title is required'),
  date_of_birth: yup.string().required('Date of birth is required'),
  hire_date: yup.string().required('Hire date is required'),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function UserFormModal({ open, onClose, onSuccess, user }: UserFormModalProps) {
  const dispatch = useAppDispatch();
  const isEdit = !!user;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      employee_code: '',
      title: '',
      date_of_birth: '',
      hire_date: '',
    }
  });

  useEffect(() => {
    if (user && open) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        employee_code: user.employee_code,
        title: user.title || '',
        date_of_birth: user.date_of_birth || '',
        hire_date: user.hire_date || '',
      });
    } else if (open) {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        employee_code: '',
        title: '',
        date_of_birth: '',
        hire_date: '',
      });
    }
  }, [user, open, reset]);

  const onSubmit = async (data: FormData) => {
    setErrorMsg(null);
    try {
      if (isEdit && user) {
        await dispatch(updateUserThunk({ id: user.id, data })).unwrap();
        if (onSuccess) onSuccess('User profile has been successfully updated.');
      } else {
        await dispatch(createUserThunk(data)).unwrap();
        if (onSuccess) onSuccess('New user has been successfully provisioned.');
      }
      onClose();
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred.';
      if (Array.isArray(err)) {
        errorMessage = err.map(e => {
          const field = e.loc?.[e.loc.length - 1];
          const friendlyField = field 
            ? field.toString().replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) 
            : '';
          
          let msg = e.msg;
          if (msg.includes('value is not a valid email address')) {
            msg = 'Please provide a valid email address.';
          } else if (msg === 'Field required') {
            msg = 'This field is required.';
          }
          
          return friendlyField ? `${friendlyField}: ${msg}` : msg;
        }).join(' | ');
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setErrorMsg(errorMessage);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            {isEdit ? 'Edit Team Member' : 'Provision New User'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {isEdit ? 'Update the details for this employee.' : 'Add a new member to the organization.'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } }}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 3, pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                {...register('first_name')}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
              <TextField
                fullWidth
                label="Last Name"
                {...register('last_name')}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
            </Box>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Employee Code"
                {...register('employee_code')}
                error={!!errors.employee_code}
                helperText={errors.employee_code?.message}
              />
              <TextField
                fullWidth
                label="Job Title"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                {...register('date_of_birth')}
                error={!!errors.date_of_birth}
                helperText={errors.date_of_birth?.message}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                fullWidth
                label="Hire Date"
                type="date"
                {...register('hire_date')}
                error={!!errors.hire_date}
                helperText={errors.hire_date?.message}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={onClose} 
            disabled={isSubmitting}
            color="inherit"
            sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ minWidth: 120 }}
          >
            {isSubmitting 
              ? (isEdit ? 'Saving...' : 'Creating...') 
              : (isEdit ? 'Save Changes' : 'Provision User')}
          </Button>
        </DialogActions>
      </form>
      
      <Snackbar open={!!errorMsg} autoHideDuration={6000} onClose={() => setErrorMsg(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setErrorMsg(null)} severity="error" sx={{ width: '100%', borderRadius: '12px', boxShadow: 3 }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
