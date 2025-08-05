// 🔑 LOGIN PAGE - Simple Zustand usage (like RTK)
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStatus, useAuthActions } from '../store/authStore';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [alert, setAlert] = useState(null);
  const { email, password } = formData;
  const navigate = useNavigate();

  // 🎯 GET DATA FROM STORE (like useSelector in RTK)
  const { isAuthenticated, loading, error } = useAuthStatus();
  
  // 🎮 GET ACTIONS FROM STORE (like dispatch in RTK)
  const { login, clearError } = useAuthActions();

  // 🔄 HANDLE SUCCESS/ERROR
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // Redirect on success
    }
    if (error) {
      setAlert({ type: 'danger', message: error });
      clearError();
    }
  }, [isAuthenticated, error, navigate, clearError]);

  // 📝 FORM HANDLERS
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (alert) setAlert(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setAlert({ type: 'danger', message: 'Please fill in all fields' });
      return;
    }

    // 🚀 CALL ACTION (like dispatch in RTK, but simpler!)
    await login({ email, password });
  };

  return (
    <div className="auth-container">
      <form onSubmit={onSubmit} className="auth-form">
        <h2 className="auth-title">🔑 Login to Farm to Home</h2>
        
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}

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
            disabled={loading}
          />
        </div>

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
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? '🔄 Logging in...' : '🔑 Login'}
        </button>

        <div className="auth-link">
          <p>
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login; 