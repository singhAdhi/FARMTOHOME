import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const authLinks = (
    <>
      <li>
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/products" className="nav-link">
          Products
        </Link>
      </li>
      <li>
        <span className="nav-link">Hello, {user && user.name}</span>
      </li>
      <li>
        <button onClick={onLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          Logout
        </button>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link to="/products" className="nav-link">
          Products
        </Link>
      </li>
      <li>
        <Link to="/register" className="nav-link">
          Register
        </Link>
      </li>
      <li>
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </li>
    </>
  );

  return (
    <nav className="navbar">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link to="/" className="navbar-brand">
            🌱 Farm to Home
          </Link>
          <ul className="navbar-nav">
            {isAuthenticated ? authLinks : guestLinks}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 