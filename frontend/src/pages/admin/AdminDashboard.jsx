import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import '../../styles/Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/post-job', label: 'Post Job', icon: '➕' },
    { path: '/admin/job-approval', label: 'Job Approval', icon: '✓' },
    { path: '/admin/all-jobs', label: 'All Jobs', icon: '💼' },
    { path: '/admin/companies', label: 'Companies', icon: '🏢' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/create-admin', label: 'Create Admin', icon: '➕' },
    { path: '/admin/profile', label: 'Profile', icon: '👤' },
    { label: 'Logout', icon: '🚪', onClick: handleLogout },
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
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
        userType="Admin"
        userName={user?.name}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />
      <div className={`dashboard-layout ${isSidebarOpen ? 'with-sidebar' : ''}`}>
        <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {stats && (
          <>
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
                <h3>Pending Approval</h3>
                <p className="stat-value">{stats.pendingJobs}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-info">
                <h3>Total Companies</h3>
                <p className="stat-value">{stats.totalCompanies}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>Total Users</h3>
                <p className="stat-value">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="visitor-stats">
            <h2>Visitor Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card visitor-card">
                <div className="stat-icon">🌍</div>
                <div className="stat-info">
                  <h3>Total Visitors</h3>
                  <p className="stat-value">{stats.totalVisitors || 0}</p>
                </div>
              </div>

              <div className="stat-card visitor-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>Today</h3>
                  <p className="stat-value">{stats.todayVisitors || 0}</p>
                </div>
              </div>

              <div className="stat-card visitor-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>This Week</h3>
                  <p className="stat-value">{stats.weekVisitors || 0}</p>
                </div>
              </div>

              <div className="stat-card visitor-card">
                <div className="stat-icon">📈</div>
                <div className="stat-info">
                  <h3>This Month</h3>
                  <p className="stat-value">{stats.monthVisitors || 0}</p>
                </div>
              </div>
            </div>
          </div>
          </>
        )}

        <div className="dashboard-info">
          <h2>Quick Actions</h2>
          <div className="action-cards">
            <Link to="/admin/post-job" className="action-card">
              <span className="action-icon">📝</span>
              <span className="action-text">Post Job</span>
            </Link>
            <Link to="/admin/job-approval" className="action-card">
              <span className="action-icon">✓</span>
              <span className="action-text">Approve Jobs</span>
            </Link>
            <Link to="/admin/all-jobs" className="action-card">
              <span className="action-icon">💼</span>
              <span className="action-text">Manage Jobs</span>
            </Link>
            <Link to="/admin/companies" className="action-card">
              <span className="action-icon">🏢</span>
              <span className="action-text">View Companies</span>
            </Link>
            <Link to="/admin/create-admin" className="action-card">
              <span className="action-icon">➕</span>
              <span className="action-text">Create Admin</span>
            </Link>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
