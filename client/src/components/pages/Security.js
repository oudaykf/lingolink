import React from 'react';
import './Security.css';

function Security() {
  return (
    <div className="security-page">
      <div className="security-hero">
        <h1>Security & Trust</h1>
        <p>Your data security is our top priority. Learn about our comprehensive security measures.</p>
      </div>
      
      <div className="security-content">
        <div className="security-overview">
          <h2>Our Security Commitment</h2>
          <p>
            At LingoLink, we understand that trust is the foundation of our business. 
            We implement industry-leading security practices to protect your sensitive documents 
            and personal information throughout the translation process.
          </p>
        </div>
        
        <div className="security-features">
          <div className="feature-card">
            <h3>End-to-End Encryption</h3>
            <p>All documents are encrypted using AES-256 encryption during transmission and storage.</p>
          </div>
          
          <div className="feature-card">
            <h3>Secure Infrastructure</h3>
            <p>Our servers are hosted in SOC 2 compliant data centers with 24/7 monitoring.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Vetted Translators</h3>
            <p>
              All translators undergo thorough background checks and sign comprehensive 
              non-disclosure agreements before accessing any client materials.
            </p>
          </div>
          
          <div className="feature-card">
            <h3>Access Control</h3>
            <p>Multi-factor authentication and role-based access control for all user accounts.</p>
          </div>
          
          <div className="feature-card">
            <h3>Regular Audits</h3>
            <p>Independent security audits and penetration testing performed quarterly.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🗑️</div>
            <h3>Secure Deletion</h3>
            <p>
              Documents are automatically and securely deleted from our systems after 
              project completion, with no recoverable traces remaining.
            </p>
          </div>
        </div>
        
        <div className="compliance-section">
          <h2>Compliance & Certifications</h2>
          <div className="compliance-grid">
            <div className="compliance-item">
              <h3>GDPR Compliant</h3>
              <p>
                Full compliance with the General Data Protection Regulation, 
                ensuring European data protection standards.
              </p>
            </div>
            
            <div className="compliance-item">
              <h3>ISO 27001</h3>
              <p>
                Certified information security management system following 
                international best practices.
              </p>
            </div>
            
            <div className="compliance-item">
              <h3>SOC 2 Type II</h3>
              <p>
                Independently audited security controls for service 
                organizations handling customer data.
              </p>
            </div>
            
            <div className="compliance-item">
              <h3>HIPAA Ready</h3>
              <p>
                Healthcare-grade security measures for handling 
                sensitive medical documents.
              </p>
            </div>
          </div>
        </div>
        
        <div className="security-practices">
          <h2>Security Best Practices</h2>
          <div className="practices-grid">
            <div className="practice-item">
              <h3>Regular Security Audits</h3>
              <p>
                Third-party security assessments and penetration testing 
                conducted quarterly to identify and address vulnerabilities.
              </p>
            </div>
            
            <div className="practice-item">
              <h3>Employee Training</h3>
              <p>
                Comprehensive security awareness training for all staff 
                members, updated regularly with latest threat intelligence.
              </p>
            </div>
            
            <div className="practice-item">
              <h3>Incident Response</h3>
              <p>
                24/7 security monitoring with rapid incident response 
                procedures to address any potential security events.
              </p>
            </div>
            
            <div className="practice-item">
              <h3>Data Backup</h3>
              <p>
                Encrypted, geographically distributed backups ensure 
                data availability and business continuity.
              </p>
            </div>
          </div>
        </div>
        
        <div className="security-contact">
          <h2>Security Questions?</h2>
          <p>
            If you have specific security requirements or questions about our 
            security practices, our security team is here to help.
          </p>
          <div className="contact-info">
            <p>Security Team: security@lingolink.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>For urgent security matters: +1 (555) 999-0000 (24/7)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Security;