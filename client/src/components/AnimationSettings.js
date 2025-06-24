import React, { useState, useEffect } from 'react';
import './AnimationSettings.css';

const AnimationSettings = ({ translations, currentLanguage = 'en' }) => {
  const [animationsEnabled, setAnimationsEnabled] = useState(
    localStorage.getItem('animationsEnabled') !== 'false'
  );
  const [transitionSpeed, setTransitionSpeed] = useState(
    localStorage.getItem('transitionSpeed') || 'normal'
  );

  const t = (key) => {
    return translations[currentLanguage][key] || translations['en'][key] || key;
  };

  useEffect(() => {
    // Apply animation settings on component mount
    applyAnimationSettings(animationsEnabled, transitionSpeed);
  }, [animationsEnabled, transitionSpeed]);

  const transitionSpeeds = [
    { id: 'fast', name: 'Fast', value: '0.15s' },
    { id: 'normal', name: 'Normal', value: '0.3s' },
    { id: 'slow', name: 'Slow', value: '0.5s' }
  ];

  const applyAnimationSettings = (enabled, speed) => {
    const root = document.documentElement;
    
    // Enable or disable animations
    if (!enabled) {
      root.style.setProperty('--transition-speed', '0s');
      root.classList.add('no-animations');
    } else {
      const speedObj = transitionSpeeds.find(s => s.id === speed);
      root.style.setProperty('--transition-speed', speedObj ? speedObj.value : '0.3s');
      root.classList.remove('no-animations');
    }
    
    localStorage.setItem('animationsEnabled', enabled);
    localStorage.setItem('transitionSpeed', speed);
  };

  const handleAnimationsToggle = () => {
    const newValue = !animationsEnabled;
    setAnimationsEnabled(newValue);
    applyAnimationSettings(newValue, transitionSpeed);
  };

  const handleTransitionSpeedChange = (speedId) => {
    setTransitionSpeed(speedId);
    applyAnimationSettings(animationsEnabled, speedId);
  };

  return (
    <div className="animation-settings">
      <div className="animation-section">
        <div className="toggle-option">
          <span className="toggle-label">Enable Animations</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={animationsEnabled}
              onChange={handleAnimationsToggle}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {animationsEnabled && (
        <div className="animation-section">
          <h4>Animation Speed</h4>
          <div className="transition-speed-options">
            {transitionSpeeds.map(speed => (
              <button
                key={speed.id}
                className={`animation-option ${transitionSpeed === speed.id ? 'active' : ''}`}
                onClick={() => handleTransitionSpeedChange(speed.id)}
              >
                <span className="animation-option-name">{speed.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimationSettings;
