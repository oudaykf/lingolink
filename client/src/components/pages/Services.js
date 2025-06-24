import React from 'react';
import './Services.css';

function Services() {
  return (
    <div className="services-page">
      <div className="services-hero">
        <h1>Our Services</h1>
        <p>Comprehensive translation solutions tailored to meet your specific needs.</p>
      </div>
      
      <div className="services-content">
        <div className="service-category">
          <h2>Document Translation</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Business Documents</h3>
              <p>
                Professional translation of contracts, reports, presentations, 
                and other business materials with industry-specific expertise.
              </p>
              <ul>
                <li>Legal contracts and agreements</li>
                <li>Financial reports and statements</li>
                <li>Marketing materials</li>
                <li>Technical documentation</li>
              </ul>
            </div>
            
            <div className="service-card">
              <h3>Academic Translation</h3>
              <p>
                Accurate translation of academic papers, research documents, 
                and educational materials by subject matter experts.
              </p>
              <ul>
                <li>Research papers and journals</li>
                <li>Thesis and dissertations</li>
                <li>Educational curricula</li>
                <li>Academic transcripts</li>
              </ul>
            </div>
            
            <div className="service-card">
              <h3>Medical Translation</h3>
              <p>
                Specialized medical translation services ensuring accuracy 
                and compliance with healthcare regulations.
              </p>
              <ul>
                <li>Medical records and reports</li>
                <li>Clinical trial documentation</li>
                <li>Pharmaceutical materials</li>
                <li>Medical device manuals</li>
              </ul>
            </div>
            
            <div className="service-card">
              <h3>Legal Translation</h3>
              <p>
                Certified legal translation services for court documents, 
                contracts, and other legal materials.
              </p>
              <ul>
                <li>Court documents and judgments</li>
                <li>Immigration papers</li>
                <li>Patent applications</li>
                <li>Compliance documentation</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="service-category">
          <h2>Specialized Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Localization</h3>
              <p>
                Comprehensive localization services to adapt your content 
                for specific markets and cultures.
              </p>
              <ul>
                <li>Website and app localization</li>
                <li>Software interface translation</li>
                <li>Cultural adaptation</li>
                <li>Market-specific content</li>
              </ul>
            </div>
            
            <div className="service-card">
              <h3>Interpretation</h3>
              <p>
                Professional interpretation services for meetings, conferences, 
                and real-time communication needs.
              </p>
              <ul>
                <li>Simultaneous interpretation</li>
                <li>Consecutive interpretation</li>
                <li>Video conference interpretation</li>
                <li>Phone interpretation</li>
              </ul>
            </div>
            
            <div className="service-card">
              <h3>Proofreading & Editing</h3>
              <p>
                Quality assurance services to ensure your translations 
                meet the highest standards of accuracy and fluency.
              </p>
              <ul>
                <li>Translation review and editing</li>
                <li>Linguistic quality assurance</li>
                <li>Style guide compliance</li>
                <li>Final proofreading</li>
              </ul>
            </div>
            
            <div className="service-card">
              <h3>Certified Translation</h3>
              <p>
                Official certified translations accepted by government 
                agencies, courts, and educational institutions.
              </p>
              <ul>
                <li>Birth and marriage certificates</li>
                <li>Academic diplomas</li>
                <li>Immigration documents</li>
                <li>Legal certifications</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="languages-section">
          <h2>Supported Languages</h2>
          <p>We provide translation services in over 100 languages worldwide.</p>
          <div className="languages-grid">
            <div className="language-group">
              <h3>European Languages</h3>
              <div className="language-list">
                <span>English</span>
                <span>Spanish</span>
                <span>French</span>
                <span>German</span>
                <span>Italian</span>
                <span>Portuguese</span>
                <span>Russian</span>
                <span>Dutch</span>
                <span>Polish</span>
                <span>Swedish</span>
              </div>
            </div>
            
            <div className="language-group">
              <h3>Asian Languages</h3>
              <div className="language-list">
                <span>Chinese (Simplified)</span>
                <span>Chinese (Traditional)</span>
                <span>Japanese</span>
                <span>Korean</span>
                <span>Hindi</span>
                <span>Arabic</span>
                <span>Thai</span>
                <span>Vietnamese</span>
                <span>Indonesian</span>
                <span>Malay</span>
              </div>
            </div>
            
            <div className="language-group">
              <h3>Other Languages</h3>
              <div className="language-list">
                <span>Hebrew</span>
                <span>Turkish</span>
                <span>Persian</span>
                <span>Swahili</span>
                <span>Urdu</span>
                <span>Bengali</span>
                <span>Tamil</span>
                <span>Telugu</span>
                <span>Gujarati</span>
                <span>Punjabi</span>
              </div>
            </div>
          </div>
        </div>
        
        
        <div className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>Contact us today for a free quote and consultation.</p>
          <div className="cta-buttons">
            <button className="cta-primary">Get Free Quote</button>
            <button className="cta-secondary">Contact Us</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;