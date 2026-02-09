import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import '../../styles/JobDetails.css';

const JobDetails = () => {
  const { jobId } = useParams();
  const { isAuthenticated, userType, logout, user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const data = await jobService.getJobById(jobId);
      setJob(data.job);
    } catch (err) {
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      alert('Please login as a job seeker to apply for jobs');
      navigate('/user/login');
      return;
    }

    if (userType !== 'user') {
      alert('Only job seekers can apply for jobs');
      return;
    }

    // Redirect to application link
    window.open(job.link, '_blank');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/user/profile', label: 'Profile', icon: '👤' },
    { label: 'Logout', icon: '🚪', onClick: handleLogout },
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Loading message="Loading job details..." />;

  if (error) {
    return (
      <>
        <Navbar
          onSidebarToggle={toggleSidebar}
          showSidebarToggle={isAuthenticated && userType === 'user'}
        />
        {isAuthenticated && userType === 'user' && (
          <Sidebar
            links={sidebarLinks}
            userType="User"
            userName={user?.name}
            isOpen={isSidebarOpen}
            onToggle={toggleSidebar}
          />
        )}
        <div className="container">
          <Alert type="error" message={error} />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar
        onSidebarToggle={toggleSidebar}
        showSidebarToggle={isAuthenticated && userType === 'user'}
      />
      {isAuthenticated && userType === 'user' && (
        <Sidebar
          links={sidebarLinks}
          userType="User"
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />
      )}
      <div className={`job-details-page ${isSidebarOpen ? 'with-sidebar' : ''}`}>
        <div className="container">
          <div className="job-details-container">
            <div className="job-header">
              <div className="job-title-section">
                <h1>{job.jobtitle}</h1>
                <span className={`job-category-badge ${job.category.toLowerCase()}`}>
                  {job.category}
                </span>
              </div>
              <h2 className="company-name">{job.companyName}</h2>
            </div>

            <div className="job-meta">
              <div className="meta-item">
                <span className="meta-label">Location:</span>
                <span className="meta-value">{job.location}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Experience:</span>
                <span className="meta-value">{job.experience}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Salary:</span>
                <span className="meta-value">{job.salary}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Posted:</span>
                <span className="meta-value">{formatDate(job.jobposteddate)}</span>
              </div>
            </div>

            <div className="job-description">
              <h3>Job Description</h3>
              <p>{job.jobdescription}</p>
            </div>

            <div className="company-details">
              <h3>Company Details</h3>
              <div className="company-info">
                <p><strong>Company:</strong> {job.companyName}</p>
                <p><strong>Email:</strong> {job.postedBy?.email}</p>
                {job.postedBy?.address && (
                  <p><strong>Address:</strong> {job.postedBy?.address}</p>
                )}
              </div>
            </div>

            <div className="job-actions">
              <button onClick={handleApply} className="apply-btn">
                Apply Now
              </button>
              <button onClick={() => navigate(-1)} className="back-btn">
                Back to Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobDetails;
