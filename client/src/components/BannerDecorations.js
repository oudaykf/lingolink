import React, { useEffect, useState } from 'react';
import './BannerDecorations.css';

const BannerDecorations = ({ pattern = 'none', animation = 'fade' }) => {
  const [decorations, setDecorations] = useState([]);
  
  useEffect(() => {
    // Generate decorations based on pattern
    generateDecorations();
  }, [pattern]);
  
  const generateDecorations = () => {
    const newDecorations = [];
    
    switch (pattern) {
      case 'dots':
        for (let i = 0; i < 15; i++) {
          newDecorations.push({
            id: `dot-${i}`,
            type: 'dot',
            size: Math.random() * 10 + 5,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.2,
            delay: Math.random() * 2
          });
        }
        break;
        
      case 'lines':
        for (let i = 0; i < 8; i++) {
          newDecorations.push({
            id: `line-${i}`,
            type: 'line',
            width: Math.random() * 100 + 50,
            height: Math.random() * 2 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            rotate: Math.random() * 180,
            opacity: Math.random() * 0.3 + 0.1,
            delay: Math.random() * 2
          });
        }
        break;
        
      case 'waves':
        for (let i = 0; i < 5; i++) {
          newDecorations.push({
            id: `wave-${i}`,
            type: 'wave',
            width: Math.random() * 150 + 100,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.3 + 0.1,
            delay: Math.random() * 3
          });
        }
        break;
        
      case 'geometric':
        const shapes = ['circle', 'triangle', 'square', 'hexagon'];
        for (let i = 0; i < 10; i++) {
          newDecorations.push({
            id: `shape-${i}`,
            type: shapes[Math.floor(Math.random() * shapes.length)],
            size: Math.random() * 30 + 10,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            rotate: Math.random() * 360,
            opacity: Math.random() * 0.3 + 0.1,
            delay: Math.random() * 2
          });
        }
        break;
        
      default:
        // No decorations for 'none'
        break;
    }
    
    setDecorations(newDecorations);
  };
  
  const renderDecoration = (decoration) => {
    const animationClass = animation !== 'none' ? `animation-${animation}` : '';
    
    switch (decoration.type) {
      case 'dot':
        return (
          <div
            key={decoration.id}
            className={`decoration dot ${animationClass}`}
            style={{
              width: `${decoration.size}px`,
              height: `${decoration.size}px`,
              top: decoration.top,
              left: decoration.left,
              opacity: decoration.opacity,
              animationDelay: `${decoration.delay}s`
            }}
          />
        );
        
      case 'line':
        return (
          <div
            key={decoration.id}
            className={`decoration line ${animationClass}`}
            style={{
              width: `${decoration.width}px`,
              height: `${decoration.height}px`,
              top: decoration.top,
              left: decoration.left,
              transform: `rotate(${decoration.rotate}deg)`,
              opacity: decoration.opacity,
              animationDelay: `${decoration.delay}s`
            }}
          />
        );
        
      case 'wave':
        return (
          <div
            key={decoration.id}
            className={`decoration wave ${animationClass}`}
            style={{
              width: `${decoration.width}px`,
              top: decoration.top,
              left: decoration.left,
              opacity: decoration.opacity,
              animationDelay: `${decoration.delay}s`
            }}
          />
        );
        
      case 'circle':
      case 'triangle':
      case 'square':
      case 'hexagon':
        return (
          <div
            key={decoration.id}
            className={`decoration ${decoration.type} ${animationClass}`}
            style={{
              width: `${decoration.size}px`,
              height: `${decoration.size}px`,
              top: decoration.top,
              left: decoration.left,
              transform: `rotate(${decoration.rotate}deg)`,
              opacity: decoration.opacity,
              animationDelay: `${decoration.delay}s`
            }}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="banner-decorations">
      {decorations.map(decoration => renderDecoration(decoration))}
    </div>
  );
};

export default BannerDecorations;
