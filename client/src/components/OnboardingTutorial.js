import React, { useState, useEffect } from 'react';
import './OnboardingTutorial.css';

const OnboardingTutorial = ({ 
  steps, 
  onComplete, 
  isOpen, 
  userType = 'client',
  translations,
  currentLanguage = 'en'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(isOpen);
  
  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);
  
  const t = (key) => {
    return translations[currentLanguage][key] || translations['en'][key] || key;
  };
  
  // Default steps if none provided
  const defaultSteps = {
    client: [
      {
        title: t('welcomeToLingoLink'),
        content: 'Welcome! Let’s get your account ready. Follow these steps to unlock all features.',
        image: '/images/tutorial/welcome.svg',
      },
      {
        title: 'Set Up Your Profile',
        content: 'Add your name, photo, phone number, and other details. A complete profile helps you get the most out of LingoLink.',
        image: '/images/tutorial/profile-setup.svg',
      },
      {
        title: 'Verify Your Email & Phone',
        content: 'Check your email and phone for verification codes. Enter them to secure your account.',
        image: '/images/tutorial/verify-contact.svg',
      },
      {
        title: 'Identity Verification',
        content: 'Upload or take a live photo of your identity document. Make sure it’s clear and readable.',
        image: '/images/tutorial/identity-doc.svg',
      },
      {
        title: 'Face Verification',
        content: 'Upload or take a live photo of your face. You can use your webcam or phone camera for this step.',
        image: '/images/tutorial/face-verify.svg',
      },
      {
        title: 'All Set!',
        content: 'Once verified, you’ll have full access to all features. If you need help, visit the Help Center or contact support.',
        image: '/images/tutorial/success.svg',
      }
    ],
    translator: [
      {
        title: t('welcomeToLingoLink'),
        content: 'Welcome! Let’s get your translator profile ready. Follow these steps to start working.',
        image: '/images/tutorial/welcome.svg',
      },
      {
        title: 'Set Up Your Profile',
        content: 'Add your name, photo, phone number, languages, and specializations. A complete profile attracts more clients.',
        image: '/images/tutorial/profile-setup.svg',
      },
      {
        title: 'Verify Your Email & Phone',
        content: 'Check your email and phone for verification codes. Enter them to secure your account.',
        image: '/images/tutorial/verify-contact.svg',
      },
      {
        title: 'Identity Verification',
        content: 'Upload or take a live photo of your identity document. Make sure it’s clear and readable.',
        image: '/images/tutorial/identity-doc.svg',
      },
      {
        title: 'Face Verification',
        content: 'Upload or take a live photo of your face. You can use your webcam or phone camera for this step.',
        image: '/images/tutorial/face-verify.svg',
      },
      {
        title: 'All Set!',
        content: 'Once verified, you’ll have full access to all features. If you need help, visit the Help Center or contact support.',
        image: '/images/tutorial/success.svg',
      }
    ]
  };
  
  const tutorialSteps = steps || defaultSteps[userType] || defaultSteps.client;
  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = () => {
    setVisible(false);
    if (onComplete) {
      onComplete();
    }
  };
  
  const handleSkip = () => {
    handleComplete();
  };
  
  if (!visible) return null;
  
  const currentTutorialStep = tutorialSteps[currentStep];
  
  return (
    <div className="onboarding-overlay">
      <div className="onboarding-container">
        <button className="onboarding-close" onClick={handleComplete}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="onboarding-content">
          <div className="onboarding-image">
            <img src={currentTutorialStep.image} alt={currentTutorialStep.title} />
          </div>
          
          <div className="onboarding-text">
            <h2>{currentTutorialStep.title}</h2>
            <p>{currentTutorialStep.content}</p>
          </div>
          
          <div className="onboarding-progress">
            {tutorialSteps.map((_, index) => (
              <div 
                key={index} 
                className={`progress-dot ${index === currentStep ? 'active' : ''}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>
          
          <div className="onboarding-actions">
            {currentStep > 0 && (
              <button className="btn-secondary" onClick={handlePrevious}>
                {t('previous')}
              </button>
            )}
            
            <button className="btn-skip" onClick={handleSkip}>
              {t('skipTutorial')}
            </button>
            
            <button className="btn-primary" onClick={handleNext}>
              {currentStep < tutorialSteps.length - 1 ? t('next') : t('getStarted')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;
