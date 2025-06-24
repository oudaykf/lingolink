import React from 'react';
import './Enterprise.css';

function Enterprise() {
  return (
    <div className="enterprise-page">
      <div className="enterprise-hero">
        <h1>Enterprise Solutions</h1>
        <p>Scalable legal translation services designed for large organizations, law firms, and multinational corporations.</p>
        <button className="cta-button primary">Schedule a Demo</button>
      </div>
      
      <div className="enterprise-features">
        <h2>Enterprise Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Dedicated Account Management</h3>
            <p>
              Get a dedicated account manager who understands your business needs 
              and ensures seamless communication throughout all projects.
            </p>
          </div>
          
          <div className="feature-card">
            <h3>Priority Processing</h3>
            <p>
              Your projects get priority treatment with faster turnaround times 
              and expedited review processes for urgent requirements.
            </p>
          </div>
          
          <div className="feature-card">
            <h3>Custom Workflows</h3>
            <p>
              Tailored translation workflows that integrate seamlessly with 
              your existing business processes and approval systems.
            </p>
          </div>
          
          <div className="feature-card">
            <h3>Advanced Analytics</h3>
            <p>
              Comprehensive reporting and analytics to track translation 
              performance, costs, and efficiency across all your projects.
            </p>
          </div>
          
          <div className="feature-card">
            <h3>Enhanced Security</h3>
            <p>
              Enterprise-grade security with custom NDAs, secure file transfer, 
              and compliance with industry-specific regulations.
            </p>
          </div>
          
          <div className="feature-card">
            <h3>API Integration</h3>
            <p>
              Seamless integration with your existing systems through our 
              robust API, enabling automated translation workflows.
            </p>
          </div>
        </div>
      </div>
      
      <div className="enterprise-benefits">
        <h2>Why Choose LingoLink Enterprise?</h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <h3>Volume Discounts</h3>
            <p>Significant cost savings with our tiered pricing structure for high-volume translation projects.</p>
          </div>
          
          <div className="benefit-item">
            <h3>Custom Workflows</h3>
            <p>Tailored processes that integrate with your existing systems and approval workflows.</p>
          </div>
          
          <div className="benefit-item">
            <h3>24/7 Support</h3>
            <p>Round-the-clock technical and project support to ensure your deadlines are always met.</p>
          </div>
          
          <div className="benefit-item">
            <h3>Quality Guarantee</h3>
            <p>Multi-tier quality assurance process with unlimited revisions to ensure perfect accuracy.</p>
          </div>
        </div>
      </div>
      
      <div className="enterprise-cta">
        <h2>Ready to Scale Your Translation Operations?</h2>
        <p>Join hundreds of enterprises who trust LingoLink for their critical legal translation needs.</p>
        <div className="cta-buttons">
          <button className="cta-button primary">Request a Quote</button>
          <button className="cta-button secondary">Download Brochure</button>
        </div>
      </div>
    </div>
  );
}

export default Enterprise;