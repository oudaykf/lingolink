import React, { useState } from 'react';
import './AuthPage.css';

const SimpleAuthPage = ({ onSuccess, currentLanguage, translations, onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    userType: 'client'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const t = (key) => translations[currentLanguage][key];

  const validateForm = () => {
    const errors = {};

    if (isLogin) {
      if (!formData.email) {
        errors.email = t('emailRequired');
      }
      if (!formData.password) {
        errors.password = t('passwordRequired');
      }
    } else {
      if (!formData.name) {
        errors.name = t('nameRequired');
      }
      if (!formData.email) {
        errors.email = t('emailRequired');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = t('invalidEmail');
      }
      if (!formData.password) {
        errors.password = t('passwordRequired');
      } else if (formData.password.length < 6) {
        errors.password = t('passwordTooShort');
      }
      if (!formData.userType) {
        errors.userType = t('userTypeRequired');
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    // Validate form before submission
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const endpoint = `${API_URL}/api/auth/${isLogin ? 'login' : 'register'}`;

      // Prepare the request data
      const requestData = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            userType: formData.userType
          };

      console.log('Sending request to:', endpoint, 'with data:', { ...requestData, password: '[REDACTED]' });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error('Server returned an invalid response format');
      }

      // Handle error responses
      if (!response.ok) {
        console.error('Authentication failed:', data);
        throw new Error(data.error || 'Authentication failed');
      }

      console.log('Authentication successful:', data);

      // Map user_type to userType for frontend compatibility
      if (data.user && data.user.user_type) {
        data.user.userType = data.user.user_type;
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Log successful authentication
      console.log(`User ${isLogin ? 'logged in' : 'registered'}: ${formData.email}`);

      // Notify parent component about successful authentication
      if (onAuthenticated) {
        onAuthenticated(data.user);
      }

      // Close modal if needed
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Clear specific field error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear general error
    if (error) {
      setError('');
    }
  };

  return (
    <div className="auth-modal">
      <div className="auth-logo">
        <img src="/new-main-logo.svg" alt="LingoLink" className="logo" />
      </div>



      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">
              <span>{t('fullName')}</span>
            </label>
            <div className="input-container">
              <i className="input-icon user-icon"></i>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('fullNamePlaceholder')}
                className={validationErrors.name ? 'input-error' : ''}
              />
            </div>
            {validationErrors.name && (
              <div className="field-error">{validationErrors.name}</div>
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">
            <span>{t('emailAddress')}</span>
          </label>
          <div className="input-container">
            <i className="input-icon email-icon"></i>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('emailPlaceholder')}
              className={validationErrors.email ? 'input-error' : ''}
            />
          </div>
          {validationErrors.email && (
            <div className="field-error">{validationErrors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <span>{t('password')}</span>
          </label>
          <div className="input-container">
            <i className="input-icon password-icon"></i>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('passwordPlaceholder')}
              className={validationErrors.password ? 'input-error' : ''}
            />
          </div>
          {validationErrors.password && (
            <div className="field-error">{validationErrors.password}</div>
          )}
        </div>

        {!isLogin && (
          <div className="form-group">
            <label htmlFor="userType">
              <span>{t('iWantTo')}</span>
            </label>
            <div className="user-type-selector">
              <button
                type="button"
                className={`user-type-option ${formData.userType === 'client' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, userType: 'client' })}
              >
                <i className="user-type-icon client-icon"></i>
                <span>{t('hireTranslators')}</span>
              </button>
              <button
                type="button"
                className={`user-type-option ${formData.userType === 'translator' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, userType: 'translator' })}
              >
                <i className="user-type-icon translator-icon"></i>
                <span>{t('workAsTranslator')}</span>
              </button>
            </div>
            {validationErrors.userType && (
              <div className="field-error">{validationErrors.userType}</div>
            )}
          </div>
        )}

        {isLogin && (
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">{t('rememberMe')}</label>
            </div>
            <a href="/forgot-password" className="forgot-link">
              {t('forgotPassword')}
            </a>
          </div>
        )}

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? (
            <span className="loading-spinner"></span>
          ) : (
            <>
              {isLogin ? t('signIn') : t('createAccount')}
              <i className="submit-icon"></i>
            </>
          )}
        </button>
      </form>

      <div className="auth-switch">
        <p>
          {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setValidationErrors({});
            }}
            className="switch-mode-btn"
          >
            {isLogin ? t('signUp') : t('signIn')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SimpleAuthPage;
