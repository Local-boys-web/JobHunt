import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Alert from '../../components/common/Alert';
import '../../styles/Form.css';
import '../../styles/Dashboard.css';

const AdminPostJob = () => {
  const [formData, setFormData] = useState({
    jobtitle: '',
    experience: '',
    jobdescription: '',
    location: '',
    salary: '',
    category: '',
    companyName: '',
    link: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminService.postJob(formData);
      alert('Job posted successfully and is now live!');
      navigate('/admin/all-jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar
        onSidebarToggle={toggleSidebar}
        showSidebarToggle={true}
      />
      <Sidebar
        links={sidebarLinks}
        userType="Admin"
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />
      <div className={`dashboard-layout ${isSidebarOpen ? 'with-sidebar' : ''}`}>
        <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Post New Job</h1>
          <p className="subtitle">Create a new job posting (Auto-approved)</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="form-container">
          <form onSubmit={handleSubmit} className="data-form">
            <div className="form-group">
              <label htmlFor="jobtitle">Job Title *</label>
              <input
                type="text"
                id="jobtitle"
                name="jobtitle"
                value={formData.jobtitle}
                onChange={handleChange}
                placeholder="e.g., Software Developer"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="companyName">Company Name *</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g., Tech Solutions Pvt Ltd"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="experience">Experience Required *</label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g., 2+ years or Fresher"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Job Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Private">Private</option>
                  <option value="Government">Government</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="jobdescription">Job Description *</label>
              <textarea
                id="jobdescription"
                name="jobdescription"
                value={formData.jobdescription}
                onChange={handleChange}
                placeholder="Provide detailed job description..."
                rows="6"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Mumbai, Delhi"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="salary">Salary *</label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g., ₹50k/month"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="link">Application Link *</label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://your-company.com/apply"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Posting...' : 'Post Job'}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate('/admin/dashboard')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </>
  );
};

export default AdminPostJob;
