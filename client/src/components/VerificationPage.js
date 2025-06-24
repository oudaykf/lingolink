import React, { useState, useEffect } from 'react';
import './VerificationPage.css';

const VerificationPage = ({ user }) => {
  const [verificationStatus, setVerificationStatus] = useState({
    emailVerified: false,
    phoneVerified: false,
    hasPhone: false,
    identityVerified: false,
    faceVerified: false,
    status: 'pending',
    lastUpdated: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState('email');
  const [showVerificationButton, setShowVerificationButton] = useState(true);

  // Email verification
  const [emailCode, setEmailCode] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Phone verification
  const [phone, setPhone] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneSaving, setPhoneSaving] = useState(false);
  const [phoneSending, setPhoneSending] = useState(false);
  const [phoneVerifying, setPhoneVerifying] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneSent, setPhoneSent] = useState(false);

  // Identity verification
  const [identityData, setIdentityData] = useState({
    documentType: 'passport',
    documentNumber: '',
    documentExpiry: '',
    documentCountry: '',
    documentImage: null,
    documentImageUrl: '',
    birthdate: ''
  });
  const [identitySubmitting, setIdentitySubmitting] = useState(false);
  const [identityError, setIdentityError] = useState('');

  // Face verification
  const [faceImage, setFaceImage] = useState(null);
  const [faceImageUrl, setFaceImageUrl] = useState('');
  const [faceSubmitting, setFaceSubmitting] = useState(false);
  const [faceError, setFaceError] = useState('');

  // Add camera modal state
  const [showCamera, setShowCamera] = useState(false);
  const [cameraFor, setCameraFor] = useState(''); // 'face' or 'identity'
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  // Fetch verification status on component mount
  useEffect(() => {
    fetchVerificationStatus();
    // Check verification status periodically
    const interval = setInterval(fetchVerificationStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch verification status from the server
  const fetchVerificationStatus = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/verification/status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setError('Your session has expired. Please log in again.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
          return;
        }
        throw new Error('Failed to fetch verification status');
      }

      const data = await response.json();
      setVerificationStatus(data);

      // Hide verification button if fully verified
      if (data.emailVerified && data.phoneVerified && data.identityVerified && data.faceVerified) {
        setShowVerificationButton(false);
      }

      // Set active step based on verification status
      if (!data.emailVerified) {
        setActiveStep('email');
      } else if (!data.phoneVerified && data.hasPhone) {
        setActiveStep('phone');
      } else if (!data.identityVerified) {
        setActiveStep('identity');
      } else if (!data.faceVerified) {
        setActiveStep('face');
      } else {
        setActiveStep('complete');
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
      setError('Failed to fetch verification status. Please try again or log out and log back in.');
    } finally {
      setLoading(false);
    }
  };

  // Send email verification code
  const sendEmailCode = async () => {
    try {
      setEmailSending(true);
      setEmailError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setEmailError('Authentication required');
        return;
      }

      const response = await fetch('/api/verification/send-email-code', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      setEmailSent(true);

      // For demo purposes, auto-fill the code
      if (data.code) {
        setEmailCode(data.code);
      }
    } catch (error) {
      console.error('Error sending email verification code:', error);
      setEmailError(error.message || 'Failed to send verification code');
    } finally {
      setEmailSending(false);
    }
  };

  // Verify email with code
  const verifyEmail = async (e) => {
    e.preventDefault();

    try {
      setEmailVerifying(true);
      setEmailError('');

      if (!emailCode) {
        setEmailError('Please enter the verification code');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setEmailError('Authentication required');
        return;
      }

      const response = await fetch('/api/verification/verify-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: emailCode })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify email');
      }

      // Update verification status
      await fetchVerificationStatus();

      // Move to next step
      if (verificationStatus.hasPhone) {
        setActiveStep('phone');
      } else {
        setActiveStep('identity');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      setEmailError(error.message || 'Failed to verify email');
    } finally {
      setEmailVerifying(false);
    }
  };

  // Save phone number
  const savePhone = async (e) => {
    e.preventDefault();

    try {
      setPhoneSaving(true);
      setPhoneError('');

      if (!phone) {
        setPhoneError('Please enter your phone number');
        return;
      }

      // Validate phone number
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(phone)) {
        setPhoneError('Please enter a valid phone number');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setPhoneError('Authentication required');
        return;
      }

      const response = await fetch('/api/users/update-phone', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save phone number');
      }

      // Update verification status
      await fetchVerificationStatus();

      // Automatically send verification code
      sendPhoneCode();
    } catch (error) {
      console.error('Error saving phone number:', error);
      setPhoneError(error.message || 'Failed to save phone number');
    } finally {
      setPhoneSaving(false);
    }
  };

  // Send phone verification code
  const sendPhoneCode = async () => {
    try {
      setPhoneSending(true);
      setPhoneError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setPhoneError('Authentication required');
        return;
      }

      const response = await fetch('/api/verification/send-phone-code', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      setPhoneSent(true);

      // For demo purposes, auto-fill the code
      if (data.code) {
        setPhoneCode(data.code);
      }
    } catch (error) {
      console.error('Error sending phone verification code:', error);
      setPhoneError(error.message || 'Failed to send verification code');
    } finally {
      setPhoneSending(false);
    }
  };

  // Verify phone with code
  const verifyPhone = async (e) => {
    e.preventDefault();

    try {
      setPhoneVerifying(true);
      setPhoneError('');

      if (!phoneCode) {
        setPhoneError('Please enter the verification code');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setPhoneError('Authentication required');
        return;
      }

      const response = await fetch('/api/verification/verify-phone', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: phoneCode })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify phone');
      }

      // Update verification status
      await fetchVerificationStatus();

      // Move to next step
      setActiveStep('identity');
    } catch (error) {
      console.error('Error verifying phone:', error);
      setPhoneError(error.message || 'Failed to verify phone');
    } finally {
      setPhoneVerifying(false);
    }
  };

  // Handle identity document image upload
  const handleDocumentImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIdentityData({
        ...identityData,
        documentImage: file,
        documentImageUrl: URL.createObjectURL(file)
      });
    }
  };

  // Submit identity verification
  const submitIdentityVerification = async (e) => {
    e.preventDefault();

    try {
      setIdentitySubmitting(true);
      setIdentityError('');

      // Validate required fields
      if (!identityData.documentType || !identityData.documentNumber ||
          !identityData.documentExpiry || !identityData.documentCountry ||
          !identityData.documentImageUrl) {
        setIdentityError('All fields are required');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setIdentityError('Authentication required');
        return;
      }

      // In a real application, you would upload the image to a storage service
      // and get a URL. For this demo, we'll use the local URL.

      const response = await fetch('/api/verification/submit-identity', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentType: identityData.documentType,
          documentNumber: identityData.documentNumber,
          documentExpiry: identityData.documentExpiry,
          documentCountry: identityData.documentCountry,
          documentImageUrl: identityData.documentImageUrl,
          birthdate: identityData.birthdate
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit identity verification');
      }

      // Update verification status
      await fetchVerificationStatus();

      // Move to next step
      setActiveStep('face');
    } catch (error) {
      console.error('Error submitting identity verification:', error);
      setIdentityError(error.message || 'Failed to submit identity verification');
    } finally {
      setIdentitySubmitting(false);
    }
  };

  // Handle face image upload
  const handleFaceImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFaceImage(file);
      setFaceImageUrl(URL.createObjectURL(file));
    }
  };

  // Submit face verification with liveness detection
  const submitFaceVerification = async (e) => {
    e.preventDefault();

    try {
      setFaceSubmitting(true);
      setFaceError('');

      if (!faceImageUrl) {
        setFaceError('Please upload a photo of your face');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setFaceError('Authentication required');
        return;
      }

      // Create a video stream for liveness detection
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });

      // Create video element for liveness check
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      // Capture frames for liveness detection
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');

      // Capture multiple frames
      const frames = [];
      for (let i = 0; i < 3; i++) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL('image/jpeg'));
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Stop the video stream
      stream.getTracks().forEach(track => track.stop());

      const response = await fetch('/api/verification/submit-face', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          faceImageUrl: faceImageUrl,
          livenessFrames: frames
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit face verification');
      }

      // Update verification status
      await fetchVerificationStatus();

      // Move to next step
      setActiveStep('processing');

      // Poll for verification status updates
      const intervalId = setInterval(async () => {
        await fetchVerificationStatus();

        if (verificationStatus.identityVerified && verificationStatus.faceVerified) {
          clearInterval(intervalId);
          setActiveStep('complete');
          setShowVerificationButton(false);
        } else if (verificationStatus.status === 'rejected') {
          clearInterval(intervalId);
          setActiveStep('rejected');
        }
      }, 3000);

      // Clear interval after 30 seconds
      setTimeout(() => {
        clearInterval(intervalId);
      }, 30000);
    } catch (error) {
      console.error('Error submitting face verification:', error);
      setFaceError(error.message || 'Failed to submit face verification');
    } finally {
      setFaceSubmitting(false);
    }
  };

  // Open camera modal
  const openCamera = async (forType) => {
    setCameraFor(forType);
    setCameraError('');
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
    } catch (err) {
      setCameraError('Unable to access camera. Please allow camera access.');
    }
  };

  // Close camera modal
  const closeCamera = () => {
    setShowCamera(false);
    setCameraFor('');
    setCameraError('');
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      if (cameraFor === 'face') {
        setFaceImageUrl(dataUrl);
        setFaceImage(null);
      } else if (cameraFor === 'identity') {
        setIdentityData({ ...identityData, documentImageUrl: dataUrl, documentImage: null });
      }
      closeCamera();
    }
  };

  // Render verification steps
  const renderVerificationStep = () => {
    switch (activeStep) {
      case 'email':
        return (
          <div className="verification-step">
            <h3>Email Verification</h3>
            <p>We need to verify your email address. Click the button below to receive a verification code.</p>

            {!emailSent ? (
              <button
                className="verification-button"
                onClick={sendEmailCode}
                disabled={emailSending}
              >
                {emailSending ? 'Sending...' : 'Send Verification Code'}
              </button>
            ) : (
              <form onSubmit={verifyEmail} className="verification-form">
                <div className="form-group">
                  <label>Enter the verification code sent to your email:</label>
                  <input
                    type="text"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    disabled={emailVerifying}
                  />
                </div>

                {emailError && <div className="verification-error">{emailError}</div>}

                <button
                  type="submit"
                  className="verification-button"
                  disabled={emailVerifying}
                >
                  {emailVerifying ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>
            )}
          </div>
        );

      case 'phone':
        return (
          <div className="verification-step">
            <h3>Phone Verification</h3>

            {!verificationStatus.hasPhone ? (
              <div>
                <p>Please add your phone number for verification.</p>

                <form onSubmit={savePhone} className="verification-form">
                  <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (123) 456-7890"
                      disabled={phoneSaving}
                    />
                  </div>

                  {phoneError && <div className="verification-error">{phoneError}</div>}

                  <button
                    type="submit"
                    className="verification-button"
                    disabled={phoneSaving}
                  >
                    {phoneSaving ? 'Saving...' : 'Save Phone Number'}
                  </button>
                </form>
              </div>
            ) : !phoneSent ? (
              <div>
                <p>We need to verify your phone number. Click the button below to receive a verification code via SMS.</p>

                <button
                  className="verification-button"
                  onClick={sendPhoneCode}
                  disabled={phoneSending}
                >
                  {phoneSending ? 'Sending...' : 'Send Verification Code'}
                </button>
              </div>
            ) : (
              <form onSubmit={verifyPhone} className="verification-form">
                <div className="form-group">
                  <label>Enter the verification code sent to your phone:</label>
                  <input
                    type="text"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    disabled={phoneVerifying}
                  />
                </div>

                {phoneError && <div className="verification-error">{phoneError}</div>}

                <button
                  type="submit"
                  className="verification-button"
                  disabled={phoneVerifying}
                >
                  {phoneVerifying ? 'Verifying...' : 'Verify Phone'}
                </button>
              </form>
            )}
          </div>
        );

      case 'identity':
        return (
          <div className="verification-step">
            <h3>Identity Verification</h3>
            <p>Please provide your identity document information for verification.</p>

            <form onSubmit={submitIdentityVerification} className="verification-form">
              <div className="form-group">
                <label>Document Type:</label>
                <select
                  value={identityData.documentType}
                  onChange={(e) => setIdentityData({...identityData, documentType: e.target.value})}
                  disabled={identitySubmitting}
                >
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID</option>
                  <option value="drivers_license">Driver's License</option>
                </select>
              </div>

              <div className="form-group">
                <label>Document Number:</label>
                <input
                  type="text"
                  value={identityData.documentNumber}
                  onChange={(e) => setIdentityData({...identityData, documentNumber: e.target.value})}
                  placeholder="Enter document number"
                  disabled={identitySubmitting}
                />
              </div>

              <div className="form-group">
                <label>Expiry Date:</label>
                <input
                  type="date"
                  value={identityData.documentExpiry}
                  onChange={(e) => setIdentityData({...identityData, documentExpiry: e.target.value})}
                  disabled={identitySubmitting}
                />
              </div>

              <div className="form-group">
                <label>Country of Issue:</label>
                <input
                  type="text"
                  value={identityData.documentCountry}
                  onChange={(e) => setIdentityData({...identityData, documentCountry: e.target.value})}
                  placeholder="Enter country"
                  disabled={identitySubmitting}
                />
              </div>

              <div className="form-group">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  value={identityData.birthdate}
                  onChange={(e) => setIdentityData({...identityData, birthdate: e.target.value})}
                  disabled={identitySubmitting}
                />
              </div>

              <div className="form-group">
                <label>Upload Document Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDocumentImageChange}
                  disabled={identitySubmitting}
                />
                <button type="button" className="verification-button" onClick={() => openCamera('identity')} disabled={identitySubmitting}>
                  Take Photo
                </button>
                {identityData.documentImageUrl && (
                  <div className="image-preview">
                    <img src={identityData.documentImageUrl} alt="Document Preview" />
                  </div>
                )}
              </div>

              {identityError && <div className="verification-error">{identityError}</div>}

              <button
                type="submit"
                className="verification-button"
                disabled={identitySubmitting}
              >
                {identitySubmitting ? 'Submitting...' : 'Submit Identity Verification'}
              </button>
            </form>
          </div>
        );

      case 'face':
        return (
          <div className="verification-step">
            <h3>Face Verification</h3>
            <p>Please upload a clear photo of your face for verification.</p>

            <form onSubmit={submitFaceVerification} className="verification-form">
              <div className="form-group">
                <label>Upload Face Photo:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFaceImageChange}
                  disabled={faceSubmitting}
                />
                <button type="button" className="verification-button" onClick={() => openCamera('face')} disabled={faceSubmitting}>
                  Take Photo
                </button>
                {faceImageUrl && (
                  <div className="image-preview">
                    <img src={faceImageUrl} alt="Face Preview" />
                  </div>
                )}
              </div>

              {faceError && <div className="verification-error">{faceError}</div>}

              <button
                type="submit"
                className="verification-button"
                disabled={faceSubmitting}
              >
                {faceSubmitting ? 'Submitting...' : 'Submit Face Verification'}
              </button>
            </form>
          </div>
        );

      case 'processing':
        return (
          <div className="verification-step">
            <h3>Verification in Progress</h3>
            <p>We are processing your verification. This may take a few moments.</p>

            <div className="verification-progress">
              <div className="spinner"></div>
              <p>Please wait while we verify your information...</p>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="verification-step">
            <h3>Verification Complete</h3>
            <p>Congratulations! Your identity has been verified successfully.</p>

            <div className="verification-success">
              <div className="success-icon">✓</div>
              <p>You now have full access to all features of the platform.</p>
            </div>

            <button
              className="verification-button"
              onClick={() => window.location.href = '/dashboard'}
            >
              Go to Dashboard
            </button>
          </div>
        );

      case 'rejected':
        return (
          <div className="verification-step">
            <h3>Verification Failed</h3>
            <p>Unfortunately, we couldn't verify your identity. Please try again with clearer documents.</p>

            <div className="verification-failed">
              <div className="failed-icon">✗</div>
              <p>Reason: {verificationStatus.verificationNotes || 'Verification could not be completed'}</p>
            </div>

            <button
              className="verification-button"
              onClick={() => {
                setActiveStep('identity');
                setIdentityData({
                  ...identityData,
                  documentImage: null,
                  documentImageUrl: ''
                });
                setFaceImage(null);
                setFaceImageUrl('');
              }}
            >
              Try Again
            </button>
          </div>
        );

      default:
        return (
          <div className="verification-step">
            <h3>Loading Verification Status</h3>
            <p>Please wait while we load your verification status...</p>
          </div>
        );
    }
  };

  // Render verification progress
  const renderVerificationProgress = () => {
    const steps = [
      { id: 'email', label: 'Email', completed: verificationStatus.emailVerified },
      { id: 'phone', label: 'Phone', completed: !verificationStatus.hasPhone || verificationStatus.phoneVerified },
      { id: 'identity', label: 'Identity', completed: verificationStatus.identityVerified },
      { id: 'face', label: 'Face', completed: verificationStatus.faceVerified }
    ];

    return (
      <div className="verification-progress-bar">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`progress-step ${step.completed ? 'completed' : ''} ${activeStep === step.id ? 'active' : ''}`}
            onClick={() => {
              // Only allow navigation to completed steps or the current active step
              if (step.completed || steps.slice(0, index).every(s => s.completed)) {
                setActiveStep(step.id);
              }
            }}
          >
            <div className="step-indicator">
              {step.completed ? '✓' : index + 1}
            </div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="verification-container">
      <div className="verification-header">
        <div className="verification-header-content">
          <h2>Identity Verification</h2>
          <p className="verification-subtitle">Complete verification to unlock all features and ensure account security</p>
        </div>
        <div className="verification-security-badge">
          <div className="security-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div className="security-text">
            <span>Bank-Level Security</span>
            <small>Your data is encrypted and secure</small>
          </div>
        </div>
      </div>

      {showVerificationButton && (
        <div className="verification-status-indicator">
          <div className="status-item">
            <span className="status-label">Email:</span>
            <span className={`status-value ${verificationStatus.emailVerified ? 'verified' : 'pending'}`}>
              {verificationStatus.emailVerified ? 'Verified' : 'Pending'}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Phone:</span>
            <span className={`status-value ${verificationStatus.phoneVerified ? 'verified' : 'pending'}`}>
              {verificationStatus.phoneVerified ? 'Verified' : 'Pending'}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Identity:</span>
            <span className={`status-value ${verificationStatus.identityVerified ? 'verified' : 'pending'}`}>
              {verificationStatus.identityVerified ? 'Verified' : 'Pending'}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Face:</span>
            <span className={`status-value ${verificationStatus.faceVerified ? 'verified' : 'pending'}`}>
              {verificationStatus.faceVerified ? 'Verified' : 'Pending'}
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="verification-loading">
          <div className="spinner"></div>
          <p>Loading verification status...</p>
        </div>
      ) : error ? (
        <div className="verification-error-container">
          <div className="error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3>Verification Error</h3>
          <p>{error}</p>
          {error.includes('session has expired') ? (
            <p className="redirect-message">Redirecting to login page...</p>
          ) : (
            <div className="error-actions">
              <button
                className="verification-button"
                onClick={fetchVerificationStatus}
              >
                Retry
              </button>
              <button
                className="verification-button secondary"
                onClick={() => window.location.href = '/dashboard'}
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="verification-content">
          <div className="verification-benefits">
            <div className="benefit-item">
              <div className="benefit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div className="benefit-text">
                <h4>Enhanced Security</h4>
                <p>Protect your account from unauthorized access</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="benefit-text">
                <h4>Higher Limits</h4>
                <p>Unlock higher transaction limits</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="benefit-text">
                <h4>Full Access</h4>
                <p>Access all platform features and services</p>
              </div>
            </div>
          </div>

          {renderVerificationProgress()}
          {renderVerificationStep()}
        </div>
      )}

      {showCamera && (
        <div className="camera-modal">
          <div className="camera-modal-content">
            <h3>Take a Photo</h3>
            {cameraError && <div className="verification-error">{cameraError}</div>}
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: 400 }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button className="verification-button" onClick={capturePhoto}>Capture</button>
              <button className="verification-button secondary" onClick={closeCamera}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
