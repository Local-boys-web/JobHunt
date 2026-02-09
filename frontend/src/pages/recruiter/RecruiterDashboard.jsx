import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { recruiterService } from '../../services';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import '../../styles/Dashboard.css';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarLinks = [
    { path: '/recruiter/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/recruiter/post-job', label: 'Post Job', icon: '➕' },
    { path: '/recruiter/my-jobs', label: 'My Jobs', icon: '💼' },
    { path: '/recruiter/profile', label: 'Profile', icon: '👤' },
    { label: 'Logout', icon: '🚪', onClick: handleLogout },
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await recruiterService.getDashboardStats();
      setStats(data.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading dashboard..." />;

  return (
    <>
      <Navbar
        onSidebarToggle={toggleSidebar}
        showSidebarToggle={true}
      />
      <Sidebar
        links={sidebarLinks}
        userType="Recruiter"
        userName={user?.name}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />
      <div className={`dashboard-layout ${isSidebarOpen ? 'with-sidebar' : ''}`}>
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Recruiter Dashboard</h1>
          </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div className="stat-info">
                <h3>Total Jobs</h3>
                <p className="stat-value">{stats.totalJobs}</p>
              </div>
            </div>

            <div className="stat-card pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>Pending Jobs</h3>
                <p className="stat-value">{stats.pendingJobs}</p>
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-icon">✓</div>
              <div className="stat-info">
                <h3>Approved Jobs</h3>
                <p className="stat-value">{stats.approvedJobs}</p>
              </div>
            </div>

            <div className="stat-card rejected">
              <div className="stat-icon">✗</div>
              <div className="stat-info">
                <h3>Rejected Jobs</h3>
                <p className="stat-value">{stats.rejectedJobs}</p>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-info">
          <h2>Quick Actions</h2>
          <div className="action-cards">
            <div className="action-card" onClick={() => navigate('/recruiter/post-job')}>
              <span className="action-icon">➕</span>
              <span className="action-text">Post New Job</span>
            </div>
            <div className="action-card" onClick={() => navigate('/recruiter/my-jobs')}>
              <span className="action-icon">💼</span>
              <span className="action-text">View My Jobs</span>
            </div>
            <div className="action-card" onClick={() => navigate('/recruiter/profile')}>
              <span className="action-icon">👤</span>
              <span className="action-text">Update Profile</span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecruiterDashboard;
