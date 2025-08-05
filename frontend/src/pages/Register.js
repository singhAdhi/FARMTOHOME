// 📝 REGISTER PAGE - Uses Zustand for authentication
// Handles user registration and redirects to dashboard on success

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// ✅ Import Zustand hooks from store
import { useAuthStatus, useAuthActions } from '../store/authStore';

const Register = () => {
  // 📝 LOCAL FORM STATE - Manages form input data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'customer' // Default to customer role
  });
  const [alert, setAlert] = useState(null);

  const { name, email, password, password2, role } = formData;
  const navigate = useNavigate();

  // 🎯 ZUSTAND SELECTORS - Get auth state and actions
  const { isAuthenticated, loading, error } = useAuthStatus();
  const { register, clearError } = useAuthActions();

  // 🔄 SIDE EFFECTS - Handle navigation and error display
  useEffect(() => {
    console.log('📝 Register: Auth state changed - authenticated:', isAuthenticated, 'error:', error);
    
    // ✅ REDIRECT ON SUCCESS - If user is registered and authenticated, go to dashboard
    if (isAuthenticated) {
      console.log('✅ Register: User registered and authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }

    // ❌ SHOW ERRORS - Display any authentication errors
    if (error) {
      console.log('❌ Register: Showing error:', error);
      setAlert({ type: 'danger', message: error });
      clearError(); // Clear error from Zustand store
    }
  }, [error, isAuthenticated, navigate, clearError]);

  // 📝 FORM HANDLERS
  const onChange = (e) => {
    console.log('📝 Register: Form field changed:', e.target.name, '=', e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear local alert when user starts typing
    if (alert) setAlert(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Register: Form submitted for:', { name, email, role });
    
    // 🔍 CLIENT-SIDE VALIDATION
    if (name === '' || email === '' || password === '') {
      console.log('❌ Register: Validation failed - empty fields');
      setAlert({ type: 'danger', message: 'Please enter all fields' });
      return;
    } 
    
    if (password !== password2) {
      console.log('❌ Register: Validation failed - passwords do not match');
      setAlert({ type: 'danger', message: 'Passwords do not match' });
      return;
    }

    if (password.length < 6) {
      console.log('❌ Register: Validation failed - password too short');
      setAlert({ type: 'danger', message: 'Password must be at least 6 characters' });
      return;
    }

    // 🚀 CALL ZUSTAND REGISTER ACTION
    console.log('📤 Register: Calling Zustand register action');
    const result = await register({
      name,
      email,
      password,
      role
    });
    
    // The register function returns { success: boolean, error?: string }
    // Success/error handling is done in useEffect above
    if (result.success) {
      console.log('🎉 Register: Registration successful, Zustand will handle navigation');
    } else {
      console.log('❌ Register: Registration failed, error will be shown by useEffect');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={onSubmit} className="auth-form">
        <h2 className="auth-title">📝 Join Farm to Home</h2>
        
        {/* 🚨 ALERT DISPLAY - Shows validation errors or auth errors */}
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}

        {/* 👤 NAME INPUT */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            required
            className="form-input"
            placeholder="Enter your full name"
            disabled={loading} // Disable during registration process
          />
        </div>

        {/* 📧 EMAIL INPUT */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="form-input"
            placeholder="Enter your email"
            disabled={loading} // Disable during registration process
          />
        </div>

        {/* 🎭 ROLE SELECTION - Important for Farm to Home app */}
        <div className="form-group">
          <label htmlFor="role" className="form-label">I am a...</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={onChange}
            className="form-input"
            disabled={loading} // Disable during registration process
          >
            <option value="customer">🛒 Customer (I want to buy fresh produce)</option>
            <option value="farmer">🌾 Farmer (I want to sell my produce)</option>
          </select>
        </div>

        {/* 🔒 PASSWORD INPUT */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            className="form-input"
            placeholder="Enter your password (min 6 characters)"
            minLength="6"
            disabled={loading} // Disable during registration process
          />
        </div>

        {/* 🔒 CONFIRM PASSWORD INPUT */}
        <div className="form-group">
          <label htmlFor="password2" className="form-label">Confirm Password</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={onChange}
            required
            className="form-input"
            placeholder="Confirm your password"
            minLength="6"
            disabled={loading} // Disable during registration process
          />
        </div>

        {/* 🚀 SUBMIT BUTTON - Shows loading state from Zustand */}
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          disabled={loading} // Disable during registration process
        >
          {loading ? '🔄 Creating Account...' : '📝 Create Account'}
        </button>

        {/* 🔑 LOGIN LINK */}
        <div className="auth-link">
          <p>
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register; 