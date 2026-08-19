'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
  Dialog
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsersThunk, setPage, setLimit, setSearch } from '@/store/slices/userSlice';
import { User } from '@/types';

// We will build these components in the next step
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

  // Fetch users when pagination or search changes
  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch, page, limit, search]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearch(searchInput));
    }, 500); // 500ms debounce
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

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
            Users Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your team members and their account permissions here.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          size="large"
          sx={{ py: 1.5, px: 3 }}
        >
          Create User
        </Button>
      </Box>

      <Card sx={{ mb: 4, p: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Search by name, email, or employee code..."
          variant="outlined"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ maxWidth: 600 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }
          }}
        />
      </Card>

      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'background.default' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6 }}>
                      <SearchIcon sx={{ fontSize: 48, mb: 2 }} color="action" />
                      <Typography variant="h6" color="text.secondary">
                        No users found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search filters or create a new user.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow 
                    key={user.id} 
                    hover
                    sx={{ transition: 'background-color 0.2s ease' }}
                  >
                    <TableCell sx={{ fontWeight: 500, color: 'text.secondary' }}>{user.employee_code}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>{`${user.first_name} ${user.last_name}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status.toUpperCase()} 
                        size="small"
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: '0.75rem',
                          borderRadius: '6px',
                          ...(user.status === 'active' 
                            ? { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669' } 
                            : { bgcolor: 'rgba(100, 116, 139, 0.1)', color: '#475569' }
                          )
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit User">
                        <IconButton onClick={() => handleOpenEdit(user)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.status === 'active' ? 'Deactivate' : 'Activate'}>
                        <IconButton 
                          onClick={() => handleOpenStatus(user)} 
                          color={user.status === 'active' ? 'error' : 'success'}
                        >
                          {user.status === 'active' ? <ToggleOnIcon /> : <ToggleOffIcon />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={limit}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
        />
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
              borderRadius: 3,
              p: { xs: 2, sm: 3 },
              textAlign: 'center',
              alignItems: 'center'
            }
          }
        }}
      >
        <Box sx={{ mb: 2 }}>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
          Success!
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {successMsg}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => setSuccessMsg(null)}
          fullWidth
          size="large"
          sx={{ py: 1.5, borderRadius: 2 }}
        >
          Awesome, got it!
        </Button>
      </Dialog>
    </Box>
  );
}
