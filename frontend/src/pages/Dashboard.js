// 📊 DASHBOARD PAGE - Uses Zustand for user authentication
// Shows different content based on user role (farmer vs customer)

import React, { useState, useEffect } from "react";
import api from "../utils/api.js";
// ✅ Import Zustand hooks from store
import { useAuthUser } from "../store/authStore";

const Dashboard = () => {
  // 🎯 ZUSTAND SELECTOR - Get only user data (optimized re-renders)
  const user = useAuthUser();
  console.log("📊 Dashboard: Current user:", user);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "vegetables",
    stock: "",
    unit: "kg",
    isOrganic: false,
  });

  useEffect(() => {
    if (user && user.role === "farmer") {
      fetchMyProducts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMyProducts = async () => {
    try {
      const res = await api.get("/api/products");
      // Filter products by current user (farmer)
      const myProducts = res.data.filter((product) => product.farmer._id === user._id);
      setProducts(myProducts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/products", formData);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "vegetables",
        stock: "",
        unit: "kg",
        isOrganic: false,
      });
      setShowAddForm(false);
      fetchMyProducts();
    } catch (err) {
      console.error("Error creating product:", err);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Dashboard</h1>

      {/* Welcome Section */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <div className="card-body">
          <h2>Welcome back, {user?.name}!</h2>
          <p>
            Role: <strong>{user?.role}</strong>
          </p>
          <p>Email: {user?.email}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        {user?.role === "farmer" && (
          <>
            <div className="stats-card">
              <div className="stats-number">{products.length}</div>
              <div className="stats-label">Products Listed</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">{products.reduce((sum, product) => sum + product.stock, 0)}</div>
              <div className="stats-label">Total Stock</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">{products.filter((product) => product.isOrganic).length}</div>
              <div className="stats-label">Organic Products</div>
            </div>
          </>
        )}

        {user?.role === "customer" && (
          <>
            <div className="stats-card">
              <div className="stats-number">0</div>
              <div className="stats-label">Orders Placed</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">$0</div>
              <div className="stats-label">Total Spent</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">0</div>
              <div className="stats-label">Favorite Farmers</div>
            </div>
          </>
        )}
      </div>

      {/* Farmer-specific content */}
      {user?.role === "farmer" && (
        <div style={{ marginTop: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2>My Products</h2>
            <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? "Cancel" : "Add New Product"}
            </button>
          </div>

          {/* Add Product Form */}
          {showAddForm && (
            <div className="card" style={{ marginBottom: "30px" }}>
              <div className="card-header">
                <h3>Add New Product</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                    <div className="form-group">
                      <label className="form-label">Product Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select name="category" value={formData.category} onChange={handleInputChange} className="form-input">
                        <option value="vegetables">Vegetables</option>
                        <option value="fruits">Fruits</option>
                        <option value="grains">Grains</option>
                        <option value="dairy">Dairy</option>
                        <option value="meat">Meat</option>
                        <option value="herbs">Herbs</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price</label>
                      <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Unit</label>
                      <select name="unit" value={formData.unit} onChange={handleInputChange} className="form-input">
                        <option value="kg">Kg</option>
                        <option value="lb">Lb</option>
                        <option value="piece">Piece</option>
                        <option value="bunch">Bunch</option>
                        <option value="dozen">Dozen</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Stock</label>
                      <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="form-input" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-input" rows="3" required />
                  </div>
                  <div className="form-group">
                    <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input type="checkbox" name="isOrganic" checked={formData.isOrganic} onChange={handleInputChange} />
                      Organic Product
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Add Product
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Products List */}
          {products.length === 0 ? (
            <div className="card">
              <div className="card-body" style={{ textAlign: "center", padding: "60px" }}>
                <h3>No products yet</h3>
                <p>Start by adding your first product!</p>
              </div>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <div key={product._id} className="card">
                  <div className="card-body">
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-price">
                      ${product.price} / {product.unit}
                    </div>
                    <div className="product-category">{product.category}</div>
                    <p style={{ color: "#666", marginBottom: "15px" }}>{product.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: product.stock > 0 ? "#28a745" : "#dc3545" }}>{product.stock} in stock</span>
                      {product.isOrganic && (
                        <span
                          style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                          }}
                        >
                          Organic
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Customer-specific content */}
      {user?.role === "customer" && (
        <div style={{ marginTop: "40px" }}>
          <h2>Recent Orders</h2>
          <div className="card">
            <div className="card-body" style={{ textAlign: "center", padding: "60px" }}>
              <h3>No orders yet</h3>
              <p>Start shopping for fresh products from local farmers!</p>
              <a href="/products" className="btn btn-primary">
                Browse Products
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
