import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { recruiterService } from '../../services';
import Navbar from '../../components/common/Navbar';
import Alert from '../../components/common/Alert';
import '../../styles/Login.css';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from location state (passed from registration page)
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !otp) {
      setError('Please provide email and OTP');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      await recruiterService.verifyEmail(email, otp);
      setSuccess('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/recruiter/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setError('Please provide your email address');
      return;
    }

    setResending(true);
    setError('');
    setSuccess('');

    try {
      await recruiterService.resendVerificationOTP(email);
      setSuccess('A new OTP has been sent to your email');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Navbar alwaysMobile={true} />
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Verify Your Email</h2>
          <p className="login-subtitle">
            We've sent a verification code to your email address
          </p>

          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="otp">Verification Code (OTP)</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength="6"
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Didn't receive the code?{' '}
              <button
                onClick={handleResendOTP}
                disabled={resending}
                className="link"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                {resending ? 'Sending...' : 'Resend OTP'}
              </button>
            </p>
            <Link to="/recruiter/login" className="back-link">Back to Login</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
