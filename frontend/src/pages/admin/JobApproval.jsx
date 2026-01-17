import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/Modal';
import '../../styles/JobApproval.css';
import '../../styles/Dashboard.css';

const JobApproval = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      const data = await adminService.getPendingJobs();
      setJobs(data.jobs);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pending jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleApprove = async (jobId) => {
    try {
      await adminService.approveJob(jobId);
      setSuccess('Job approved successfully!');
      setJobs(jobs.filter(job => job._id !== jobId));
      setIsModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve job');
    }
  };

  const handleReject = async (jobId) => {
    try {
      await adminService.rejectJob(jobId);
      setSuccess('Job rejected successfully!');
      setJobs(jobs.filter(job => job._id !== jobId));
      setIsModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject job');
    }
  };

  if (loading) return <Loading message="Loading pending jobs..." />;

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
          <h1>Job Approval</h1>
          <p className="subtitle">Review and approve pending job postings</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {jobs.length === 0 ? (
          <div className="empty-state">
            <p>No pending jobs for approval</p>
          </div>
        ) : (
          <div className="jobs-table-container">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Posted Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job._id}>
                    <td>{job.jobtitle}</td>
                    <td>{job.postedBy?.name || 'N/A'}</td>
                    <td>{job.location}</td>
                    <td>
                      <span className={`category-badge ${job.category.toLowerCase()}`}>
                        {job.category}
                      </span>
                    </td>
                    <td>{new Date(job.jobposteddate).toLocaleDateString()}</td>
                    <td className="action-buttons">
                      <button
                        onClick={() => handleViewJob(job)}
                        className="btn-view"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleApprove(job._id)}
                        className="btn-approve"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(job._id)}
                        className="btn-reject"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Job Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Job Details"
        >
          {selectedJob && (
            <div className="job-details">
              <div className="detail-row">
                <strong>Job Title:</strong>
                <span>{selectedJob.jobtitle}</span>
              </div>
              <div className="detail-row">
                <strong>Company:</strong>
                <span>{selectedJob.postedBy?.name}</span>
              </div>
              <div className="detail-row">
                <strong>Email:</strong>
                <span>{selectedJob.postedBy?.email}</span>
              </div>
              <div className="detail-row">
                <strong>Contact:</strong>
                <span>{selectedJob.postedBy?.contactno}</span>
              </div>
              <div className="detail-row">
                <strong>Location:</strong>
                <span>{selectedJob.location}</span>
              </div>
              <div className="detail-row">
                <strong>Experience:</strong>
                <span>{selectedJob.experience}</span>
              </div>
              <div className="detail-row">
                <strong>Salary:</strong>
                <span>{selectedJob.salary}</span>
              </div>
              <div className="detail-row">
                <strong>Category:</strong>
                <span>{selectedJob.category}</span>
              </div>
              <div className="detail-row">
                <strong>Application Link:</strong>
                <a href={selectedJob.link} target="_blank" rel="noopener noreferrer">
                  {selectedJob.link}
                </a>
              </div>
              <div className="detail-row full-width">
                <strong>Job Description:</strong>
                <p>{selectedJob.jobdescription}</p>
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => handleApprove(selectedJob._id)}
                  className="btn-approve"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedJob._id)}
                  className="btn-reject"
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </Modal>
        </div>
      </div>
    </>
  );
};

export default JobApproval;
