// 🏗️ ZUSTAND AUTH STORE - CENTRALIZED AUTHENTICATION MANAGEMENT
// This file replaces Context API and manages ALL authentication logic in one place

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// 🏠 MAIN AUTH STORE - This is the "Central Bank" for all authentication
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // 📊 AUTH STATE - All authentication data stored here
      user: null,              // Current user object (name, email, role, etc.)
      token: null,             // JWT token for API authentication
      isAuthenticated: false,  // Boolean: is user logged in?
      loading: false,          // Boolean: is auth operation in progress?
      error: null,             // String: any auth error messages

      // 🔧 HELPER ACTIONS - Internal utility functions
      
      // 🔑 Token Management - Handles localStorage and axios headers
      setAuthToken: (token) => {
        console.log('🔑 Setting auth token:', token ? 'Token provided' : 'Removing token');
        
        if (token) {
          // ✅ LOGIN FLOW: Set token in axios headers for all future API calls
          axios.defaults.headers.common['x-auth-token'] = token;
          localStorage.setItem('token', token);
          set({ token });
          console.log('✅ Token saved to localStorage and axios headers');
        } else {
          // ❌ LOGOUT FLOW: Remove token from everywhere
          delete axios.defaults.headers.common['x-auth-token'];
          localStorage.removeItem('token');
          set({ token: null });
          console.log('❌ Token removed from localStorage and axios headers');
        }
      },

      // 📱 Loading State Management
      setLoading: (loading) => {
        console.log('⏳ Setting loading state:', loading);
        set({ loading });
      },
      
      // ❌ Error Management
      setError: (error) => {
        console.log('🚨 Setting error:', error);
        set({ error, loading: false });
      },
      
      clearError: () => {
        console.log('🧹 Clearing error');
        set({ error: null });
      },

      // 🚀 MAIN AUTH ACTIONS - Public functions used by components

      // 📥 LOAD USER - Check if token is valid and get user data
      loadUser: async () => {
        console.log('🔄 Loading user from token...');
        const { token, setAuthToken } = get();
        
        // Step 1: Check if we have a token
        if (!token) {
          console.log('❌ No token found, user not authenticated');
          set({ loading: false, isAuthenticated: false });
          return;
        }

        // Step 2: Set loading state and configure axios
        set({ loading: true, error: null });
        setAuthToken(token);
        console.log('🔧 Token set in axios, making API request...');

        try {
          // Step 3: Call backend to validate token and get user data
          const response = await axios.get('/api/auth/profile');
          console.log('✅ User loaded successfully:', response.data.data);
          
          // Step 4: Update state with user data
          set({
            user: response.data.data,
            isAuthenticated: true,
            loading: false,
            error: null
          });
          
        } catch (error) {
          console.error('❌ Failed to load user:', error.response?.data || error.message);
          
          // Step 5: Token is invalid, clear everything
          const { setAuthToken } = get();
          setAuthToken(null);
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: 'Session expired. Please login again.'
          });
        }
      },

      // 📝 REGISTER - Create new user account
      register: async (userData) => {
        console.log('📝 Starting registration for:', userData.email);
        const { setAuthToken } = get();
        set({ loading: true, error: null });

        try {
          // Step 1: Send registration data to backend
          console.log('📤 Sending registration request...');
          const response = await axios.post('/api/auth/register', userData);
          const { token, user } = response.data.data;
          console.log('✅ Registration successful for user:', user.name);

          // Step 2: Save token and user data
          setAuthToken(token);
          set({
            user,
            isAuthenticated: true,
            loading: false,
            error: null
          });

          console.log('🎉 User registered and logged in successfully');
          return { success: true, data: response.data };

        } catch (error) {
          console.error('❌ Registration failed:', error.response?.data || error.message);
          const errorMessage = error.response?.data?.error?.message || 'Registration failed';
          
          set({
            loading: false,
            error: errorMessage
          });
          
          return { success: false, error: errorMessage };
        }
      },

      // 🔑 LOGIN - Authenticate existing user
      login: async (credentials) => {
        console.log('🔑 Starting login for:', credentials.email);
        const { setAuthToken } = get();
        set({ loading: true, error: null });

        try {
          // Step 1: Send login credentials to backend
          console.log('📤 Sending login request...');
          const response = await axios.post('/api/auth/login', credentials);
          const { token, user } = response.data.data;
          console.log('✅ Login successful for user:', user.name);

          // Step 2: Save token and user data
          setAuthToken(token);
          set({
            user,
            isAuthenticated: true,
            loading: false,
            error: null
          });

          console.log('🎉 User logged in successfully');
          return { success: true, data: response.data };

        } catch (error) {
          console.error('❌ Login failed:', error.response?.data || error.message);
          const errorMessage = error.response?.data?.error?.message || 'Login failed';
          
          set({
            loading: false,
            error: errorMessage
          });
          
          return { success: false, error: errorMessage };
        }
      },

      // 📝 UPDATE PROFILE - Update user information
      updateProfile: async (profileData) => {
        console.log('📝 Updating profile for user:', get().user?.name);
        set({ loading: true, error: null });

        try {
          // Step 1: Send update request to backend
          console.log('📤 Sending profile update request...');
          const response = await axios.put('/api/auth/profile', profileData);
          console.log('✅ Profile updated successfully');

          // Step 2: Update user data in store
          set({
            user: response.data.data,
            loading: false,
            error: null
          });

          console.log('🔄 Profile data refreshed in store');
          return { success: true, data: response.data };

        } catch (error) {
          console.error('❌ Profile update failed:', error.response?.data || error.message);
          const errorMessage = error.response?.data?.error?.message || 'Update failed';
          
          set({
            loading: false,
            error: errorMessage
          });
          
          return { success: false, error: errorMessage };
        }
      },

      // 🚪 LOGOUT - Clear all authentication data
      logout: () => {
        console.log('🚪 Logging out user:', get().user?.name);
        const { setAuthToken } = get();
        
        // Step 1: Remove token from everywhere
        setAuthToken(null);
        
        // Step 2: Clear all auth state
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
        
        console.log('✅ User logged out successfully');
      }
    }),
    {
      // 💾 PERSISTENCE CONFIG - Save token to localStorage
      name: 'farm-to-home-auth', // localStorage key name
      partialize: (state) => ({ 
        token: state.token  // Only persist token, not user data
      }),
      onRehydrateStorage: () => {
        console.log('🔄 Rehydrating auth state from localStorage...');
        return (state, error) => {
          if (error) {
            console.error('❌ Failed to rehydrate auth state:', error);
          } else {
            console.log('✅ Auth state rehydrated, token found:', !!state?.token);
          }
        };
      }
    }
  )
);

// 🎯 SELECTOR HOOKS - Optimized hooks for specific data (prevents unnecessary re-renders)

// Get only user data (components using this only re-render when user changes)
export const useAuthUser = () => useAuthStore(state => state.user);

// Get only auth status (components using this only re-render when status changes)
export const useAuthStatus = () => useAuthStore(state => ({
  isAuthenticated: state.isAuthenticated,
  loading: state.loading,
  error: state.error
}));

// Get only auth actions (components using this never re-render)
export const useAuthActions = () => useAuthStore(state => ({
  login: state.login,
  register: state.register,
  logout: state.logout,
  updateProfile: state.updateProfile,
  loadUser: state.loadUser,
  clearError: state.clearError
}));

// 🚀 INITIALIZE AUTH - Load user on app start
console.log('🚀 Initializing auth store...');
useAuthStore.getState().loadUser(); 