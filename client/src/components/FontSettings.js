import React, { useState, useEffect } from 'react';
import './FontSettings.css';

const FontSettings = ({ translations, currentLanguage = 'en' }) => {
  const [currentFontSize, setCurrentFontSize] = useState(
    localStorage.getItem('fontSize') || 'medium'
  );
  const [currentFontFamily, setCurrentFontFamily] = useState(
    localStorage.getItem('fontFamily') || 'system'
  );

  const t = (key) => {
    return translations[currentLanguage][key] || translations['en'][key] || key;
  };

  useEffect(() => {
    // Apply font settings on component mount
    applyFontSize(currentFontSize);
    applyFontFamily(currentFontFamily);
  }, [currentFontSize, currentFontFamily]);

  const fontSizes = [
    { id: 'small', name: 'Small', value: '0.9rem' },
    { id: 'medium', name: 'Medium', value: '1rem' },
    { id: 'large', name: 'Large', value: '1.1rem' },
    { id: 'x-large', name: 'Extra Large', value: '1.2rem' }
  ];

  const fontFamilies = [
    { id: 'system', name: 'System Default', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
    { id: 'serif', name: 'Serif', value: 'Georgia, Times, "Times New Roman", serif' },
    { id: 'sans-serif', name: 'Sans Serif', value: 'Arial, Helvetica, sans-serif' },
    { id: 'monospace', name: 'Monospace', value: '"Courier New", Courier, monospace' }
  ];

  const applyFontSize = (sizeId) => {
    const size = fontSizes.find(s => s.id === sizeId);
    if (!size) return;

    document.documentElement.style.setProperty('--base-font-size', size.value);
    localStorage.setItem('fontSize', sizeId);
  };

  const applyFontFamily = (familyId) => {
    const family = fontFamilies.find(f => f.id === familyId);
    if (!family) return;

    document.documentElement.style.setProperty('--font-family', family.value);
    localStorage.setItem('fontFamily', familyId);
  };

  const handleFontSizeChange = (sizeId) => {
    setCurrentFontSize(sizeId);
    applyFontSize(sizeId);
  };

  const handleFontFamilyChange = (familyId) => {
    setCurrentFontFamily(familyId);
    applyFontFamily(familyId);
  };

  return (
    <div className="font-settings">
      <div className="font-section">
        <h4>Font Size</h4>
        <div className="font-size-options">
          {fontSizes.map(size => (
            <button
              key={size.id}
              className={`font-option ${currentFontSize === size.id ? 'active' : ''}`}
              onClick={() => handleFontSizeChange(size.id)}
            >
              <span className="font-option-name">{size.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="font-section">
        <h4>Font Family</h4>
        <div className="font-family-options">
          {fontFamilies.map(family => (
            <button
              key={family.id}
              className={`font-option ${currentFontFamily === family.id ? 'active' : ''}`}
              onClick={() => handleFontFamilyChange(family.id)}
              style={{ fontFamily: family.value }}
            >
              <span className="font-option-name">{family.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FontSettings;
