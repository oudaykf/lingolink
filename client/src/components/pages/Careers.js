import React from 'react';
import './Careers.css';

function Careers() {
  return (
    <div className="careers-page">
      <div className="careers-hero">
        <h1>Join Our Team</h1>
        <p>Help us bridge language barriers and make legal translation accessible to everyone worldwide.</p>
      </div>
      
      <div className="careers-culture">
        <h2>Why Work at LingoLink?</h2>
        <div className="culture-grid">
          <div className="culture-card">
            <div className="culture-icon">🌟</div>
            <h3>Innovation First</h3>
            <p>Work with cutting-edge translation technology and AI-powered tools that are shaping the future of legal translation.</p>
          </div>
          
          <div className="culture-card">
            <div className="culture-icon">🌍</div>
            <h3>Global Impact</h3>
            <p>Your work directly impacts legal professionals worldwide, helping them communicate across language barriers.</p>
          </div>
          
          <div className="culture-card">
            <div className="culture-icon">📚</div>
            <h3>Continuous Learning</h3>
            <p>Professional development opportunities, conference attendance, and skill enhancement programs.</p>
          </div>
          
          <div className="culture-card">
            <div className="culture-icon">⚖️</div>
            <h3>Work-Life Balance</h3>
            <p>Flexible working hours, remote work options, and comprehensive health benefits for all team members.</p>
          </div>
        </div>
      </div>
      
      <div className="careers-openings">
        <h2>Current Openings</h2>
        <div className="jobs-grid">
          <div className="job-card">
            <div className="job-header">
              <h3>Senior Legal Translator</h3>
              <span className="job-type">Full-time</span>
            </div>
            <div className="job-location">📍 Remote / New York</div>
            <p className="job-description">
              We're seeking an experienced legal translator with expertise in contract law and international agreements. 
              Fluency in English and Spanish required.
            </p>
            <div className="job-requirements">
              <h4>Requirements:</h4>
              <ul>
                <li>5+ years legal translation experience</li>
                <li>Law degree or equivalent certification</li>
                <li>Native-level proficiency in target language</li>
                <li>Experience with CAT tools</li>
              </ul>
            </div>
            <button className="apply-button">Apply Now</button>
          </div>
          
          <div className="job-card">
            <div className="job-header">
              <h3>Frontend Developer</h3>
              <span className="job-type">Full-time</span>
            </div>
            <div className="job-location">📍 Remote / San Francisco</div>
            <p className="job-description">
              Join our tech team to build intuitive user interfaces for our translation platform. 
              Experience with React and modern web technologies required.
            </p>
            <div className="job-requirements">
              <h4>Requirements:</h4>
              <ul>
                <li>3+ years React development experience</li>
                <li>Strong JavaScript and CSS skills</li>
                <li>Experience with responsive design</li>
                <li>Knowledge of translation workflows (plus)</li>
              </ul>
            </div>
            <button className="apply-button">Apply Now</button>
          </div>
          
          <div className="job-card">
            <div className="job-header">
              <h3>Quality Assurance Specialist</h3>
              <span className="job-type">Full-time</span>
            </div>
            <div className="job-location">📍 Remote / London</div>
            <p className="job-description">
              Ensure the highest quality standards for our legal translations. 
              Background in linguistics and quality management preferred.
            </p>
            <div className="job-requirements">
              <h4>Requirements:</h4>
              <ul>
                <li>Linguistics degree or equivalent</li>
                <li>Experience in translation quality assessment</li>
                <li>Multilingual capabilities</li>
                <li>Attention to detail and analytical skills</li>
              </ul>
            </div>
            <button className="apply-button">Apply Now</button>
          </div>
          
          <div className="job-card">
            <div className="job-header">
              <h3>Business Development Manager</h3>
              <span className="job-type">Full-time</span>
            </div>
            <div className="job-location">📍 Hybrid / Multiple Locations</div>
            <p className="job-description">
              Drive growth by building relationships with law firms and corporate clients. 
              Sales experience in B2B services required.
            </p>
            <div className="job-requirements">
              <h4>Requirements:</h4>
              <ul>
                <li>5+ years B2B sales experience</li>
                <li>Legal industry knowledge preferred</li>
                <li>Strong communication and negotiation skills</li>
                <li>Track record of meeting sales targets</li>
              </ul>
            </div>
            <button className="apply-button">Apply Now</button>
          </div>
        </div>
      </div>
      
      <div className="careers-benefits">
        <h2>Benefits & Perks</h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <h3>Competitive Salary</h3>
            <p>
              We offer competitive compensation packages with performance-based 
              bonuses and regular salary reviews.
            </p>
          </div>
          
          <div className="benefit-item">
            <h3>Health & Wellness</h3>
            <p>
              Comprehensive health insurance, dental coverage, and wellness 
              programs to keep you healthy and happy.
            </p>
          </div>
          
          <div className="benefit-item">
            <h3>Flexible Time Off</h3>
            <p>
              Generous vacation policy, sick leave, and flexible working 
              arrangements to maintain work-life balance.
            </p>
          </div>
          
          <div className="benefit-item">
            <h3>Learning & Development</h3>
            <p>
              Continuous learning opportunities, conference attendance, and 
              professional development programs.
            </p>
          </div>
          
          <div className="benefit-item">
            <h3>Remote Work Options</h3>
            <p>
              Flexible remote work arrangements and modern office spaces 
              designed for collaboration and productivity.
            </p>
          </div>
          
          <div className="benefit-item">
            <h3>Team Events</h3>
            <p>
              Regular team building activities, company retreats, and social 
              events to foster a strong team culture.
            </p>
          </div>
        </div>
      </div>
      
      <div className="careers-cta">
        <h2>Don't See Your Role?</h2>
        <p>We're always looking for talented individuals to join our team. Send us your resume and let us know how you'd like to contribute.</p>
        <button className="cta-button">Send General Application</button>
      </div>
    </div>
  );
}

export default Careers;