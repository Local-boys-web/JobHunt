import React from 'react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>JobHuntting</h3>
          <p>Hunt your perfect job</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/user/login">Job Seekers</a></li>
            <li><a href="/recruiter/login">Recruiters</a></li>
            <li><a href="/admin/login">Admin</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@jobhuntting.com</p>
          <p>Phone: +91 1234567890</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} JobHuntting. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
