import React, { useState, useEffect } from 'react';
import './ProfileCustomizationPopup.css';

const ProfileCustomizationPopup = ({ isVisible, onComplete, onSave, userType, initialData = {} }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Info
    fullName: initialData.fullName || '',
    bio: initialData.bio || '',
    location: initialData.location || '',
    phone: initialData.phone || '',
    profileImage: initialData.profileImage || null,
    
    // Translator specific
    languages: initialData.languages || [],
    specializations: initialData.specializations || [],
    yearsOfExperience: initialData.yearsOfExperience || '',
    hourlyRate: initialData.hourlyRate || '',
    certifications: initialData.certifications || '',
    
    // Client specific
    companyName: initialData.companyName || '',
    industry: initialData.industry || '',
    projectTypes: initialData.projectTypes || [],
    
    // Preferences
    notifications: {
      email: initialData.notifications?.email ?? true,
      browser: initialData.notifications?.browser ?? true,
      sms: initialData.notifications?.sms ?? false
    },
    privacy: {
      showEmail: initialData.privacy?.showEmail ?? false,
      showPhone: initialData.privacy?.showPhone ?? false,
      profileVisibility: initialData.privacy?.profileVisibility || 'public'
    }
  });

  const [isLoading, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const availableLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi'
  ];

  const availableSpecializations = [
    'Technical Translation', 'Legal Documents', 'Medical Translation',
    'Business Communication', 'Marketing Content', 'Academic Papers',
    'Literary Translation', 'Website Localization', 'Software Localization'
  ];

  const availableIndustries = [
    'Technology', 'Healthcare', 'Finance', 'Legal', 'Education',
    'Manufacturing', 'Retail', 'Media', 'Government', 'Non-profit'
  ];

  const steps = userType === 'translator' ? [
    {
      title: "Basic Information",
      subtitle: "Tell us about yourself",
      fields: ['fullName', 'bio', 'location', 'phone']
    },
    {
      title: "Professional Details",
      subtitle: "Your expertise and experience",
      fields: ['languages', 'specializations', 'yearsOfExperience', 'hourlyRate', 'certifications']
    },
    {
      title: "Preferences & Privacy",
      subtitle: "Customize your experience",
      fields: ['notifications', 'privacy']
    }
  ] : [
    {
      title: "Basic Information",
      subtitle: "Tell us about yourself",
      fields: ['fullName', 'bio', 'location', 'phone']
    },
    {
      title: "Business Details",
      subtitle: "Your company and projects",
      fields: ['companyName', 'industry', 'projectTypes']
    },
    {
      title: "Preferences & Privacy",
      subtitle: "Customize your experience",
      fields: ['notifications', 'privacy']
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field, value, isAdd = true) => {
    setFormData(prev => ({
      ...prev,
      [field]: isAdd 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const validateStep = (stepIndex) => {
    const stepFields = steps[stepIndex].fields;
    const stepErrors = {};

    stepFields.forEach(field => {
      if (field === 'fullName' && !formData.fullName.trim()) {
        stepErrors.fullName = 'Full name is required';
      }
      if (field === 'languages' && userType === 'translator' && formData.languages.length === 0) {
        stepErrors.languages = 'Please select at least one language';
      }
      if (field === 'specializations' && userType === 'translator' && formData.specializations.length === 0) {
        stepErrors.specializations = 'Please select at least one specialization';
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSave();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData);
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ general: 'Failed to save profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('profileImage', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="profile-customization-overlay">
      <div className="profile-customization-popup">
        <div className="customization-header">
          <div className="customization-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
            <span className="progress-text">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
        </div>

        <div className="customization-content">
          <div className="step-header">
            <h2 className="step-title">{currentStepData.title}</h2>
            <p className="step-subtitle">{currentStepData.subtitle}</p>
          </div>

          <div className="step-form">
            {currentStep === 0 && (
              <div className="form-section">
                <div className="profile-image-upload">
                  <div className="image-preview">
                    {formData.profileImage ? (
                      <img src={formData.profileImage} alt="Profile" />
                    ) : (
                      <div className="image-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="profileImage" className="upload-btn">
                    Upload Photo
                  </label>
                </div>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && userType === 'translator' && (
              <div className="form-section">
                <div className="form-group">
                  <label>Languages *</label>
                  <div className="checkbox-grid">
                    {availableLanguages.map(lang => (
                      <label key={lang} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(lang)}
                          onChange={(e) => handleArrayChange('languages', lang, e.target.checked)}
                        />
                        <span>{lang}</span>
                      </label>
                    ))}
                  </div>
                  {errors.languages && <span className="error-text">{errors.languages}</span>}
                </div>

                <div className="form-group">
                  <label>Specializations *</label>
                  <div className="checkbox-grid">
                    {availableSpecializations.map(spec => (
                      <label key={spec} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={formData.specializations.includes(spec)}
                          onChange={(e) => handleArrayChange('specializations', spec, e.target.checked)}
                        />
                        <span>{spec}</span>
                      </label>
                    ))}
                  </div>
                  {errors.specializations && <span className="error-text">{errors.specializations}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Years of Experience</label>
                    <select
                      value={formData.yearsOfExperience}
                      onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="2-5">2-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Hourly Rate (USD)</label>
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                      placeholder="25"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Certifications</label>
                  <input
                    type="text"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange('certifications', e.target.value)}
                    placeholder="e.g., ATA Certified, CAT Tools Expert"
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && userType === 'client' && (
              <div className="form-section">
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Your company name"
                  />
                </div>

                <div className="form-group">
                  <label>Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                  >
                    <option value="">Select industry</option>
                    {availableIndustries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Typical Project Types</label>
                  <div className="checkbox-grid">
                    {['Documents', 'Websites', 'Marketing Materials', 'Legal Contracts', 'Technical Manuals', 'Academic Papers'].map(type => (
                      <label key={type} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={formData.projectTypes.includes(type)}
                          onChange={(e) => handleArrayChange('projectTypes', type, e.target.checked)}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-section">
                <div className="form-group">
                  <label>Notification Preferences</label>
                  <div className="preference-options">
                    <label className="preference-item">
                      <input
                        type="checkbox"
                        checked={formData.notifications.email}
                        onChange={(e) => handleNestedChange('notifications', 'email', e.target.checked)}
                      />
                      <span>Email notifications</span>
                    </label>
                    <label className="preference-item">
                      <input
                        type="checkbox"
                        checked={formData.notifications.browser}
                        onChange={(e) => handleNestedChange('notifications', 'browser', e.target.checked)}
                      />
                      <span>Browser notifications</span>
                    </label>
                    <label className="preference-item">
                      <input
                        type="checkbox"
                        checked={formData.notifications.sms}
                        onChange={(e) => handleNestedChange('notifications', 'sms', e.target.checked)}
                      />
                      <span>SMS notifications</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Privacy Settings</label>
                  <div className="preference-options">
                    <label className="preference-item">
                      <input
                        type="checkbox"
                        checked={formData.privacy.showEmail}
                        onChange={(e) => handleNestedChange('privacy', 'showEmail', e.target.checked)}
                      />
                      <span>Show email in profile</span>
                    </label>
                    <label className="preference-item">
                      <input
                        type="checkbox"
                        checked={formData.privacy.showPhone}
                        onChange={(e) => handleNestedChange('privacy', 'showPhone', e.target.checked)}
                      />
                      <span>Show phone in profile</span>
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label>Profile Visibility</label>
                    <select
                      value={formData.privacy.profileVisibility}
                      onChange={(e) => handleNestedChange('privacy', 'profileVisibility', e.target.value)}
                    >
                      <option value="public">Public - Visible to everyone</option>
                      <option value="registered">Registered users only</option>
                      <option value="private">Private - Only you can see</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {errors.general && (
              <div className="error-message">
                {errors.general}
              </div>
            )}
          </div>
        </div>

        <div className="customization-actions">
          <button 
            className="customization-btn secondary" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button 
            className="customization-btn primary" 
            onClick={nextStep}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (currentStep === steps.length - 1 ? 'Complete Setup' : 'Next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCustomizationPopup;
