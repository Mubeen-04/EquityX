import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row" style={{ gap: "2rem 0" }}>

          {/* Brand */}
          <div className="col-md-4">
            <span className="footer-brand">EQUITYX</span>
            <span className="footer-tagline">Professional Trading Platform</span>
            <p style={{ marginBottom: "1.25rem" }}>
              India's most trusted discount broker. Flat ₹20 brokerage,
              zero delivery charges, and professional-grade tools for every trader.
            </p>
            <div className="social-links">
              <a href="https://twitter.com/equityx" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">𝕏</a>
              <a href="https://linkedin.com/company/equityx" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">in</a>
              <a href="https://youtube.com/equityx" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">▶</a>
              <a href="https://instagram.com/equityx" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">◉</a>
            </div>
          </div>

          {/* Company */}
          <div className="col-md-2">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#press">Press</a></li>
              <li><a href="#partners">Partners</a></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="col-md-2">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/product">Features</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><a href="#api">API Access</a></li>
              <li><a href="#mobile">Mobile App</a></li>
              <li><a href="#learn">Learning Hub</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-2">
            <h4>Support</h4>
            <ul>
              <li><Link to="/support">Help Center</Link></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#status">Platform Status</a></li>
              <li><a href="#faq">FAQs</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-md-2">
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Use</a></li>
              <li><a href="#compliance">Compliance</a></li>
              <li><a href="#risk">Risk Disclosure</a></li>
              <li><a href="#grievance">Grievance</a></li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Disclaimers */}
        <div className="footer-disclaimer">
          <p>
            <strong>Risk Disclosure:</strong> Investments in the securities market are subject to market risks.
            Please read all related documents carefully before investing. Past performance is not indicative of future results.
            Trading in derivatives involves substantial risk of loss.
          </p>
          <p>
            <strong>Regulatory:</strong> EquityX Trading Pvt. Ltd. is registered with SEBI (Registration No. INZ000XXXXXX),
            NSE (Member Code: XXXXX), BSE (Member Code: XXXXX), and is a CDSL Depository Participant.
          </p>
          <p>
            <strong>Disclaimer:</strong> EquityX does not provide personalised investment advice. All trading decisions are at the
            sole discretion and risk of the investor. This platform is for informational and execution purposes only.
          </p>
        </div>

        <div className="footer-bottom">
          <span>© 2024 EquityX Trading Pvt. Ltd. All rights reserved. CIN: UXXXXX2020PTC000000</span>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <a href="#privacy" style={{ color: "var(--text-muted)" }}>Privacy</a>
            <a href="#terms" style={{ color: "var(--text-muted)" }}>Terms</a>
            <a href="#cookies" style={{ color: "var(--text-muted)" }}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
