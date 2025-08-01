import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching products');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Fresh Products</h1>
      
      {products.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '60px' }}>
            <h3>No products available</h3>
            <p>Check back later for fresh products from local farmers!</p>
          </div>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="card product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>No Image</span>
                )}
              </div>
              <div className="card-body">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">
                  ${product.price} / {product.unit}
                </div>
                <div className="product-category">{product.category}</div>
                <div className="product-farmer">
                  By: {product.farmer?.name || 'Unknown Farmer'}
                </div>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                  {product.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ color: product.stock > 0 ? '#28a745' : '#dc3545' }}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                  {product.isOrganic && (
                    <span style={{ 
                      backgroundColor: '#28a745', 
                      color: 'white', 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem' 
                    }}>
                      Organic
                    </span>
                  )}
                </div>
                <button 
                  className={`btn ${product.stock > 0 ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%' }}
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products; 