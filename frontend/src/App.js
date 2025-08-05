// 🚀 MAIN APP COMPONENT - Now uses Zustand instead of Context API
// No more AuthProvider wrapper needed! Zustand works globally without providers.

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// ❌ Removed: import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    // 🏗️ CLEAN STRUCTURE - No AuthProvider needed with Zustand!
    // The auth store is automatically available to all components
    <Router>
      <div className="App">
        {/* 🧭 Navigation - Will use Zustand hooks for auth state */}
        <Navbar />
        
        <main className="main-content">
          {/* 🛤️ Routes - Each component will access Zustand directly */}
          <Routes>
            {/* 🏠 Public Routes - Available to everyone */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            
            {/* 🔐 Auth Routes - Only for non-authenticated users */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* 🔒 Protected Routes - Only for authenticated users */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 