import React from 'react';
import './Terms.css';

function Terms() {
  return (
    <div className="terms-page">
      <div className="terms-hero">
        <h1>Terms of Service</h1>
        <p>Please read these terms carefully before using our translation services.</p>
        <p className="last-updated">Last updated: January 1, 2025</p>
      </div>
      
      <div className="terms-content">
        <div className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <div className="section-content">
            <p>
              By accessing and using LingoLink's services, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not 
              use this service.
            </p>
          </div>
        </div>
        
        <div className="terms-section">
          <h2>2. Service Description</h2>
          <div className="section-content">
            <p>
              LingoLink provides professional translation services through our platform. Our services include:
            </p>
            <ul>
              <li>Document translation in multiple languages</li>
              <li>Real-time translation assistance</li>
              <li>Professional translator matching</li>
              <li>Quality assurance and review services</li>
              <li>Project management tools</li>
            </ul>
          </div>
        </div>
        
        <div className="terms-section">
          <h2>3. User Accounts</h2>
          <div className="section-content">
            <p>
              To access certain features of our service, you must register for an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </div>
        </div>
        
        <div className="terms-section">
          <h2>4. Payment Terms</h2>
          <div className="section-content">
            <p>
              Payment for translation services is due upon completion of the project unless otherwise agreed. 
              Our payment terms include:
            </p>
            <ul>
              <li>All prices are quoted in USD unless specified otherwise</li>
              <li>Payment is processed through secure third-party providers</li>
              <li>Refunds are available within 7 days for unsatisfactory work</li>
              <li>Late payment fees may apply for enterprise accounts</li>
            </ul>
          </div>
        </div>
        
        <div className="terms-section">
          <h2>5. Intellectual Property</h2>
          <div className="section-content">
            <p>
              You retain ownership of your original documents. By using our service, you grant us:
            </p>
            <ul>
              <li>Limited license to process and translate your documents</li>
              <li>Right to use anonymized data for service improvement</li>
              <li>Permission to showcase work samples (with your consent)</li>
            </ul>
            <p>
              All translated content becomes your property upon payment completion.
            </p>
          </div>
        </div>
        
        <div className="terms-section">
          <h2>6. Quality Guarantee</h2>
          <div className="section-content">
            <p>
              We strive to provide high-quality translations. Our quality guarantee includes:
            </p>
            <ul>
              <li>Professional translators with relevant expertise</li>
              <li>Quality review process for all translations</li>
              <li>Revision requests within 7 days of delivery</li>
              <li>Full refund for translations that don't meet standards</li>
            </ul>
          </div>
        </div>
        
        <div className="terms-section">
          <h2>7. Confidentiality</h2>
          <div className="section-content">
            <p>
              We understand the sensitive nature of your documents. We commit to:
            </p>
            <ul>
              <li>Maintaining strict confidentiality of all submitted materials</li>
              <li>Requiring all translators to sign non-disclosure agreements</li>
              <li>Secure handling and storage of your documents</li>
              <li>Automatic deletion of files after project completion (unless requested otherwise)</li>
            </ul>
          </div>
        </div>
        
        <div className="terms-section">
          <h2>8. Limitation of Liability</h2>
          <div className="section-content">
            <p>
              LingoLink's liability is limited to the amount paid for the specific translation service. 
              We are not liable for:
            </p>
            <ul>
              <li>Indirect or consequential damages</li>
              <li>Loss of profits or business opportunities</li>
              <li>Damages resulting from third-party actions</li>
              <li>Technical issues beyond our reasonable control</li>
            </ul>
          </div>
        </div>
        
        <div className="terms-section">
          <h2>9. Termination</h2>
          <div className="section-content">
            <p>
              Either party may terminate this agreement at any time. Upon termination:
            </p>
            <ul>
              <li>Outstanding payments become immediately due</li>
              <li>Access to the platform will be revoked</li>
              <li>Your data will be deleted according to our privacy policy</li>
              <li>Ongoing projects will be completed or refunded</li>
            </ul>
          </div>
        </div>
        
        <div className="terms-section">
          <h2>10. Changes to Terms</h2>
          <div className="section-content">
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting. Continued use of our service constitutes acceptance of 
              the modified terms.
            </p>
          </div>
        </div>
        
        <div className="terms-section">
          <h2>11. Contact Information</h2>
          <div className="section-content">
            <p>
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="contact-info">
              <p>Email: legal@lingolink.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Legal Plaza, New York, NY 10001</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;