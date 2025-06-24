import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import './TranslatorWorkPage.css';

const TranslatorWorkPage = ({ userType }) => {
  const [activeTab, setActiveTab] = useState('assigned');
  const [translationRequests, setTranslationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTranslationRequests();
  }, [activeTab]);

  const fetchTranslationRequests = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      let endpoint = '';
      if (userType === 'translator') {
        // For translators, show different views based on active tab
        switch (activeTab) {
          case 'assigned':
            endpoint = '/api/translation-requests/my-requests?status=assigned';
            break;
          case 'completed':
            endpoint = '/api/translation-requests/my-requests?status=completed';
            break;
          case 'in-progress':
            endpoint = '/api/translation-requests/my-requests?status=in-progress';
            break;
          default:
            endpoint = '/api/translation-requests/my-requests';
        }
      } else {
        // For clients, show their requests
        endpoint = `/api/translation-requests/my-requests?status=${activeTab}`;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTranslationRequests(data);
    } catch (error) {
      console.error('Error fetching translation requests:', error);
      setError('Failed to load translation requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/translation-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Refresh the list
      fetchTranslationRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'assigned': return '#3498db';
      case 'in-progress': return '#e67e22';
      case 'completed': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const renderTranslatorTabs = () => (
    <div className="work-tabs">
      <button
        className={`tab-button ${activeTab === 'assigned' ? 'active' : ''}`}
        onClick={() => setActiveTab('assigned')}
      >
        <span className="tab-icon">📋</span>
        Assigned Jobs
      </button>
      <button
        className={`tab-button ${activeTab === 'in-progress' ? 'active' : ''}`}
        onClick={() => setActiveTab('in-progress')}
      >
        <span className="tab-icon">⚡</span>
        In Progress
      </button>
      <button
        className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
        onClick={() => setActiveTab('completed')}
      >
        <span className="tab-icon">✅</span>
        Completed
      </button>
    </div>
  );

  const renderClientTabs = () => (
    <div className="work-tabs">
      <button
        className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
        onClick={() => setActiveTab('pending')}
      >
        <span className="tab-icon">⏳</span>
        Pending
      </button>
      <button
        className={`tab-button ${activeTab === 'assigned' ? 'active' : ''}`}
        onClick={() => setActiveTab('assigned')}
      >
        <span className="tab-icon">👤</span>
        Assigned
      </button>
      <button
        className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
        onClick={() => setActiveTab('completed')}
      >
        <span className="tab-icon">✅</span>
        Completed
      </button>
    </div>
  );

  const renderRequestCard = (request) => (
    <div key={request.id} className="translation-request-card">
      <div className="request-header">
        <div className="request-title">
          <h3>{request.title || `${request.source_language} → ${request.target_language} Translation`}</h3>
          <span 
            className="request-status"
            style={{ backgroundColor: getStatusColor(request.status) }}
          >
            {request.status}
          </span>
        </div>
        <div className="request-meta">
          <span className="request-date">Created: {formatDate(request.created_at)}</span>
          {request.deadline && (
            <span className="request-deadline">Due: {formatDate(request.deadline)}</span>
          )}
        </div>
      </div>

      <div className="request-content">
        <div className="request-description">
          {request.description}
        </div>
        
        <div className="request-details">
          <div className="detail-item">
            <span className="detail-label">Languages:</span>
            <span className="detail-value">{request.source_language} → {request.target_language}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Word Count:</span>
            <span className="detail-value">{request.word_count?.toLocaleString()} words</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Budget:</span>
            <span className="detail-value">{formatCurrency(request.budget)}</span>
          </div>
          {request.special_requirements && (
            <div className="detail-item">
              <span className="detail-label">Requirements:</span>
              <span className="detail-value">{request.special_requirements}</span>
            </div>
          )}
        </div>

        {userType === 'client' && request.translator && (
          <div className="assigned-translator">
            <span className="detail-label">Assigned to:</span>
            <span className="translator-name">{request.translator.name}</span>
          </div>
        )}

        {userType === 'client' && request.client && (
          <div className="client-info">
            <span className="detail-label">Client:</span>
            <span className="client-name">{request.client.name}</span>
          </div>
        )}
      </div>

      {userType === 'translator' && request.status === 'assigned' && (
        <div className="request-actions">
          <button
            className="action-button start-work"
            onClick={() => handleStatusUpdate(request.id, 'in-progress')}
          >
            Start Work
          </button>
        </div>
      )}

      {userType === 'translator' && request.status === 'in-progress' && (
        <div className="request-actions">
          <button
            className="action-button complete-work"
            onClick={() => handleStatusUpdate(request.id, 'completed')}
          >
            Mark Complete
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="translator-work-page">
      <div className="work-header">
        <h2>{userType === 'client' ? 'My Translation Requests' : 'My Translation Work'}</h2>
        <p className="work-description">
          {userType === 'client' 
            ? 'Track and manage your translation requests from submission to completion.'
            : 'Manage your assigned translation projects and track your progress.'
          }
        </p>
      </div>

      {userType === 'translator' ? renderTranslatorTabs() : renderClientTabs()}

      <div className="work-content">
        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={fetchTranslationRequests} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading translation requests...</p>
          </div>
        ) : translationRequests.length > 0 ? (
          <div className="requests-list">
            {translationRequests.map(renderRequestCard)}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No translation requests found</h3>
            <p>
              {activeTab === 'assigned' && userType === 'translator' 
                ? "You don't have any assigned translation jobs yet."
                : activeTab === 'completed'
                ? "No completed translations yet."
                : activeTab === 'in-progress'
                ? "No translations currently in progress."
                : "No translation requests found for this category."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslatorWorkPage;
