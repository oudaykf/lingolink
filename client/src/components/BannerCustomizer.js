import React, { useState, useEffect } from 'react';
import './BannerCustomizer.css';

const BannerCustomizer = ({ translations, currentLanguage = 'en' }) => {
  const [bannerStyle, setBannerStyle] = useState(localStorage.getItem('bannerStyle') || 'default');
  const [bannerPattern, setBannerPattern] = useState(localStorage.getItem('bannerPattern') || 'none');
  const [bannerAnimation, setBannerAnimation] = useState(localStorage.getItem('bannerAnimation') || 'fade');
  const [showDecorations, setShowDecorations] = useState(localStorage.getItem('showDecorations') !== 'false');

  const t = (key) => {
    return translations[currentLanguage][key] || translations['en'][key] || key;
  };

  useEffect(() => {
    // Apply banner customizations on component mount
    applyBannerStyle(bannerStyle);
    applyBannerPattern(bannerPattern);
    applyBannerAnimation(bannerAnimation);
    applyDecorations(showDecorations);
  }, [bannerStyle, bannerPattern, bannerAnimation, showDecorations]);

  const bannerStyles = [
    { id: 'default', name: t('defaultStyle'), icon: '🎨' },
    { id: 'gradient', name: t('gradientStyle'), icon: '🌈' },
    { id: 'solid', name: t('solidStyle'), icon: '■' },
    { id: 'minimal', name: t('minimalStyle'), icon: '▫️' }
  ];

  const bannerPatterns = [
    { id: 'none', name: t('noPattern'), icon: '⬜' },
    { id: 'dots', name: t('dotsPattern'), icon: '⋮' },
    { id: 'lines', name: t('linesPattern'), icon: '≡' },
    { id: 'waves', name: t('wavesPattern'), icon: '〰️' },
    { id: 'geometric', name: t('geometricPattern'), icon: '◈' }
  ];

  const bannerAnimations = [
    { id: 'none', name: t('noAnimation'), icon: '⏹️' },
    { id: 'fade', name: t('fadeAnimation'), icon: '🔆' },
    { id: 'slide', name: t('slideAnimation'), icon: '↔️' },
    { id: 'pulse', name: t('pulseAnimation'), icon: '💓' },
    { id: 'particles', name: t('particlesAnimation'), icon: '✨' }
  ];

  const applyBannerStyle = (style) => {
    const root = document.documentElement;
    
    switch (style) {
      case 'gradient':
        root.style.setProperty('--banner-style', 'gradient');
        break;
      case 'solid':
        root.style.setProperty('--banner-style', 'solid');
        break;
      case 'minimal':
        root.style.setProperty('--banner-style', 'minimal');
        break;
      default:
        root.style.setProperty('--banner-style', 'default');
    }
    
    localStorage.setItem('bannerStyle', style);
  };

  const applyBannerPattern = (pattern) => {
    const root = document.documentElement;
    root.style.setProperty('--banner-pattern', pattern);
    localStorage.setItem('bannerPattern', pattern);
  };

  const applyBannerAnimation = (animation) => {
    const root = document.documentElement;
    root.style.setProperty('--banner-animation', animation);
    localStorage.setItem('bannerAnimation', animation);
  };

  const applyDecorations = (show) => {
    const root = document.documentElement;
    root.style.setProperty('--show-decorations', show ? 'block' : 'none');
    localStorage.setItem('showDecorations', show);
  };

  const handleBannerStyleChange = (style) => {
    setBannerStyle(style);
    applyBannerStyle(style);
  };

  const handleBannerPatternChange = (pattern) => {
    setBannerPattern(pattern);
    applyBannerPattern(pattern);
  };

  const handleBannerAnimationChange = (animation) => {
    setBannerAnimation(animation);
    applyBannerAnimation(animation);
  };

  const handleDecorationsToggle = () => {
    const newValue = !showDecorations;
    setShowDecorations(newValue);
    applyDecorations(newValue);
  };

  return (
    <div className="banner-customizer">
      <div className="customizer-section">
        <h4>{t('bannerStyle')}</h4>
        <div className="style-options">
          {bannerStyles.map(style => (
            <button
              key={style.id}
              className={`style-option ${bannerStyle === style.id ? 'active' : ''}`}
              onClick={() => handleBannerStyleChange(style.id)}
            >
              <span className="style-option-icon">{style.icon}</span>
              <span className="style-option-name">{style.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="customizer-section">
        <h4>{t('bannerPattern')}</h4>
        <div className="pattern-options">
          {bannerPatterns.map(pattern => (
            <button
              key={pattern.id}
              className={`pattern-option ${bannerPattern === pattern.id ? 'active' : ''}`}
              onClick={() => handleBannerPatternChange(pattern.id)}
            >
              <span className="pattern-option-icon">{pattern.icon}</span>
              <span className="pattern-option-name">{pattern.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="customizer-section">
        <h4>{t('bannerAnimation')}</h4>
        <div className="animation-options">
          {bannerAnimations.map(animation => (
            <button
              key={animation.id}
              className={`animation-option ${bannerAnimation === animation.id ? 'active' : ''}`}
              onClick={() => handleBannerAnimationChange(animation.id)}
            >
              <span className="animation-option-icon">{animation.icon}</span>
              <span className="animation-option-name">{animation.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="customizer-section">
        <div className="toggle-option">
          <label className="toggle-label">
            <span>{t('showDecorations')}</span>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={showDecorations}
                onChange={handleDecorationsToggle}
              />
              <span className="toggle-slider"></span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default BannerCustomizer;
