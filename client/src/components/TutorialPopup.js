import React, { useState, useEffect } from 'react';
import './TutorialPopup.css';

const TutorialPopup = ({ isVisible, onComplete, userType }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const tutorialSteps = {
    client: [
      {
        title: "Welcome to LingoLink! 🎉",
        content: "We're excited to have you join our translation platform. Let's take a quick tour to get you started.",
        icon: "🌟",
        animation: "fadeIn"
      },
      {
        title: "Find Professional Translators 🔍",
        content: "Browse through our network of verified translators. Filter by language pairs, specializations, and ratings to find the perfect match for your project.",
        icon: "👥",
        animation: "slideInLeft"
      },
      {
        title: "Request Translations 📝",
        content: "Submit your translation requests with detailed requirements. Upload documents, specify deadlines, and communicate directly with translators.",
        icon: "📄",
        animation: "slideInRight"
      },
      {
        title: "Track Your Projects 📊",
        content: "Monitor progress in real-time through your dashboard. View statistics, manage active projects, and access your translation history.",
        icon: "📈",
        animation: "slideInUp"
      },
      {
        title: "Secure Payments 💳",
        content: "Our platform ensures secure transactions. Pay only when you're satisfied with the completed translation work.",
        icon: "🔒",
        animation: "pulse"
      },
      {
        title: "You're All Set! 🚀",
        content: "Ready to start your translation journey? Let's customize your profile to help translators understand your needs better.",
        icon: "✨",
        animation: "bounce"
      }
    ],
    translator: [
      {
        title: "Welcome to LingoLink! 🎉",
        content: "Join our community of professional translators and start building your translation business with us.",
        icon: "🌟",
        animation: "fadeIn"
      },
      {
        title: "Create Your Profile 👤",
        content: "Build a compelling profile showcasing your expertise, languages, specializations, and experience to attract clients.",
        icon: "📋",
        animation: "slideInLeft"
      },
      {
        title: "Browse Translation Jobs 💼",
        content: "Explore available translation projects that match your skills. Apply to jobs that interest you and fit your schedule.",
        icon: "🔍",
        animation: "slideInRight"
      },
      {
        title: "Manage Your Work 📅",
        content: "Use your dashboard to track active projects, communicate with clients, and manage deadlines efficiently.",
        icon: "⏰",
        animation: "slideInUp"
      },
      {
        title: "Get Paid Securely 💰",
        content: "Receive payments safely through our platform once your translation work is approved by the client.",
        icon: "💳",
        animation: "pulse"
      },
      {
        title: "Build Your Reputation ⭐",
        content: "Deliver quality work to earn positive reviews and build a strong reputation that attracts more clients.",
        icon: "🏆",
        animation: "bounce"
      },
      {
        title: "Ready to Start! 🚀",
        content: "Let's set up your translator profile with your languages, specializations, and rates to get you started.",
        icon: "✨",
        animation: "bounce"
      }
    ]
  };

  const steps = tutorialSteps[userType] || tutorialSteps.client;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const skipTutorial = () => {
    onComplete();
  };

  const goToStep = (stepIndex) => {
    if (stepIndex !== currentStep) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(stepIndex);
        setIsAnimating(false);
      }, 300);
    }
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-popup">
        <div className="tutorial-header">
          <div className="tutorial-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button className="tutorial-skip" onClick={skipTutorial}>
            Skip Tutorial
          </button>
        </div>

        <div className={`tutorial-content ${isAnimating ? 'animating' : ''}`}>
          <div className={`tutorial-icon ${currentStepData.animation}`}>
            {currentStepData.icon}
          </div>
          <h2 className="tutorial-title">{currentStepData.title}</h2>
          <p className="tutorial-description">{currentStepData.content}</p>
        </div>

        <div className="tutorial-dots">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`tutorial-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              onClick={() => goToStep(index)}
            >
              {index < currentStep ? '✓' : ''}
            </button>
          ))}
        </div>

        <div className="tutorial-actions">
          <button 
            className="tutorial-btn secondary" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button 
            className="tutorial-btn primary" 
            onClick={nextStep}
          >
            {currentStep === steps.length - 1 ? 'Get Started!' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialPopup;
