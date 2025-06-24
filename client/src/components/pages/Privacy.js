import React from 'react';
import './Privacy.css';

function Privacy() {
  return (
    <div className="privacy-page">
      <div className="privacy-hero">
        <h1>Privacy Policy</h1>
        <p>Your privacy is important to us. This policy explains how we collect, use, and protect your information.</p>
        <p className="last-updated">Last updated: January 1, 2025</p>
      </div>
      
      <div className="privacy-content">
        <div className="policy-section">
          <h2>Information We Collect</h2>
          <div className="section-content">
            <h3>Personal Information</h3>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              request translation services, or contact us for support. This may include:
            </p>
            <ul>
              <li>Name and contact information</li>
              <li>Company details and billing information</li>
              <li>Documents submitted for translation</li>
              <li>Communication preferences</li>
            </ul>
            
            <h3>Usage Information</h3>
            <p>
              We automatically collect certain information about your use of our services, including:
            </p>
            <ul>
              <li>IP address and device information</li>
              <li>Browser type and operating system</li>
              <li>Pages visited and time spent on our platform</li>
              <li>Features used and actions taken</li>
            </ul>
          </div>
        </div>
        
        <div className="policy-section">
          <h2>How We Use Your Information</h2>
          <div className="section-content">
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and improve our translation services</li>
              <li>Process payments and manage your account</li>
              <li>Communicate with you about your projects</li>
              <li>Send important updates and notifications</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>
        </div>
        
        <div className="policy-section">
          <h2>Information Sharing</h2>
          <div className="section-content">
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              except in the following circumstances:
            </p>
            <ul>
              <li><strong>Service Providers:</strong> Trusted partners who assist in operating our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
              <li><strong>Consent:</strong> When you explicitly authorize sharing</li>
            </ul>
          </div>
        </div>
        
        <div className="policy-section">
          <h2>Data Security</h2>
          <div className="section-content">
            <p>
              We implement industry-standard security measures to protect your information:
            </p>
            <ul>
              <li>End-to-end encryption for document transmission</li>
              <li>Secure servers with regular security audits</li>
              <li>Access controls and authentication protocols</li>
              <li>Regular data backups and disaster recovery plans</li>
            </ul>
          </div>
        </div>
        
        <div className="policy-section">
          <h2>Your Rights</h2>
          <div className="section-content">
            <p>You have the right to:</p>
            <ul>
              <li>Access and review your personal information</li>
              <li>Request corrections to inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability and export</li>
            </ul>
          </div>
        </div>
        
        <div className="policy-section">
          <h2>Cookies and Tracking</h2>
          <div className="section-content">
            <p>
              We use cookies and similar technologies to enhance your experience. 
              You can control cookie settings through your browser preferences.
            </p>
          </div>
        </div>
        
        <div className="policy-section">
          <h2>Contact Us</h2>
          <div className="section-content">
            <p>
              If you have questions about this Privacy Policy or our data practices, 
              please contact us at:
            </p>
            <div className="contact-info">
              <p>Email: privacy@lingolink.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Legal Plaza, New York, NY 10001</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;