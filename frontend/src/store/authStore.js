// 🏠 ZUSTAND AUTH STORE - Think of this as RTK slice but simpler!
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// 🏪 CREATE STORE (like RTK createSlice but easier!)
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // 📊 STATE (like RTK initial state)
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // 🎮 ACTIONS (like RTK reducers but simpler - no dispatch needed!)
      
      // 🔑 LOGIN ACTION
      login: async (credentials) => {
        set({ loading: true, error: null });
        
        try {
          const response = await axios.post('/api/auth/login', credentials);
          const { token, user } = response.data.data;
          
          // Save token to localStorage and axios
          localStorage.setItem('token', token);
          axios.defaults.headers.common['x-auth-token'] = token;
          
          // Update store (like updating RTK slice)
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null
          });
          
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.error?.message || 'Login failed';
          set({ loading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // 📝 REGISTER ACTION  
      register: async (userData) => {
        set({ loading: true, error: null });
        
        try {
          const response = await axios.post('/api/auth/register', userData);
          const { token, user } = response.data.data;
          
          localStorage.setItem('token', token);
          axios.defaults.headers.common['x-auth-token'] = token;
          
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null
          });
          
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.error?.message || 'Registration failed';
          set({ loading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // 📥 LOAD USER (check if token is valid)
      loadUser: async () => {
        const { token } = get();
        if (!token) {
          set({ loading: false, isAuthenticated: false });
          return;
        }

        set({ loading: true });
        axios.defaults.headers.common['x-auth-token'] = token;

        try {
          const response = await axios.get('/api/auth/profile');
          set({
            user: response.data.data,
            isAuthenticated: true,
            loading: false,
            error: null
          });
        } catch (error) {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['x-auth-token'];
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: 'Session expired'
          });
        }
      },

      // 🚪 LOGOUT ACTION
      logout: () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
      },

      // 🧹 CLEAR ERROR
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token })
    }
  )
);

// 🎯 SELECTORS (like useSelector in RTK)
export const useAuthUser = () => useAuthStore(state => state.user);
export const useAuthStatus = () => useAuthStore(state => ({
  isAuthenticated: state.isAuthenticated,
  loading: state.loading,
  error: state.error
}));
export const useAuthActions = () => useAuthStore(state => ({
  login: state.login,
  register: state.register,
  logout: state.logout,
  clearError: state.clearError
}));

// 🚀 AUTO-LOAD USER ON APP START
useAuthStore.getState().loadUser(); 