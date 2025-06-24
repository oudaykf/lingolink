import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('email'); // 'email', 'sent', 'reset'
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setResetToken(token);
      setStep('reset');
    }
  }, [searchParams]);

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset email sent! Please check your inbox.');
        setStep('sent');
      } else {
        setError(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successfully! You can now login with your new password.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <div className="forgot-password-container">
        <div className="forgot-password-card" onClick={(e) => e.stopPropagation()}>
        <div className="forgot-password-header">
          <button className="close-button" onClick={onClose} type="button">&times;</button>
          <h1>Forgot Password</h1>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleSendResetEmail} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="glass-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button
            type="submit"
            disabled={loading}
            className="glass-button primary"
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>

        <div className="forgot-password-footer">
          <button
            onClick={() => navigate('/login')}
            className="link-button"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );

  const renderSentStep = () => (
    <div className="forgot-password-container">
      <div className="forgot-password-card" onClick={(e) => e.stopPropagation()}>
        <div className="forgot-password-header">
          <button className="close-button" onClick={onClose} type="button">&times;</button>
          <h1>Email Sent</h1>
          <p>We've sent a password reset link to your email address.</p>
        </div>

        <div className="sent-message">
          <div className="success-icon">✓</div>
          <p>Please check your email and click the reset link to continue.</p>
          <p className="note">If you don't see the email, check your spam folder.</p>
        </div>

        <div className="reset-token-section">
          <p>Or enter the reset token manually:</p>
          <input
            type="text"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            placeholder="Enter reset token"
            className="glass-input"
          />
          <button
            onClick={() => setStep('reset')}
            disabled={!resetToken}
            className="glass-button secondary"
          >
            Continue with Token
          </button>
        </div>

        <div className="forgot-password-footer">
          <button
            onClick={() => setStep('email')}
            className="link-button"
          >
            Try Different Email
          </button>
          <button
            onClick={() => navigate('/login')}
            className="link-button"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );

  const renderResetStep = () => (
    <div className="forgot-password-container">
      <div className="forgot-password-card" onClick={(e) => e.stopPropagation()}>
        <div className="forgot-password-header">
          <button className="close-button" onClick={onClose} type="button">&times;</button>
          <h1>Reset Password</h1>
          <p>Enter your new password below.</p>
        </div>

        <form onSubmit={handleResetPassword} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
              className="glass-input"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
              className="glass-input"
              minLength="6"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button
            type="submit"
            disabled={loading}
            className="glass-button primary"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="forgot-password-footer">
          <button
            onClick={() => navigate('/login')}
            className="link-button"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="forgot-password-page" onClick={onClose}>
      {step === 'email' && renderEmailStep()}
      {step === 'sent' && renderSentStep()}
      {step === 'reset' && renderResetStep()}
    </div>
  );
};

export default ForgotPassword;