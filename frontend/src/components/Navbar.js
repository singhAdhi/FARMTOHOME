// 🧭 NAVBAR - Simple Zustand usage (like RTK)
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser, useAuthStatus, useAuthActions } from "../store/authStore";

const Navbar = () => {
  const navigate = useNavigate();

  // 🎯 GET DATA FROM STORE (like useSelector in RTK)
  const user = useAuthUser();
  const { isAuthenticated } = useAuthStatus();

  // 🎮 GET ACTIONS FROM STORE (like dispatch in RTK)
  const { logout } = useAuthActions();

  // 🚪 LOGOUT HANDLER
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ✅ AUTHENTICATED USER MENU
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
        <span className="nav-link">
          Hello, {user?.name}
          {user?.role && <small> ({user.role})</small>}
        </span>
      </li>
      <li>
        <button onClick={handleLogout} className="nav-link" style={{ background: "none", border: "none", cursor: "pointer" }}>
          Logout
        </button>
      </li>
    </>
  );

  // ❌ NON-AUTHENTICATED USER MENU
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Link to="/" className="navbar-brand">
            🌱 Farm to Home
          </Link>

          <ul className="navbar-nav">{isAuthenticated ? authLinks : guestLinks}</ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
