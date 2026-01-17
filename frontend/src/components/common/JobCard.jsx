import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/JobCard.css';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = () => {
    navigate(`/job/${job._id}`);
  };

  const handleShare = async (e) => {
    e.stopPropagation();

    const shareData = {
      title: job.jobtitle,
      text: `Check out this job: ${job.jobtitle} at ${job.companyName || 'Company'} - ${job.location}`,
      url: `${window.location.origin}/job/${job._id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3 className="job-title">{job.jobtitle}</h3>
        {job.category.toLowerCase() === 'internship' && (
          <span className={`job-category ${job.category.toLowerCase()}`}>
            {job.category}
          </span>
        )}
      </div>

      <div className="job-card-body">
        <div className="job-info">
          <span className="job-info-label">Company:</span>
          <span className="job-info-value">{job.companyName || 'N/A'}</span>
        </div>

        <div className="job-info">
          <span className="job-info-label">Location:</span>
          <span className="job-info-value">{job.location}</span>
        </div>

        <div className="job-info">
          <span className="job-info-label">Experience:</span>
          <span className="job-info-value">{job.experience}</span>
        </div>

        <div className="job-info">
          <span className="job-info-label">Salary:</span>
          <span className="job-info-value">{job.salary}</span>
        </div>

        <div className="job-info">
          <span className="job-info-label">Posted:</span>
          <span className="job-info-value">{formatDate(job.jobposteddate)}</span>
        </div>
      </div>

      <div className="job-card-footer">
        <button onClick={handleViewDetails} className="job-view-btn">
          View Details
        </button>
        <button onClick={handleShare} className="job-share-btn">
          Share
        </button>
      </div>
    </div>
  );
};

export default JobCard;
