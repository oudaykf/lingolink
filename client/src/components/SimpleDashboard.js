import React from 'react';
import './Dashboard.css';

const SimpleDashboard = ({ user, onLogout }) => {
  console.log('SimpleDashboard rendering with user:', user);
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <h1>LingoLink</h1>
        </div>
        <div className="dashboard-user">
          <span>Welcome, {user?.name || 'User'}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <ul>
              <li className="active">
                <span>Dashboard</span>
              </li>
              <li>
                <span>My Translations</span>
              </li>
            </ul>
          </nav>
        </div>

        <main className="dashboard-main">
          <h2>Dashboard</h2>
          <p>This is a simplified dashboard for testing.</p>
          
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Active Translations</h3>
              <div className="stat-value">0</div>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <div className="stat-value">0</div>
            </div>
            <div className="stat-card">
              <h3>Total Words</h3>
              <div className="stat-value">0</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SimpleDashboard;
