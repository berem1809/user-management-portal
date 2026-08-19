import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/api';

// Define the shape of our authentication state
export interface AuthState {
  isAuthenticated: boolean;
  isOtpVerified: boolean;
  pendingToken: string | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state, reading from localStorage if available (client-side only check)
const getInitialState = (): AuthState => {
  let accessToken = null;
  let pendingToken = null;
  if (typeof window !== 'undefined') {
    accessToken = sessionStorage.getItem('access_token');
    pendingToken = sessionStorage.getItem('pending_token');
  }

  return {
    isAuthenticated: !!accessToken,
    isOtpVerified: !!accessToken,
    pendingToken,
    accessToken,
    loading: false,
    error: null,
  };
};

// Async thunk for logging in
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      // The backend should return a 401 or similar with a message
      const detail = error.response?.data?.detail;
      let errorMessage = 'Login failed';
      if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (Array.isArray(detail) && detail.length > 0 && detail[0].msg) {
        errorMessage = detail[0].msg;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for verifying OTP
export const verifyOtpThunk = createAsyncThunk(
  'auth/verifyOtp',
  async (otpData: { otp: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-otp', otpData);
      return response.data;
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      let errorMessage = 'OTP Verification failed';
      if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (Array.isArray(detail) && detail.length > 0 && detail[0].msg) {
        errorMessage = detail[0].msg;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    // A simple logout action
    logout: (state) => {
      state.isAuthenticated = false;
      state.isOtpVerified = false;
      state.pendingToken = null;
      state.accessToken = null;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('pending_token');
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login Thunk
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        // The backend returns a pending_token according to the README
        state.pendingToken = action.payload.pending_token;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pending_token', action.payload.pending_token);
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify OTP Thunk
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.isOtpVerified = true;
        // The backend returns an access_token according to the README
        state.accessToken = action.payload.access_token;
        // Clear pending token as it's no longer needed
        state.pendingToken = null; 
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('access_token', action.payload.access_token);
          sessionStorage.removeItem('pending_token');
        }
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
