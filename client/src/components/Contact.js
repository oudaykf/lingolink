import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    preferredLanguage: 'en'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Replace with actual API call
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        preferredLanguage: 'en'
      });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with our team for any questions or inquiries</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">📧</div>
            <h3>Email</h3>
            <p>support@lingolink.com</p>
            <p>info@lingolink.com</p>
          </div>

          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Phone</h3>
            <p>+216 XX XXX XXX</p>
            <p>+216 XX XXX XXX</p>
          </div>

          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Address</h3>
            <p>123 Business Street</p>
            <p>Tunis, Tunisia</p>
          </div>

          <div className="info-card">
            <div className="info-icon">⏰</div>
            <h3>Working Hours</h3>
            <p>Monday - Friday: 9:00 - 18:00</p>
            <p>Saturday: 9:00 - 13:00</p>
          </div>
        </div>

        <div className="contact-form-container">
          <form onSubmit={handleSubmit} className="contact-form">
            {error && (
              <div className="error-message">
                {error}
                <button onClick={() => setError(null)}>×</button>
              </div>
            )}

            {success && (
              <div className="success-message">
                Message sent successfully! We'll get back to you soon.
                <button onClick={() => setSuccess(false)}>×</button>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Enter the subject"
              />
            </div>

            <div className="form-group">
              <label htmlFor="preferredLanguage">Preferred Language</label>
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="ar">Arabic</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Enter your message"
                rows="6"
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <span className="button-loader"></span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="contact-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3190.0!2d10.0!3d36.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDAwJzAwLjAiTiAxMMKwMDAnMDAuMCJF!5e0!3m2!1sen!2stn!4v1234567890"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact; 