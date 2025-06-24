import React, { useState, useRef } from 'react';
import './EditProfile.css';

const EditProfile = ({ user, onSave, onCancel, translations }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || '',
    languages: user?.languages || [],
    specializations: user?.specializations || []
  });

  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // For language selection
  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'ar', name: 'Arabic' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' }
  ];

  // For specialization selection (for translators)
  const availableSpecializations = [
    'Legal',
    'Medical',
    'Technical',
    'Financial',
    'Marketing',
    'Literary',
    'Academic',
    'Website',
    'Software'
  ];

  // Translation function
  const t = (key) => {
    const currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
    return translations[currentLanguage][key] || translations['en'][key] || key;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Accept any image format
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLanguageChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        languages: [...formData.languages, value]
      });
    } else {
      setFormData({
        ...formData,
        languages: formData.languages.filter(lang => lang !== value)
      });
    }
  };

  const handleSpecializationChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        specializations: [...formData.specializations, value]
      });
    } else {
      setFormData({
        ...formData,
        specializations: formData.specializations.filter(spec => spec !== value)
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create form data for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('bio', formData.bio);
      submitData.append('phone', formData.phone);
      submitData.append('location', formData.location);
      submitData.append('languages', JSON.stringify(formData.languages));
      submitData.append('specializations', JSON.stringify(formData.specializations));

      if (profileImage && profileImage instanceof File) {
        submitData.append('profileImage', profileImage);
      }

      // Call the onSave function with the form data
      await onSave(submitData);
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({
        ...errors,
        submit: 'Failed to save profile. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>{t('editProfile')}</h2>

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="profile-image-section">
          <div
            className="profile-image-upload"
            onClick={handleImageClick}
            style={{ backgroundImage: imagePreview ? `url(${imagePreview})` : 'none' }}
          >
            {!imagePreview && (
              <div className="upload-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
              capture="environment"
            />
          </div>
          <div className="image-upload-text">
            <p>{t('clickToUpload')}</p>
            <span>{t('recommendedSize')}</span>
          </div>
        </div>

        <div className="form-section">
          <h3>{t('personalInformation')}</h3>

          <div className="form-group">
            <label htmlFor="name">{t('name')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="bio">{t('bio')}</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">{t('phone')}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">{t('location')}</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {user?.userType === 'translator' && (
          <div className="form-section">
            <h3>{t('professionalInformation')}</h3>

            <div className="form-group">
              <label>{t('languages')}</label>
              <div className="checkbox-group">
                {availableLanguages.map(language => (
                  <label key={language.code} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={language.code}
                      checked={formData.languages.includes(language.code)}
                      onChange={handleLanguageChange}
                    />
                    <span>{language.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>{t('specializations')}</label>
              <div className="checkbox-group">
                {availableSpecializations.map(specialization => (
                  <label key={specialization} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={specialization}
                      checked={formData.specializations.includes(specialization)}
                      onChange={handleSpecializationChange}
                    />
                    <span>{specialization}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            {t('cancel')}
          </button>
          <button type="submit" className="save-button" disabled={isSubmitting}>
            {isSubmitting ? t('saving') : t('saveChanges')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
