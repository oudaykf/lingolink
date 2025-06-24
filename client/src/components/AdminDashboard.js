import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    fetchData();
  }, [activeTab]);

  const checkAdminAuth = () => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    
    if (!adminToken || !adminUser) {
      console.log('No admin credentials found, redirecting...');
      navigate('/');
      return;
    }

    try {
      const user = JSON.parse(adminUser);
      if (user.userType !== 'admin') {
        console.log('User is not admin, redirecting...');
        navigate('/');
        return;
      }
    } catch (error) {
      console.error('Invalid admin user data:', error);
      navigate('/');
      return;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      
      if (activeTab === 'users') {
        await fetchUsers();
      } else if (activeTab === 'stats') {
        await fetchStats();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/all-users`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const handleSaveUser = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(editingUser)
      });

      if (response.ok) {
        await fetchUsers();
        setShowEditModal(false);
        setEditingUser(null);
        console.log('User updated successfully');
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        await fetchUsers();
        console.log('User deleted successfully');
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || user.user_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const tabs = [
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'stats', label: 'Platform Stats', icon: '📊' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' }
  ];

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-title">
          <h1>🔐 Administrator Dashboard</h1>
          <p>Full system control and user management</p>
        </div>
        <div className="admin-actions">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
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

        <div className="admin-main">
          {activeTab === 'users' && (
            <div className="users-management">
              <div className="users-header">
                <h2>User Management</h2>
                <div className="users-controls">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Users</option>
                    <option value="client">Clients</option>
                    <option value="translator">Translators</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>

              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td className="user-id">{user.id.substring(0, 8)}...</td>
                        <td className="user-name">{user.name}</td>
                        <td className="user-email">{user.email}</td>
                        <td>
                          <span className={`user-type ${user.user_type}`}>
                            {user.user_type}
                          </span>
                        </td>
                        <td>
                          <span className={`status ${user.status || 'active'}`}>
                            {user.status || 'active'}
                          </span>
                        </td>
                        <td className="user-date">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="user-actions">
                          <button
                            className="btn btn-edit"
                            onClick={() => handleEditUser(user)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-overview">
              <h2>Platform Statistics</h2>
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
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="system-settings">
              <h2>System Settings</h2>
              <div className="settings-section">
                <h3>Platform Configuration</h3>
                <p>System settings and configuration options will be available here.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User: {editingUser.name}</h2>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>User Type</label>
                <select
                  value={editingUser.user_type}
                  onChange={(e) => setEditingUser({...editingUser, user_type: e.target.value})}
                >
                  <option value="client">Client</option>
                  <option value="translator">Translator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSaveUser}>
                Save Changes
              </button>
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
