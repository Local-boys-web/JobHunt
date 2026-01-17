import React from 'react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Job Portal</h3>
          <p>Find your dream job with us</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/user/login">User</a></li>
            <li><a href="/recruiter/login">Recruiters</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li><a href="/?category=Private">Private Jobs</a></li>
            <li><a href="/?category=Government">Government Jobs</a></li>
            <li><a href="/?category=Internship">Internships</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@jobportal.com</p>
          <p>Phone: +91 1234567890</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Job Portal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
