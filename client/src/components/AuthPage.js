import React, { useState, useEffect } from 'react';
import './AuthPage.css';

const AuthPage = ({ onSuccess, currentLanguage, translations, onAuthenticated }) => {
  console.log('AuthPage rendered', { currentLanguage, translations });

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    userType: 'client'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const t = (key) => translations[currentLanguage][key];

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
            phone: formData.phone,
            userType: formData.userType
          };

      console.log('Sending request to:', endpoint, 'with data:', { ...requestData, password: '[REDACTED]' });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const contentType = response.headers.get('content-type');
      let data;

      try {
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          console.error('Received non-JSON response:', text);
          throw new Error('Server returned an invalid response format');
        }
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
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
    } catch (err) {
      console.error('Authentication error:', err);

      // Show user-friendly error message
      if (err.message.includes('Failed to fetch') || err.message === 'Failed to fetch') {
        setError('Could not connect to the server. Please try again later.');
      } else if (isLogin && err.message.includes('Invalid email or password')) {
        setError('Invalid email or password. Please try again.');
      } else if (!isLogin && err.message.includes('already registered as a')) {
        setError(err.message);
      } else if (err.message.includes('Error during registration process')) {
        setError('There was a problem creating your account. Please try again later.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if email exists when email field changes and we're in signup mode
  useEffect(() => {
    const checkEmailExists = async () => {
      if (!isLogin && formData.email && validateEmail(formData.email)) {
        setEmailChecking(true);
        try {
          // Use the check-email-type endpoint to check if email exists with the specific user type
          const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
          const response = await fetch(`${API_URL}/api/auth/check-email-type`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              userType: formData.userType
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setEmailExists(data.exists);

            if (data.exists) {
              // Email exists with the same user type
              setValidationErrors(prev => ({
                ...prev,
                email: `This email is already registered as a ${formData.userType}. Please use a different email or sign in.`
              }));
            } else if (data.conflictingType) {
              // Email exists but with a different user type
              setValidationErrors(prev => ({
                ...prev,
                email: `This email is already registered as a ${data.conflictingType}. Please use a different email for ${formData.userType} registration.`
              }));
            } else {
              // Email doesn't exist
              setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.email;
                return newErrors;
              });
            }
          }
        } catch (error) {
          console.error('Error checking email:', error);
        } finally {
          setEmailChecking(false);
        }
      } else {
        setEmailExists(false);
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    };

    const timeoutId = setTimeout(checkEmailExists, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email, formData.userType, isLogin]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Name validation for registration
    if (!isLogin && !formData.name.trim()) {
      errors.name = 'Full name is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleUserTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      userType: type
    }));
  };

  return (
    <div className="auth-modal">
      <h2>{isLogin ? t('welcomeBack') : t('createAccount')}</h2>
      <button className="close-auth-btn" onClick={() => window.history.back()}>×</button>
      
      <div className="auth-logo">
        <img src="/new-main-logo.svg" alt="LingoLink" />
        <span>LINGOLINK</span>
      </div>

      <div className="auth-header">
        <p>{isLogin ? t('signInSubtitle') : t('signUpSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">{t('fullName')}</label>
            <div className="input-container">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t('fullNamePlaceholder')}
                className={validationErrors.name ? 'error' : ''}
              />
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            {validationErrors.name && <span className="error-message">{validationErrors.name}</span>}
          </div>
        )}



        <div className="form-group">
          <label htmlFor="email">{t('emailAddress')}</label>
          <div className="input-container">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('emailPlaceholder')}
              className={validationErrors.email ? 'error' : ''}
            />
            <div className="input-icon">
              {emailChecking ? (
                <div className="loading-spinner"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
          {validationErrors.email && <span className="error-message">{validationErrors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">{t('password')}</label>
          <div className="input-container">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={t('passwordPlaceholder')}
              className={validationErrors.password ? 'error' : ''}
            />
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          {validationErrors.password && <span className="error-message">{validationErrors.password}</span>}
        </div>

        {!isLogin && (
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-container">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className={validationErrors.phone ? 'error' : ''}
              />
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59344 1.99522 8.06544 2.16708 8.43945 2.48353C8.81346 2.79999 9.06681 3.23945 9.15999 3.72C9.33657 4.68007 9.63248 5.61273 10.04 6.5C10.2 6.89 10.16 7.33 9.93999 7.69L8.51999 9.11C9.85388 11.6135 11.8864 13.6459 14.39 14.98L15.81 13.56C16.17 13.34 16.61 13.3 17 13.46C17.8873 13.8675 18.8199 14.1634 19.78 14.34C20.2658 14.4336 20.7093 14.6904 21.0265 15.069C21.3436 15.4476 21.5143 15.9251 21.51 16.41L22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            {validationErrors.phone && <span className="error-message">{validationErrors.phone}</span>}
          </div>
        )}

        {!isLogin && (
          <div className="form-group">
            <label>{t('iWantTo')}</label>
            <div className="user-type-selector">
              <button
                type="button"
                className={`user-type-btn ${formData.userType === 'client' ? 'active' : ''}`}
                onClick={() => handleUserTypeChange('client')}
              >
                <div className="user-type-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="17,11 19,13 23,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>{t('hireTranslators')}</span>
              </button>
              <button
                type="button"
                className={`user-type-btn ${formData.userType === 'translator' ? 'active' : ''}`}
                onClick={() => handleUserTypeChange('translator')}
              >
                <div className="user-type-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.013 6.175L7.006 9.369L12.013 12.564L17.02 9.369L12.013 6.175Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.006 9.369V14.926C7.006 15.329 7.006 15.531 7.084 15.695C7.152 15.84 7.264 15.96 7.404 16.037C7.563 16.124 7.773 16.124 8.193 16.124H15.833C16.253 16.124 16.463 16.124 16.622 16.037C16.762 15.96 16.874 15.84 16.942 15.695C17.02 15.531 17.02 15.329 17.02 14.926V9.369" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>{t('workAsTranslator')}</span>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message global-error">
            {error}
          </div>
        )}

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            isLogin ? t('signIn') : t('signUp')
          )}
        </button>

        <div className="auth-footer">
          <p>
            {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
            <button
              type="button"
              className="auth-switch-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setValidationErrors({});
                setFormData({
                  email: '',
                  password: '',
                  name: '',
                  phone: '',
                  userType: 'client'
                });
              }}
            >
              {isLogin ? t('signUp') : t('signIn')}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
