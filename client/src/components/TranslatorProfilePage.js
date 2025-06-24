import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import './TranslatorProfilePage.css';

const TranslatorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { showError, showSuccess } = useNotifications();
  const [translator, setTranslator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    fetchTranslatorProfile();
    fetchTranslatorReviews();
  }, [id]);

  const fetchTranslatorProfile = async () => {
    try {
      const response = await fetch(`/api/translators/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTranslator(data);
      } else {
        showError('Translator not found');
        navigate('/dashboard');
      }
    } catch (error) {
      showError('Failed to load translator profile');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchTranslatorReviews = async () => {
    try {
      const response = await fetch(`/api/translators/${id}/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const handleContactTranslator = async () => {
    if (!contactMessage.trim()) {
      showError('Please enter a message');
      return;
    }

    try {
      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: translator.id,
          initialMessage: contactMessage.trim()
        })
      });

      if (response.ok) {
        showSuccess('Message sent successfully');
        setShowContactModal(false);
        setContactMessage('');
        navigate('/messages');
      } else {
        showError('Failed to send message');
      }
    } catch (error) {
      showError('Failed to send message');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star filled">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">★</span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">★</span>
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="translator-profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading translator profile...</p>
        </div>
      </div>
    );
  }

  if (!translator) {
    return (
      <div className="translator-profile-page">
        <div className="error-container">
          <h2>Translator not found</h2>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="translator-profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-main">
            <div className="profile-avatar">
              {translator.profileImage ? (
                <img src={translator.profileImage} alt={translator.name} />
              ) : (
                <div className="avatar-placeholder">
                  {translator.name.charAt(0).toUpperCase()}
                </div>
              )}
              {translator.isVerified && (
                <div className="verified-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              )}
            </div>

            <div className="profile-info">
              <h1>{translator.name}</h1>
              <p className="profile-title">{translator.title || 'Professional Translator'}</p>
              <div className="profile-rating">
                <div className="stars">
                  {renderStars(translator.rating || 0)}
                </div>
                <span className="rating-text">
                  {translator.rating?.toFixed(1) || '0.0'} ({translator.reviewCount || 0} reviews)
                </span>
              </div>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">{translator.completedProjects || 0}</span>
                  <span className="stat-label">Projects Completed</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{translator.onTimePercentage || 0}%</span>
                  <span className="stat-label">On-Time Delivery</span>
                </div>
                <div className="stat">
                  <span className="stat-value">${translator.ratePerWord || 0}</span>
                  <span className="stat-label">Per Word</span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              {user?.userType === 'client' && (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowContactModal(true)}
                  >
                    Contact Translator
                  </button>
                  <button className="btn btn-secondary">
                    Request Quote
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <div className="details-grid">
            {/* About */}
            <div className="detail-section">
              <h2>About</h2>
              <p>{translator.description || 'No description available.'}</p>
            </div>

            {/* Languages */}
            <div className="detail-section">
              <h2>Languages</h2>
              <div className="languages-list">
                {translator.languages?.map((language, index) => (
                  <span key={index} className="language-tag">
                    {language}
                  </span>
                )) || <p>No languages specified.</p>}
              </div>
            </div>

            {/* Specializations */}
            <div className="detail-section">
              <h2>Specializations</h2>
              <div className="specializations-list">
                {translator.specialties?.map((specialty, index) => (
                  <span key={index} className="specialty-tag">
                    {specialty}
                  </span>
                )) || <p>No specializations specified.</p>}
              </div>
            </div>

            {/* Experience */}
            <div className="detail-section">
              <h2>Experience</h2>
              <div className="experience-info">
                <p><strong>Years of Experience:</strong> {translator.yearsOfExperience || 'Not specified'}</p>
                <p><strong>Education:</strong> {translator.education || 'Not specified'}</p>
                <p><strong>Certifications:</strong> {translator.certifications || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="reviews-section">
            <h2>Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet.</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <strong>{review.clientName}</strong>
                        <div className="review-rating">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="review-content">{review.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact {translator.name}</h2>
              <button
                className="modal-close"
                onClick={() => setShowContactModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="contact-form">
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Write your message here..."
                  rows="4"
                  className="contact-textarea"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={handleContactTranslator}
                disabled={!contactMessage.trim()}
              >
                Send Message
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowContactModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslatorProfilePage;
