import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import '../../styles/ListPage.css';
import '../../styles/Dashboard.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const navigate = useNavigate();
  const { logout } = useAuth();

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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading users..." />;

  return (
    <>
      <Navbar onSidebarToggle={toggleSidebar} showSidebarToggle={true} />
      <Sidebar links={sidebarLinks} userType="Admin" isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className={`dashboard-layout ${isSidebarOpen ? 'with-sidebar' : ''}`}>
        <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Registered Users</h1>
          <p className="subtitle">All job seekers registered on the platform</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.contactno}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !loading && (
          <div className="empty-state">
            <p>No users registered yet</p>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default UserList;
