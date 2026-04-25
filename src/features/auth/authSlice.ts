import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  if (response.data.accessToken) localStorage.setItem('token', response.data.accessToken);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data;
});

export const register = createAsyncThunk('auth/register', async (userData: any) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data.accessToken) localStorage.setItem('token', response.data.accessToken);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
