import React from 'react';
import './Pricing.css';

function Pricing() {
  return (
    <div className="pricing-page">
      <div className="pricing-hero">
        <h1>Simple, Transparent Pricing</h1>
        <p>Choose the plan that best fits your translation needs. No hidden fees, no surprises.</p>
      </div>
      
      <div className="pricing-grid">
        <div className="pricing-card basic">
          <div className="plan-header">
            <h3>Basic Plan</h3>
            <div className="price">
              <span className="currency">$15 USD / 15 TND</span>
              <span className="period">per page</span>
            </div>
          </div>
          <ul className="features-list">
            <li>Up to 10 documents per month</li>
            <li>Standard translation quality</li>
            <li>48-hour turnaround</li>
            <li>Email support</li>
            <li>Basic file formats (PDF, DOC)</li>
          </ul>
        </div>
        
        <div className="pricing-card professional featured">
          <div className="popular-badge">Most Popular</div>
          <div className="plan-header">
            <h3>Professional Plan</h3>
            <div className="price">
              <span className="currency">$15 USD / 15 TND</span>
              <span className="period">per page</span>
            </div>
          </div>
          <ul className="features-list">
            <li>Unlimited documents</li>
            <li>Premium translation quality</li>
            <li>24-hour turnaround</li>
            <li>Priority support</li>
            <li>All file formats supported</li>
            <li>Revision included</li>
            <li>Project management</li>
          </ul>
        </div>
        
        <div className="pricing-card enterprise">
          <div className="plan-header">
            <h3>Enterprise Plan</h3>
            <div className="price">
              <span className="currency">$15 USD / 15 TND</span>
              <span className="period">per page</span>
            </div>
          </div>
          <ul className="features-list">
            <li>Everything in Professional</li>
            <li>Dedicated account manager</li>
            <li>Custom workflows</li>
            <li>API access</li>
            <li>White-label solutions</li>
            <li>SLA guarantees</li>
            <li>Advanced analytics</li>
            <li>24/7 phone support</li>
          </ul>
        </div>
      </div>
      
      <div className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>How is pricing calculated?</h4>
            <p>Pricing is based on the word count of your source document. We provide accurate quotes before you commit.</p>
          </div>
          <div className="faq-item">
            <h4>Are there any hidden fees?</h4>
            <p>No hidden fees. The price you see is the price you pay. Rush orders may incur additional charges.</p>
          </div>
          <div className="faq-item">
            <h4>What payment methods do you accept?</h4>
            <p>We accept all major credit cards, PayPal, and bank transfers for enterprise clients.</p>
          </div>
          
          <div className="faq-item">
            <h4>Can I cancel my subscription anytime?</h4>
            <p>Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees.</p>
          </div>
          
          <div className="faq-item">
            <h4>Do you offer refunds?</h4>
            <p>We offer a 30-day money-back guarantee if you're not satisfied with our service.</p>
          </div>
          
          <div className="faq-item">
            <h4>Is there a free trial available?</h4>
            <p>Yes, we offer a 7-day free trial for new users to test our platform and services.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;