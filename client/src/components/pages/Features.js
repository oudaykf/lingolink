import React from 'react';
import './Features.css';

function Features() {
  return (
    <div className="features-page">
      <div className="features-hero">
        <h1>Powerful Features for Professional Translation</h1>
        <p>Discover the comprehensive tools and capabilities that make LingoLink the preferred choice for legal translation services.</p>
      </div>
      
      <div className="features-grid">
        <div className="feature-card">
          <h3>Multi-Language Support</h3>
          <p>
            Connect with translators who speak over 100 languages worldwide. 
            From common languages to rare dialects, we've got you covered.
          </p>
        </div>
        
        <div className="feature-card">
          <h3>Real-Time Translation</h3>
          <p>
            Get instant translations with our AI-powered system, perfect for 
            quick communications and urgent document needs.
          </p>
        </div>
        
        <div className="feature-card">
          <h3>Professional Translators</h3>
          <p>
            Work with certified, experienced translators who specialize in 
            your industry and understand cultural nuances.
          </p>
        </div>
        
        <div className="feature-card">
          <h3>Secure & Confidential</h3>
          <p>
            Your documents are protected with enterprise-grade security. 
            All translators sign strict confidentiality agreements.
          </p>
        </div>
        
        <div className="feature-card">
          <h3>Mobile-Friendly Platform</h3>
          <p>
            Access our services anywhere, anytime. Our responsive platform 
            works seamlessly on desktop, tablet, and mobile devices.
          </p>
        </div>
        
        <div className="feature-card">
          <h3>Transparent Pricing</h3>
          <p>
            No hidden fees or surprise charges. Get upfront pricing with 
            detailed breakdowns for every translation project.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Features;