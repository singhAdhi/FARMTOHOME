import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'customer'
  });
  const [alert, setAlert] = useState(null);

  const { name, email, password, password2, role } = formData;
  const { register, error, clearErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    if (error) {
      setAlert({ type: 'danger', message: error });
      clearErrors();
    }
  }, [error, isAuthenticated, navigate, clearErrors]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (name === '' || email === '' || password === '') {
      setAlert({ type: 'danger', message: 'Please enter all fields' });
    } else if (password !== password2) {
      setAlert({ type: 'danger', message: 'Passwords do not match' });
    } else {
      register({
        name,
        email,
        password,
        role
      });
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={onSubmit} className="auth-form">
        <h2 className="auth-title">Register</h2>
        
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}

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
          />
        </div>

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
          />
        </div>

        <div className="form-group">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={onChange}
            className="form-input"
          >
            <option value="customer">Customer</option>
            <option value="farmer">Farmer</option>
          </select>
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
            minLength="6"
          />
        </div>

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
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Register
        </button>

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