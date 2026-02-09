import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Alert from '../../components/common/Alert';
import '../../styles/Form.css';

const PostJob = () => {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Submitting job with data:', formData);
      const response = await jobService.createJob(formData);
      console.log('Job created successfully:', response);
      alert('Job posted successfully! Waiting for admin approval.');
      navigate('/recruiter/my-jobs');
    } catch (err) {
      console.error('Error posting job:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to post job';
      setError(errorMessage);
      alert('Error: ' + errorMessage);
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
        userType="Recruiter"
        userName={user?.name}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />
      <div className={`dashboard-layout ${isSidebarOpen ? 'with-sidebar' : ''}`}>
        <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Post New Job</h1>
          <p className="subtitle">Create a new job posting for candidates</p>
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
                onClick={() => navigate('/recruiter/dashboard')}
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

export default PostJob;
