'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  InputAdornment, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Typography,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  Avatar
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ToggleOnRoundedIcon from '@mui/icons-material/ToggleOnRounded';
import ToggleOffRoundedIcon from '@mui/icons-material/ToggleOffRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsersThunk, setPage, setLimit, setSearch } from '@/store/slices/userSlice';
import { User } from '@/types';

import UserFormModal from '@/components/users/UserFormModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, total, loading, page, limit, search } = useAppSelector((state) => state.users);

  // Debounce search state
  const [searchInput, setSearchInput] = useState(search);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [statusUser, setStatusUser] = useState<User | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch, page, limit, search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearch(searchInput));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput, dispatch]);

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleOpenStatus = (user: User) => {
    setStatusUser(user);
    setIsConfirmOpen(true);
  };

  const stringAvatar = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`;
  };

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.03em' }}>
            Team Members
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your organization's users, their roles, and system access.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddRoundedIcon />}
          onClick={handleOpenCreate}
          size="large"
          sx={{ py: 1.5, px: 3 }}
        >
          Add New User
        </Button>
      </Box>

      {/* Toolbar Section */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Search users by name, email, or code..."
          variant="outlined"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ maxWidth: 480 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon color="action" />
                </InputAdornment>
              ),
            }
          }}
        />
      </Box>

      {/* Data Table Section */}
      <Card sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Email Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <CircularProgress size={48} thickness={4} />
                    <Typography sx={{ mt: 2, color: 'text.secondary', fontWeight: 500 }}>Loading team members...</Typography>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 12 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.8 }}>
                      <Box sx={{ width: 80, height: 80, borderRadius: '24px', bgcolor: 'rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                        <ErrorOutlineRoundedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                      </Box>
                      <Typography variant="h6" color="text.primary" sx={{ mb: 1, fontWeight: 700 }}>
                        No users found
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 300, textAlign: 'center' }}>
                        We couldn't find anyone matching that search. Try adjusting your filters.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow 
                    key={user.id} 
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.light', 
                            color: 'white', 
                            fontWeight: 700,
                            width: 40, 
                            height: 40
                          }}
                        >
                          {stringAvatar(user.first_name, user.last_name)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            {`${user.first_name} ${user.last_name}`}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'text.secondary', bgcolor: 'rgba(0,0,0,0.04)', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block' }}>
                        {user.employee_code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status === 'active' ? 'Active' : 'Inactive'} 
                        icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: user.status === 'active' ? '#059669' : '#475569', ml: 1 }} />}
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: '0.75rem',
                          height: 28,
                          ...(user.status === 'active' 
                            ? { bgcolor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' } 
                            : { bgcolor: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' }
                          )
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Profile">
                        <IconButton onClick={() => handleOpenEdit(user)} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'primary.50' } }}>
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.status === 'active' ? 'Deactivate Access' : 'Restore Access'}>
                        <IconButton 
                          onClick={() => handleOpenStatus(user)} 
                          sx={{ 
                            ml: 1,
                            color: user.status === 'active' ? 'error.light' : 'success.light',
                            '&:hover': { 
                              color: user.status === 'active' ? 'error.main' : 'success.main', 
                              bgcolor: user.status === 'active' ? 'error.50' : 'success.50' 
                            }
                          }}
                        >
                          {user.status === 'active' ? <ToggleOnRoundedIcon /> : <ToggleOffRoundedIcon />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={limit}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            sx={{
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                color: 'text.secondary',
                fontWeight: 500,
              }
            }}
          />
        </Box>
      </Card>

      {isFormOpen && (
        <UserFormModal 
          open={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={(msg) => setSuccessMsg(msg)}
          user={editingUser} 
        />
      )}

      {isConfirmOpen && statusUser && (
        <ConfirmationModal
          open={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onSuccess={(msg) => setSuccessMsg(msg)}
          user={statusUser}
        />
      )}

      <Dialog 
        open={!!successMsg} 
        onClose={() => setSuccessMsg(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '24px',
              p: { xs: 3, sm: 4 },
              textAlign: 'center',
              alignItems: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }
          }
        }}
      >
        <Box sx={{ 
          width: 80, height: 80, mb: 3, 
          borderRadius: '50%', bgcolor: '#ECFDF5', 
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 48, color: '#10B981' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary', letterSpacing: '-0.02em' }}>
          Success!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, px: 2 }}>
          {successMsg}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => setSuccessMsg(null)}
          fullWidth
          size="large"
          color="secondary"
          sx={{ py: 1.5, fontSize: '1rem' }}
        >
          Done
        </Button>
      </Dialog>
    </Box>
  );
}
