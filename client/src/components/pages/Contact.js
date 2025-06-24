import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>Ready to start your legal translation project? Have questions about our services? We're here to help.</p>
      </div>
      
      <div className="contact-content">
        <div className="contact-info">
          <h2>Contact Information</h2>
          
          <div className="info-card">
            <div className="info-details">
              <h3>Email</h3>
              <p>contact@lingolink.com</p>
              <p>support@lingolink.com</p>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-details">
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
              <p>Mon-Fri: 9AM-6PM EST</p>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-details">
              <h3>Address</h3>
              <p>123 Translation Street</p>
              <p>Language City, LC 12345</p>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-details">
              <h3>Live Chat</h3>
              <p>Available 24/7</p>
              <p>Click the chat icon</p>
            </div>
          </div>
        </div>
        
        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="quote">Request a Quote</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="general">General Question</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Tell us about your project or question..."
              ></textarea>
            </div>
            
            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </div>
      </div>
      
      <div className="contact-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>How quickly can you provide a quote?</h4>
            <p>We typically provide quotes within 2-4 hours during business hours. For urgent requests, we can provide quotes within 30 minutes.</p>
          </div>
          
          <div className="faq-item">
            <h4>What file formats do you accept?</h4>
            <p>We accept all major file formats including PDF, Word, Excel, PowerPoint, and many others. Contact us if you have a specific format question.</p>
          </div>
          
          <div className="faq-item">
            <h4>Do you offer rush delivery?</h4>
            <p>Yes, we offer expedited services for urgent projects. Rush delivery options are available with additional fees depending on the timeline.</p>
          </div>
          
          <div className="faq-item">
            <h4>How do you ensure confidentiality?</h4>
            <p>All our translators sign strict NDAs, and we use secure, encrypted systems for file transfer and storage. Your documents are completely confidential.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;