import React, { useState, useEffect } from 'react';

const ColorChangingLogo = ({ className, alt = "LingoLink", size = 'medium', onClick }) => {
  const handleLogoClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: navigate to home page
      window.location.href = '/';
    }
  };
  const [accentColor, setAccentColor] = useState('#20B2AA'); // Default turquoise color
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [textColor, setTextColor] = useState('#000000'); // Default text color

  // Set size based on prop
  const sizeMap = {
    small: { width: '32px', height: '32px' },
    medium: { width: '60px', height: '60px' },
    large: { width: '100px', height: '100px' }
  };

  const dimensions = sizeMap[size] || sizeMap.medium;

  // Listen for theme changes
  useEffect(() => {
    // Get initial theme
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    setIsDarkMode(theme === 'dark');
    setTextColor('#000000');

    // Get initial accent color
    const rootStyles = getComputedStyle(document.documentElement);
    const currentAccentColor = rootStyles.getPropertyValue('--accent-color').trim();
    if (currentAccentColor) {
      setAccentColor(currentAccentColor);
    }

    // Create a MutationObserver to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme');
          setIsDarkMode(newTheme === 'dark');
          setTextColor('#000000');
        }
      });
    });

    // Start observing the document element for attribute changes
    observer.observe(document.documentElement, { attributes: true });

    // Create a function to check for CSS variable changes
    const checkForColorChanges = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const newAccentColor = rootStyles.getPropertyValue('--accent-color').trim();
      if (newAccentColor && newAccentColor !== accentColor) {
        setAccentColor(newAccentColor);
      }
    };

    // Set up an interval to check for color changes
    const intervalId = setInterval(checkForColorChanges, 1000);

    // Clean up
    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [accentColor]);

  return (
    <div 
      className={`color-changing-logo ${className || ''}`} 
      style={{ ...dimensions, cursor: 'pointer' }}
      onClick={handleLogoClick}
      title="Go to Home Page"
    >
      <img 
        src="/new-main-logo.svg" 
        alt={alt}
        width="100%"
        height="100%"
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
};

export default ColorChangingLogo;
