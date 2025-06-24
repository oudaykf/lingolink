import React, { useState, useEffect } from 'react';
import './ThemeSelector.css';

const ThemeSelector = ({ onThemeChange, translations, currentLanguage = 'en' }) => {
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') || 'light');
  const [currentAccentColor, setCurrentAccentColor] = useState(localStorage.getItem('accentColor') || 'turquoise');

  const t = (key) => {
    return translations[currentLanguage][key] || translations['en'][key] || key;
  };

  useEffect(() => {
    // Apply theme and accent color on component mount
    applyTheme(currentTheme);
    applyAccentColor(currentAccentColor);
  }, [currentTheme, currentAccentColor]);

  const themes = [
    { id: 'light', name: t('lightTheme'), icon: '☀️' },
    { id: 'dark', name: t('darkTheme'), icon: '🌙' },
    { id: 'system', name: t('systemTheme'), icon: '⚙️' }
  ];

  const accentColors = [
    { id: 'turquoise', name: t('turquoise'), color: '#20B2AA' },
    { id: 'blue', name: t('blue'), color: '#3182CE' },
    { id: 'purple', name: t('purple'), color: '#805AD5' },
    { id: 'pink', name: t('pink'), color: '#D53F8C' },
    { id: 'red', name: t('red'), color: '#E53E3E' },
    { id: 'orange', name: t('orange'), color: '#DD6B20' },
    { id: 'yellow', name: t('yellow'), color: '#D69E2E' },
    { id: 'green', name: t('green'), color: '#38A169' }
  ];

  const applyTheme = (theme) => {
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('theme', theme);
  };

  const applyAccentColor = (colorId) => {
    const color = accentColors.find(c => c.id === colorId);
    if (!color) return;

    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';

    // Calculate lighter and darker variants
    const lighterColor = adjustColor(color.color, isDark ? 20 : 10);
    const darkerColor = adjustColor(color.color, isDark ? -10 : -20);

    root.style.setProperty('--accent-color', color.color);
    root.style.setProperty('--accent-color-light', `rgba(${hexToRgb(color.color)}, ${isDark ? 0.15 : 0.1})`);
    root.style.setProperty('--accent-color-dark', darkerColor);
    root.style.setProperty('--primary', color.color);
    root.style.setProperty('--primary-light', lighterColor);
    root.style.setProperty('--primary-dark', darkerColor);

    localStorage.setItem('accentColor', colorId);
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);

    if (onThemeChange) {
      onThemeChange(theme);
    }
  };

  const handleAccentColorChange = (colorId) => {
    setCurrentAccentColor(colorId);
    applyAccentColor(colorId);
  };



  // Helper function to adjust color brightness
  function adjustColor(hex, percent) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    const adjustedR = Math.max(0, Math.min(255, r + percent));
    const adjustedG = Math.max(0, Math.min(255, g + percent));
    const adjustedB = Math.max(0, Math.min(255, b + percent));

    return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
  }

  // Helper function to convert hex to rgb
  function hexToRgb(hex) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    return `${r}, ${g}, ${b}`;
  }

  return (
    <div className="theme-selector">
      <div className="theme-selector-dropdown">
        <div className="theme-section">
          <h4>{t('chooseTheme')}</h4>
          <div className="theme-options">
            {themes.map(theme => (
              <button
                key={theme.id}
                className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                onClick={() => handleThemeChange(theme.id)}
              >
                <span className="theme-option-icon">{theme.icon}</span>
                <span className="theme-option-name">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="theme-section">
          <h4>{t('accentColor')}</h4>
          <div className="color-options">
            {accentColors.map(color => (
              <button
                key={color.id}
                className={`color-option ${currentAccentColor === color.id ? 'active' : ''}`}
                style={{ backgroundColor: color.color }}
                onClick={() => handleAccentColorChange(color.id)}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
