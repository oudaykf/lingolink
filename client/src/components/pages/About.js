import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About LingoLink</h1>
        <p>Bridging language barriers in the legal world with precision, expertise, and unwavering commitment to quality.</p>
      </div>
      
      <div className="about-story">
        <div className="story-content">
          <h2>Our Story</h2>
          <p>
            Founded in 2025, LingoLink emerged from a simple yet powerful vision: to make legal translation 
            accessible, accurate, and efficient for organizations worldwide. Our founders, experienced legal 
            professionals and linguists, recognized the critical need for specialized translation services 
            in an increasingly globalized legal landscape.
          </p>

        </div>
      </div>
      
      <div className="about-mission">
        <h2>Our Mission</h2>
        <div className="mission-content">
          <div className="mission-item">
            <h3>1. Provide reliable, fast translation services tailored to each client's needs</h3>
            <p>
              We offer professional translations of official, commercial, or personal documents, 
              with the option to choose between certified translation (certified by an approved translator) 
              or non-certified translation, depending on the intended use.
            </p>
          </div>
          
          <div className="mission-item">
            <h3>2. Guarantee complete transparency in pricing and deadlines</h3>
            <p>
              Thanks to our intuitive platform, each client knows in advance the exact cost and deadline 
              for their translation, with no hidden fees, and clear options based on language, document type, 
              and required certification level.
            </p>
          </div>
          
          <div className="mission-item">
            <h3>3. Connect clients to a network of qualified and specialized translators</h3>
            <p>
              Our platform connects clients with expert translators in their field, 
              ensuring optimal quality for each translation project.
            </p>
          </div>
        </div>
      </div>
      
      <div className="about-values">
        <h2>Our Values</h2>
        <div className="values-content">
          <h3>Vision (The future goal of the startup):</h3>
          
          <div className="vision-item">
            <p>
              Become the Tunisian reference in the translation of all types of documents 
              (official, commercial, legal, etc.), with a network of accredited translators.
            </p>
          </div>
          
          <div className="vision-item">
            <p>
              Revolutionize the professional translation sector by combining artificial 
              intelligence and human expertise for optimal quality.
            </p>
          </div>
          
          <div className="vision-item">
            <p>
              Create a global ecosystem where administrations, businesses and individuals easily access 
              reliable, fast and legally validated translations.
            </p>
          </div>
        </div>
      </div>
      
      <div className="about-team">
        <h2>Leadership Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar">
              <img src="/images/oubayd-kefi.jpg" alt="Oubayd Allah Kefi" className="member-photo" />
            </div>
            <h3>Oubayd Allah Kefi</h3>
            <p className="member-title">CEO & Founder</p>
            <p className="member-bio">
              As the founder and CEO of LingoLink, he leads the vision, strategy, and daily operations of the platform. With a deep understanding of the translation industry, he ensures LingoLink stays focused on quality, transparency, and user trust.
            </p>
          </div>
          
          <div className="team-member">
            <div className="member-avatar">👩‍💼</div>
            <h3>anonym</h3>
            <p className="member-title">Head of Translation</p>
            <p className="member-bio">
              She oversees translation quality at LingoLink and manages the onboarding of new translators. With a strong eye for detail and a deep understanding of language standards, she ensures all translations meet the platform's quality and accuracy goals.
            </p>
          </div>
          
          <div className="team-member">
            <div className="member-avatar">
              <img src="/images/ouday-kefi.jpg" alt="Ouday Kefi" className="member-photo" />
            </div>
            <h3>Ouday Kefi</h3>
            <p className="member-title">Co-Founder & CTO</p>
            <p className="member-bio">
              Ouday leads the technical side of LingoLink, building and managing the platform's features and systems. Passionate about web development, he ensures a smooth and secure experience for users, combining performance with innovation.
            </p>
          </div>
        </div>
      </div>
      

    </div>
  );
}

export default About;