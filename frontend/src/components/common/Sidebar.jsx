import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/Sidebar.css';

const Sidebar = ({ links, userType, userName, isOpen, onToggle }) => {
  const location = useLocation();
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use external isOpen if provided, otherwise use internal state
  const sidebarOpen = isOpen !== undefined ? isOpen : internalIsOpen;

  const toggleSidebar = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const handleLinkClick = () => {
    // Close sidebar when a link is clicked (only on mobile)
    const isMobile = window.innerWidth <= 768;
    if (isMobile && onToggle && sidebarOpen) {
      onToggle(); // Only toggle if sidebar is currently open and on mobile
    } else if (isMobile && !onToggle) {
      setInternalIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>{userType} Panel</h2>
          {userName && (
            <p className="sidebar-welcome">Welcome, {userName}!</p>
          )}
        </div>
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {links.map((link, index) => (
              <li key={index} className="sidebar-item">
                {link.onClick ? (
                  <button
                    onClick={() => {
                      link.onClick();
                      handleLinkClick();
                    }}
                    className="sidebar-link"
                  >
                    <span className="sidebar-text">{link.label}</span>
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <span className="sidebar-text">{link.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
