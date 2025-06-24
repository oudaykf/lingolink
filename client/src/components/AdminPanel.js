import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user, token } = useAuth();
  const { showError, showSuccess } = useNotifications();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userType !== 'admin') {
      return;
    }
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch different data based on active tab
      switch (activeTab) {
        case 'overview':
          await fetchStats();
          break;
        case 'users':
          await fetchUsers();
          break;
        case 'requests':
          await fetchRequests();
          break;
        default:
          break;
      }
    } catch (error) {
      showError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    const response = await fetch('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      setStats(data);
    }
  };

  const fetchUsers = async () => {
    const response = await fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };

  const fetchRequests = async () => {
    const response = await fetch('/api/admin/requests', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      setRequests(data);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        showSuccess(`User ${action} successful`);
        fetchUsers();
      } else {
        showError(`Failed to ${action} user`);
      }
    } catch (error) {
      showError(`Failed to ${action} user`);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'requests', label: 'Requests', icon: '📄' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  if (user?.userType !== 'admin') {
    return (
      <div className="admin-panel">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <div className="admin-user-info">
            <span>Welcome, {user.name}</span>
          </div>
        </div>

        <div className="admin-content">
          {/* Sidebar */}
          <div className="admin-sidebar">
            <nav className="admin-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="nav-icon">{tab.icon}</span>
                  <span className="nav-label">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="admin-main">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div className="overview-tab">
                    <h2>Platform Overview</h2>
                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                          <div className="stat-value">{stats.totalUsers || 0}</div>
                          <div className="stat-label">Total Users</div>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon">🌐</div>
                        <div className="stat-info">
                          <div className="stat-value">{stats.totalTranslators || 0}</div>
                          <div className="stat-label">Translators</div>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon">👤</div>
                        <div className="stat-info">
                          <div className="stat-value">{stats.totalClients || 0}</div>
                          <div className="stat-label">Clients</div>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon">📄</div>
                        <div className="stat-info">
                          <div className="stat-value">{stats.totalRequests || 0}</div>
                          <div className="stat-label">Translation Requests</div>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                          <div className="stat-value">{stats.completedRequests || 0}</div>
                          <div className="stat-label">Completed</div>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-info">
                          <div className="stat-value">${stats.totalRevenue || 0}</div>
                          <div className="stat-label">Total Revenue</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'users' && (
                  <div className="users-tab">
                    <h2>User Management</h2>
                    <div className="users-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(user => (
                            <tr key={user.id}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>
                                <span className={`user-type ${user.userType}`}>
                                  {user.userType}
                                </span>
                              </td>
                              <td>
                                <span className={`status ${user.status}`}>
                                  {user.status}
                                </span>
                              </td>
                              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                              <td>
                                <div className="user-actions">
                                  {user.status === 'active' ? (
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleUserAction(user.id, 'suspend')}
                                    >
                                      Suspend
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={() => handleUserAction(user.id, 'activate')}
                                    >
                                      Activate
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => handleUserAction(user.id, 'view')}
                                  >
                                    View
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'requests' && (
                  <div className="requests-tab">
                    <h2>Translation Requests</h2>
                    <div className="requests-table">
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Client</th>
                            <th>Languages</th>
                            <th>Status</th>
                            <th>Budget</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.map(request => (
                            <tr key={request.id}>
                              <td>#{request.id}</td>
                              <td>{request.clientName}</td>
                              <td>{request.sourceLanguage} → {request.targetLanguage}</td>
                              <td>
                                <span className={`status ${request.status}`}>
                                  {request.status}
                                </span>
                              </td>
                              <td>${request.budget}</td>
                              <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                              <td>
                                <div className="request-actions">
                                  <button className="btn btn-sm btn-secondary">
                                    View
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="settings-tab">
                    <h2>Platform Settings</h2>
                    <div className="settings-sections">
                      <div className="setting-section">
                        <h3>General Settings</h3>
                        <div className="setting-item">
                          <label>Platform Name</label>
                          <input type="text" defaultValue="LingoLink" />
                        </div>
                        <div className="setting-item">
                          <label>Default Commission Rate (%)</label>
                          <input type="number" defaultValue="10" />
                        </div>
                      </div>
                      
                      <div className="setting-section">
                        <h3>Email Settings</h3>
                        <div className="setting-item">
                          <label>SMTP Server</label>
                          <input type="text" placeholder="smtp.example.com" />
                        </div>
                        <div className="setting-item">
                          <label>From Email</label>
                          <input type="email" placeholder="noreply@lingolink.com" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="settings-actions">
                      <button className="btn btn-primary">Save Settings</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
