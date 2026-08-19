import React, { useEffect } from 'react';
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
  Alert
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAppDispatch } from '@/store/hooks';
import { createUserThunk, updateUserThunk } from '@/store/slices/userSlice';
import { User } from '@/types';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  user?: User | null; // If user is provided, it's Edit mode. Otherwise Create mode.
}

// Yup schema for validation
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

  // Populate form when in edit mode
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
      // Clear form when opening in create mode
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
        // We dispatch the action and unwrap it so we can catch errors here directly if needed
        await dispatch(updateUserThunk({ id: user.id, data })).unwrap();
        if (onSuccess) onSuccess('User updated successfully');
      } else {
        await dispatch(createUserThunk(data)).unwrap();
        if (onSuccess) onSuccess('User created successfully');
      }
      onClose(); // Close modal on success
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred.';
      if (Array.isArray(err)) {
        // FastAPI returns an array of validation errors like { loc: [...], msg: "..." }
        errorMessage = err.map(e => {
          const field = e.loc?.[e.loc.length - 1];
          const friendlyField = field 
            ? field.toString().replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) 
            : '';
          
          let msg = e.msg;
          // Simplify common Pydantic errors
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit User' : 'Create New User'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting 
              ? (isEdit ? 'Saving...' : 'Creating...') 
              : (isEdit ? 'Save Changes' : 'Create')}
          </Button>
        </DialogActions>
      </form>
      
      <Snackbar open={!!errorMsg} autoHideDuration={6000} onClose={() => setErrorMsg(null)}>
        <Alert onClose={() => setErrorMsg(null)} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
