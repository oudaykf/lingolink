import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import './AdminLogin.css';

const AdminLogin = ({ onClose, onSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        // Store admin token
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
        console.log('🔐 Admin login successful');
        onSuccess && onSuccess();
        navigate('/admin-dashboard');
      } else {
        setError(data.message || 'Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="admin-login-overlay" onClick={handleOverlayClick}>
      <div className="admin-login-modal">
        <div className="admin-login-header">
          <h2>🔐 Administrator Access</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="admin-login-content">
          <div className="admin-warning">
            <div className="warning-icon">⚠️</div>
            <p>This is a restricted area. Only authorized administrators may access this panel.</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="email">Administrator Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder="ouday.kefi@gmail.com"
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Administrator Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter admin password"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="admin-login-btn"
              disabled={loading || !credentials.email || !credentials.password}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  <span className="lock-icon">🔓</span>
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          <div className="admin-info">
            <div className="info-item">
              <strong>Access Level:</strong> Full System Control
            </div>
            <div className="info-item">
              <strong>Permissions:</strong> Read/Write All Data
            </div>
            <div className="info-item">
              <strong>Monitoring:</strong> All actions are logged
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
