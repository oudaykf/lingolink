import React, { useState, useEffect } from 'react';
import './LayoutSettings.css';

const LayoutSettings = ({ translations, currentLanguage = 'en' }) => {
  const [compactMode, setCompactMode] = useState(
    localStorage.getItem('compactMode') === 'true'
  );
  const [sidebarPosition, setSidebarPosition] = useState(
    localStorage.getItem('sidebarPosition') || 'left'
  );

  const t = (key) => {
    return translations[currentLanguage][key] || translations['en'][key] || key;
  };

  useEffect(() => {
    // Apply layout settings on component mount
    applyLayoutSettings(compactMode, sidebarPosition);
  }, [compactMode, sidebarPosition]);

  const applyLayoutSettings = (compact, position) => {
    const root = document.documentElement;
    
    // Apply compact mode
    if (compact) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
    
    // Apply sidebar position
    root.setAttribute('data-sidebar-position', position);
    
    localStorage.setItem('compactMode', compact);
    localStorage.setItem('sidebarPosition', position);
  };

  const handleCompactModeToggle = () => {
    const newValue = !compactMode;
    setCompactMode(newValue);
    applyLayoutSettings(newValue, sidebarPosition);
  };

  const handleSidebarPositionChange = (position) => {
    setSidebarPosition(position);
    applyLayoutSettings(compactMode, position);
  };

  return (
    <div className="layout-settings">
      <div className="layout-section">
        <div className="toggle-option">
          <span className="toggle-label">Compact Mode</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={compactMode}
              onChange={handleCompactModeToggle}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="layout-section">
        <h4>Sidebar Position</h4>
        <div className="sidebar-position-options">
          <button
            className={`layout-option ${sidebarPosition === 'left' ? 'active' : ''}`}
            onClick={() => handleSidebarPositionChange('left')}
          >
            <span className="layout-option-icon">◀</span>
            <span className="layout-option-name">Left</span>
          </button>
          <button
            className={`layout-option ${sidebarPosition === 'right' ? 'active' : ''}`}
            onClick={() => handleSidebarPositionChange('right')}
          >
            <span className="layout-option-icon">▶</span>
            <span className="layout-option-name">Right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LayoutSettings;
