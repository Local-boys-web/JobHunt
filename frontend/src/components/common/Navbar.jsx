import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Navbar.css';

const Navbar = ({ alwaysMobile = false, onSidebarToggle, showSidebarToggle = false }) => {
  const { isAuthenticated, userType, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setShowLoginDropdown(false);
    setShowRegisterDropdown(false);
  };

  return (
    <>
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div className="navbar-overlay" onClick={closeMobileMenu}></div>
      )}

      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''} ${alwaysMobile ? 'navbar-always-mobile' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <span className="logo-text">Job<span className="logo-highlight">Huntting</span></span>
          </Link>

          {/* Hamburger Menu - Only show for non-authenticated users */}
          {!isAuthenticated && (
            <button
              className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}

          <ul className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            {/* Common links - only show when not authenticated */}
            {!isAuthenticated && (
              <li className="navbar-item">
                <Link to="/" className="navbar-link" onClick={closeMobileMenu}>
                  Home
                </Link>
              </li>
            )}

            {/* Guest user links */}
            {!isAuthenticated && (
              <>
                {/* Login Dropdown */}
                <li
                  className="navbar-item dropdown"
                  onMouseEnter={() => setShowLoginDropdown(true)}
                  onMouseLeave={() => setShowLoginDropdown(false)}
                >
                  <button
                    className="navbar-link dropdown-btn"
                    onClick={() => {
                      setShowLoginDropdown(!showLoginDropdown);
                      setShowRegisterDropdown(false);
                    }}
                  >
                    Login
                  </button>
                  {showLoginDropdown && (
                    <div className="dropdown-menu">
                      <Link
                        to="/user/login"
                        className="dropdown-item"
                        onClick={closeMobileMenu}
                      >
                        User
                      </Link>
                      <Link
                        to="/recruiter/login"
                        className="dropdown-item"
                        onClick={closeMobileMenu}
                      >
                        Recruiter
                      </Link>
                      <Link
                        to="/admin/login"
                        className="dropdown-item"
                        onClick={closeMobileMenu}
                      >
                        Admin
                      </Link>
                    </div>
                  )}
                </li>

                {/* Register Dropdown */}
                <li
                  className="navbar-item dropdown"
                  onMouseEnter={() => setShowRegisterDropdown(true)}
                  onMouseLeave={() => setShowRegisterDropdown(false)}
                >
                  <button
                    className="navbar-link dropdown-btn"
                    onClick={() => {
                      setShowRegisterDropdown(!showRegisterDropdown);
                      setShowLoginDropdown(false);
                    }}
                  >
                    Register
                  </button>
                  {showRegisterDropdown && (
                    <div className="dropdown-menu">
                      <Link
                        to="/user/register"
                        className="dropdown-item"
                        onClick={closeMobileMenu}
                      >
                        User
                      </Link>
                      <Link
                        to="/recruiter/register"
                        className="dropdown-item"
                        onClick={closeMobileMenu}
                      >
                        Recruiter
                      </Link>
                    </div>
                  )}
                </li>
              </>
            )}

            {/* User authenticated links */}
            {isAuthenticated && userType === 'user' && (
              <>
              </>
            )}

            {/* Recruiter authenticated links */}
            {isAuthenticated && userType === 'recruiter' && (
              <>
              </>
            )}

            {/* Admin authenticated links - removed from navbar, use sidebar instead */}
          </ul>

          {/* Sidebar Toggle for authenticated users */}
          {isAuthenticated && showSidebarToggle && (
            <button
              className="sidebar-toggle-btn"
              onClick={onSidebarToggle}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
