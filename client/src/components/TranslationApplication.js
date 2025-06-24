import React, { useState, useEffect } from 'react';
import './TranslationApplication.css';

const TranslationApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    sourceLanguage: '',
    targetLanguage: '',
    documentType: 'general',
    file: null,
    pages: 1,
    pricePerPage: 15,
    deliveryTime: 'standard',
    additionalServices: {
      proofreading: false,
      formatting: false,
      certified: false
    },
    description: '',
    specialInstructions: '',
    status: 'draft',
    translator: null,
    translatorNotes: '',
    confirmationDate: null
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [availableTranslators, setAvailableTranslators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch available translators when component mounts
    fetchAvailableTranslators();
  }, []);

  const fetchAvailableTranslators = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      const response = await fetch('/api/translators');
      const data = await response.json();
      setAvailableTranslators(data);
    } catch (err) {
      setError('Failed to fetch translators. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const calculatePrice = () => {
    const basePrice = formData.pages * formData.pricePerPage;
    let totalPrice = basePrice;

    // Delivery time markup
    if (formData.deliveryTime === 'express') totalPrice *= 1.15;
    if (formData.deliveryTime === 'urgent') totalPrice *= 1.3;

    // Additional services markup
    if (formData.additionalServices.proofreading) totalPrice *= 1.1;
    if (formData.additionalServices.formatting) totalPrice *= 1.08;
    if (formData.additionalServices.certified) totalPrice *= 1.2;

    setEstimatedPrice(totalPrice.toFixed(2));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 2) calculatePrice();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Replace with actual API call
      const response = await fetch('/api/translation-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'pending',
          estimatedPrice,
          submissionDate: new Date().toISOString()
        }),
      });

      if (!response.ok) throw new Error('Failed to submit request');

      setSuccess(true);
      setFormData(prev => ({ ...prev, status: 'pending' }));
      setCurrentStep(5); // Move to confirmation step
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslatorSelect = (translatorId) => {
    setFormData(prev => ({
      ...prev,
      translator: translatorId,
      status: 'assigned'
    }));
  };

  const handleTranslatorConfirmation = async (confirmed) => {
    try {
      setLoading(true);
      // Replace with actual API call
      const response = await fetch(`/api/translation-requests/${formData.id}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmed,
          translatorNotes: formData.translatorNotes
        }),
      });

      if (!response.ok) throw new Error('Failed to update request status');

      setFormData(prev => ({
        ...prev,
        status: confirmed ? 'confirmed' : 'rejected',
        confirmationDate: new Date().toISOString()
      }));
    } catch (err) {
      setError('Failed to update request status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndicator = () => {
    switch (formData.status) {
      case 'pending':
        return <span className="status-indicator status-pending">Pending</span>;
      case 'assigned':
        return <span className="status-indicator status-pending">Assigned</span>;
      case 'confirmed':
        return <span className="status-indicator status-confirmed">Confirmed</span>;
      case 'rejected':
        return <span className="status-indicator status-rejected">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="translation-application">
      <div className="application-header">
        <h1>Request a Translation</h1>
        <p>Fill out the form below to get started with your translation project</p>
        {formData.status !== 'draft' && getStatusIndicator()}
      </div>

      <div className="progress-bar">
        <div className="progress-step" data-active={currentStep >= 1}>
          <div className="step-number">1</div>
          <div className="step-label">Project Details</div>
        </div>
        <div className="progress-step" data-active={currentStep >= 2}>
          <div className="step-number">2</div>
          <div className="step-label">File & Pages</div>
        </div>
        <div className="progress-step" data-active={currentStep >= 3}>
          <div className="step-number">3</div>
          <div className="step-label">Services & Price</div>
        </div>
        <div className="progress-step" data-active={currentStep >= 4}>
          <div className="step-number">4</div>
          <div className="step-label">Review & Submit</div>
        </div>
        <div className="progress-step" data-active={currentStep >= 5}>
          <div className="step-number">5</div>
          <div className="step-label">Confirmation</div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Processing your request...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="application-form">
        {currentStep === 1 && (
          <div className="form-step">
            <h2>Project Details</h2>
            <div className="form-group">
              <label>Source Language</label>
              <select
                value={formData.sourceLanguage}
                onChange={(e) => setFormData({ ...formData, sourceLanguage: e.target.value })}
                required
              >
                <option value="">Select source language</option>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="ar">Arabic</option>
                <option value="de">German</option>
              </select>
            </div>

            <div className="form-group">
              <label>Target Language</label>
              <select
                value={formData.targetLanguage}
                onChange={(e) => setFormData({ ...formData, targetLanguage: e.target.value })}
                required
              >
                <option value="">Select target language</option>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="ar">Arabic</option>
                <option value="de">German</option>
              </select>
            </div>

            <div className="form-group">
              <label>Document Type</label>
              <select
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
              >
                <option value="general">General</option>
                <option value="legal">Legal</option>
                <option value="medical">Medical</option>
                <option value="technical">Technical</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>

            <div className="form-group">
              <label>Project Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your translation project..."
                rows="4"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step">
            <h2>File & Pages</h2>
            <div className="file-upload-container">
              <div className="file-upload-box">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <div className="upload-icon">📄</div>
                  <div className="upload-text">
                    {formData.file ? formData.file.name : 'Drag & drop your file here or click to browse'}
                  </div>
                  <div className="upload-hint">Supported formats: PDF, DOC, DOCX, TXT</div>
                </label>
              </div>
              {previewUrl && (
                <div className="file-preview">
                  <iframe src={previewUrl} title="File preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Number of Pages</label>
              <input
                type="number"
                min="1"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label>Price per Page (TND)</label>
              <input
                type="number"
                min="15"
                value={formData.pricePerPage}
                onChange={(e) => setFormData({ ...formData, pricePerPage: parseFloat(e.target.value) })}
                required
              />
              <small>Minimum price per page is 15 TND</small>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step">
            <h2>Services & Price</h2>
            <div className="form-group">
              <label>Delivery Time</label>
              <select
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
              >
                <option value="standard">Standard (3-5 days)</option>
                <option value="express">Express (1-2 days, +15%)</option>
                <option value="urgent">Urgent (24 hours, +30%)</option>
              </select>
            </div>

            <div className="additional-services">
              <h3>Additional Services</h3>
              <div className="service-option">
                <input
                  type="checkbox"
                  id="proofreading"
                  checked={formData.additionalServices.proofreading}
                  onChange={(e) => setFormData({
                    ...formData,
                    additionalServices: {
                      ...formData.additionalServices,
                      proofreading: e.target.checked
                    }
                  })}
                />
                <label htmlFor="proofreading">
                  <span className="service-name">Proofreading by second translator</span>
                  <span className="service-price">+10%</span>
                </label>
              </div>

              <div className="service-option">
                <input
                  type="checkbox"
                  id="formatting"
                  checked={formData.additionalServices.formatting}
                  onChange={(e) => setFormData({
                    ...formData,
                    additionalServices: {
                      ...formData.additionalServices,
                      formatting: e.target.checked
                    }
                  })}
                />
                <label htmlFor="formatting">
                  <span className="service-name">Formatting and layout matching</span>
                  <span className="service-price">+8%</span>
                </label>
              </div>

              <div className="service-option">
                <input
                  type="checkbox"
                  id="certified"
                  checked={formData.additionalServices.certified}
                  onChange={(e) => setFormData({
                    ...formData,
                    additionalServices: {
                      ...formData.additionalServices,
                      certified: e.target.checked
                    }
                  })}
                />
                <label htmlFor="certified">
                  <span className="service-name">Certified translation</span>
                  <span className="service-price">+20%</span>
                </label>
              </div>
            </div>

            <div className="price-summary">
              <h3>Price Summary</h3>
              <div className="price-breakdown">
                <div className="price-item">
                  <span>Base price ({formData.pages} pages × {formData.pricePerPage} TND)</span>
                  <span>{(formData.pages * formData.pricePerPage).toFixed(2)} TND</span>
                </div>
                {formData.deliveryTime !== 'standard' && (
                  <div className="price-item">
                    <span>Delivery markup ({formData.deliveryTime === 'express' ? '15%' : '30%'})</span>
                    <span>{(formData.pages * formData.pricePerPage * (formData.deliveryTime === 'express' ? 0.15 : 0.3)).toFixed(2)} TND</span>
                  </div>
                )}
                {formData.additionalServices.proofreading && (
                  <div className="price-item">
                    <span>Proofreading (10%)</span>
                    <span>{(formData.pages * formData.pricePerPage * 0.1).toFixed(2)} TND</span>
                  </div>
                )}
                {formData.additionalServices.formatting && (
                  <div className="price-item">
                    <span>Formatting (8%)</span>
                    <span>{(formData.pages * formData.pricePerPage * 0.08).toFixed(2)} TND</span>
                  </div>
                )}
                {formData.additionalServices.certified && (
                  <div className="price-item">
                    <span>Certification (20%)</span>
                    <span>{(formData.pages * formData.pricePerPage * 0.2).toFixed(2)} TND</span>
                  </div>
                )}
                <div className="price-total">
                  <span>Total Price</span>
                  <span>{estimatedPrice} TND</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="form-step">
            <h2>Review & Submit</h2>
            <div className="review-summary">
              <div className="review-section">
                <h3>Project Details</h3>
                <div className="review-item">
                  <span>Source Language:</span>
                  <span>{formData.sourceLanguage.toUpperCase()}</span>
                </div>
                <div className="review-item">
                  <span>Target Language:</span>
                  <span>{formData.targetLanguage.toUpperCase()}</span>
                </div>
                <div className="review-item">
                  <span>Document Type:</span>
                  <span>{formData.documentType}</span>
                </div>
                <div className="review-item">
                  <span>Description:</span>
                  <span>{formData.description}</span>
                </div>
              </div>

              <div className="review-section">
                <h3>File & Pages</h3>
                <div className="review-item">
                  <span>File:</span>
                  <span>{formData.file ? formData.file.name : 'No file uploaded'}</span>
                </div>
                <div className="review-item">
                  <span>Pages:</span>
                  <span>{formData.pages}</span>
                </div>
                <div className="review-item">
                  <span>Price per Page:</span>
                  <span>{formData.pricePerPage} TND</span>
                </div>
              </div>

              <div className="review-section">
                <h3>Services</h3>
                <div className="review-item">
                  <span>Delivery Time:</span>
                  <span>{formData.deliveryTime}</span>
                </div>
                <div className="review-item">
                  <span>Additional Services:</span>
                  <span>
                    {Object.entries(formData.additionalServices)
                      .filter(([_, value]) => value)
                      .map(([key]) => key)
                      .join(', ') || 'None'}
                  </span>
                </div>
              </div>

              <div className="review-section">
                <h3>Final Price</h3>
                <div className="price-total">
                  <span>Total:</span>
                  <span>{estimatedPrice} TND</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Special Instructions (Optional)</label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                placeholder="Add any special instructions for the translator..."
                rows="4"
              />
            </div>
          </div>
        )}

        {currentStep === 5 && success && (
          <div className="confirmation-success animated-confirmation">
            <div className="confirmation-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="38" stroke="#2ecc71" strokeWidth="4" fill="rgba(46,204,113,0.1)"/>
                <path d="M25 42L37 54L56 31" stroke="#2ecc71" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Thank you for your request!</h2>
            <p>Your translation request has been submitted successfully.<br />
              We will notify you as soon as a translator is assigned.
            </p>
            <div className="confirmation-actions">
              <button className="btn-primary" type="button" onClick={() => setCurrentStep(1)}>
                Start New Request
              </button>
              <button className="btn-secondary" type="button" onClick={() => window.location.href = '/track-requests'}>
                Track My Requests
              </button>
            </div>
          </div>
        )}

        <div className="form-navigation">
          {currentStep > 1 && currentStep < 5 && (
            <button type="button" className="btn-secondary" onClick={handleBack}>
              Back
            </button>
          )}
          {currentStep < 4 ? (
            <button type="button" className="btn-primary" onClick={handleNext}>
              Next
            </button>
          ) : currentStep === 4 ? (
            <button type="submit" className="btn-primary" disabled={loading}>
              Submit Request
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default TranslationApplication; 