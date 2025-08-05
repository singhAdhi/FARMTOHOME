// 🔒 PRIVATE ROUTE COMPONENT - Uses Zustand for auth state
// Protects routes that require authentication - redirects to login if not authenticated

import React from 'react';
import { Navigate } from 'react-router-dom';
// ✅ Import Zustand hooks from store
import { useAuthStatus } from '../store/authStore';

const PrivateRoute = ({ children }) => {
  // 🎯 ZUSTAND SELECTOR - Only subscribe to auth status
  const { isAuthenticated, loading } = useAuthStatus();
  
  console.log('🔒 PrivateRoute: Checking access - authenticated:', isAuthenticated, 'loading:', loading);

  // ⏳ LOADING STATE - Show loading while auth status is being determined
  if (loading) {
    console.log('⏳ PrivateRoute: Still loading, showing loading spinner');
    return (
      <div className="loading" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>🔄 Loading...</div>
      </div>
    );
  }

  // 🔀 CONDITIONAL RENDERING - Based on authentication status from Zustand
  if (isAuthenticated) {
    console.log('✅ PrivateRoute: User authenticated, rendering protected content');
    return children; // Render the protected component
  } else {
    console.log('❌ PrivateRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />; // Redirect to login page
  }
};

export default PrivateRoute; 