import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/utils/api';
import { User, PaginatedResponse } from '@/types';

interface UserState {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
  // We keep search and pagination state here to survive unmounts and for easy refetching
  page: number;
  limit: number;
  search: string;
}

const initialState: UserState = {
  users: [],
  total: 0,
  loading: false,
  error: null,
  page: 0, // Material UI DataGrid uses 0-indexed pagination
  limit: 10,
  search: '',
};

// Async thunk to fetch users list
export const fetchUsersThunk = createAsyncThunk(
  'users/fetchList',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { users: UserState };
      const { page, limit, search } = state.users;
      const offset = page * limit;
      
      const response = await api.get<PaginatedResponse<User>>('/employees', {
        params: {
          limit,
          offset,
          search: search || undefined, // only send if truthy
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch users');
    }
  }
);

// Async thunk to create a user
export const createUserThunk = createAsyncThunk(
  'users/create',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await api.post<User>('/employees', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create user');
    }
  }
);

// Async thunk to edit a user
export const updateUserThunk = createAsyncThunk(
  'users/update',
  async ({ id, data }: { id: string, data: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await api.put<User>(`/employees/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update user');
    }
  }
);

// Async thunk to change status
export const changeUserStatusThunk = createAsyncThunk(
  'users/changeStatus',
  async ({ id, status }: { id: string; status: 'active' | 'inactive' }, { rejectWithValue }) => {
    try {
      if (status === 'active') {
        const response = await api.patch<User>(`/employees/${id}/activate`);
        return response.data;
      } else {
        const response = await api.patch<User>(`/employees/${id}/deactivate`);
        return response.data;
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to change status');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 0; // reset to first page when limit changes
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 0; // reset to first page when searching
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create User
      .addCase(createUserThunk.fulfilled, (state, action) => {
        // Just prepend to list, though typically you might want to refetch for true ordering
        state.users.unshift(action.payload);
        state.total += 1;
      })
      
      // Update User
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      
      // Change Status
      .addCase(changeUserStatusThunk.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  },
});

export const { setPage, setLimit, setSearch, clearError } = userSlice.actions;
export default userSlice.reducer;
