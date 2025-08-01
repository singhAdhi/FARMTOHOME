import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">Fresh from Farm to Your Home</h1>
          <p className="hero-subtitle">
            Connect directly with local farmers and get the freshest produce delivered to your doorstep
          </p>
          <Link to="/products" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '15px 30px' }}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="page-title">Why Choose Farm to Home?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🥕</span>
              <h3 className="feature-title">Fresh & Organic</h3>
              <p className="feature-description">
                Get the freshest produce directly from local farms. No middlemen, no long storage times.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🚚</span>
              <h3 className="feature-title">Direct Delivery</h3>
              <p className="feature-description">
                Fast and reliable delivery straight from the farm to your home within 24 hours.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">👨‍🌾</span>
              <h3 className="feature-title">Support Farmers</h3>
              <p className="feature-description">
                Support local farmers and sustainable agriculture while getting the best prices.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💰</span>
              <h3 className="feature-title">Fair Prices</h3>
              <p className="feature-description">
                No middlemen means better prices for you and fair compensation for farmers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Ready to Get Started?</h2>
          <p style={{ marginBottom: '30px', color: '#666', fontSize: '1.1rem' }}>
            Join thousands of customers who trust Farm to Home for their fresh produce needs
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary">
              Sign Up Now
            </Link>
            <Link to="/products" className="btn btn-secondary">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 