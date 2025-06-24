import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { API_URL } from '../config';
import './TranslationRequestsPage.css';

const TranslationRequestsPage = () => {
  const { user, token } = useAuth();
  const { showError, showSuccess } = useNotifications();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const endpoint = user.userType === 'client'
        ? `${API_URL}/api/translation-requests/my-requests`
        : `${API_URL}/api/translation-requests/available`;

      const response = await fetch(`${endpoint}?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        showError('Failed to load translation requests');
      }
    } catch (error) {
      showError('Failed to load translation requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action, data = {}) => {
    try {
      const response = await fetch(`${API_URL}/api/translation-requests/${requestId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        showSuccess(`Request ${action} successful`);
        fetchRequests();
        setShowModal(false);
      } else {
        const error = await response.json();
        showError(error.message || `Failed to ${action} request`);
      }
    } catch (error) {
      showError(`Failed to ${action} request`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'assigned': return '#3b82f6';
      case 'in_progress': return '#8b5cf6';
      case 'completed': return '#10b981';
      case 'delivered': return '#059669';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  if (loading) {
    return (
      <div className="translation-requests-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading translation requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="translation-requests-page">
      <div className="requests-container">
        <div className="requests-header">
          <h1>
            {user.userType === 'client' ? 'My Translation Requests' : 'Available Translation Jobs'}
          </h1>
          <div className="requests-filters">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        <div className="requests-grid">
          {filteredRequests.length === 0 ? (
            <div className="no-requests">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              <h3>No translation requests found</h3>
              <p>
                {user.userType === 'client' 
                  ? 'You haven\'t submitted any translation requests yet.'
                  : 'No translation jobs match your current filter.'
                }
              </p>
            </div>
          ) : (
            filteredRequests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <div className="request-title">
                    <h3>{request.title || `${request.sourceLanguage} → ${request.targetLanguage}`}</h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {request.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="request-meta">
                    <span className="request-date">{formatDate(request.createdAt)}</span>
                  </div>
                </div>

                <div className="request-content">
                  <div className="request-details">
                    <div className="detail-item">
                      <span className="detail-label">Languages:</span>
                      <span className="detail-value">
                        {request.sourceLanguage} → {request.targetLanguage}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Word Count:</span>
                      <span className="detail-value">{request.wordCount} words</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Deadline:</span>
                      <span className="detail-value">{formatDate(request.deadline)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Budget:</span>
                      <span className="detail-value">${request.budget}</span>
                    </div>
                  </div>

                  {request.description && (
                    <div className="request-description">
                      <p>{request.description}</p>
                    </div>
                  )}

                  <div className="request-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowModal(true);
                      }}
                    >
                      View Details
                    </button>
                    
                    {user.userType === 'translator' && request.status === 'pending' && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleRequestAction(request.id, 'apply')}
                      >
                        Apply for Job
                      </button>
                    )}
                    
                    {user.userType === 'client' && request.status === 'pending' && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRequestAction(request.id, 'cancel')}
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {showModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Translation Request Details</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="request-full-details">
                <div className="detail-section">
                  <h3>Project Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Title:</span>
                      <span className="detail-value">
                        {selectedRequest.title || 'Translation Project'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Languages:</span>
                      <span className="detail-value">
                        {selectedRequest.sourceLanguage} → {selectedRequest.targetLanguage}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Word Count:</span>
                      <span className="detail-value">{selectedRequest.wordCount} words</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Deadline:</span>
                      <span className="detail-value">{formatDate(selectedRequest.deadline)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Budget:</span>
                      <span className="detail-value">${selectedRequest.budget}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(selectedRequest.status) }}
                      >
                        {selectedRequest.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedRequest.description && (
                  <div className="detail-section">
                    <h3>Description</h3>
                    <p>{selectedRequest.description}</p>
                  </div>
                )}

                {selectedRequest.specialRequirements && (
                  <div className="detail-section">
                    <h3>Special Requirements</h3>
                    <p>{selectedRequest.specialRequirements}</p>
                  </div>
                )}

                {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                  <div className="detail-section">
                    <h3>Attachments</h3>
                    <div className="attachments-list">
                      {selectedRequest.attachments.map((attachment, index) => (
                        <div key={index} className="attachment-item">
                          <span>{attachment.name}</span>
                          <button className="btn btn-sm">Download</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              {user.userType === 'translator' && selectedRequest.status === 'pending' && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleRequestAction(selectedRequest.id, 'apply')}
                >
                  Apply for This Job
                </button>
              )}
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationRequestsPage;
