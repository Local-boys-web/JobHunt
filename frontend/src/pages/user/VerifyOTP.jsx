import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { userService } from '../../services';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Alert from '../../components/common/Alert';
import '../../styles/Auth.css';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/user/forgot-password');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      await userService.verifyOTP(email, otp);
      setSuccess('OTP verified successfully!');

      // Redirect to reset password page
      setTimeout(() => {
        navigate('/user/reset-password', { state: { email, otp } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await userService.forgotPassword(email);
      setSuccess('New OTP sent to your email!');
      setTimeLeft(600); // Reset timer
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Verify OTP</h1>
            <p>Enter the 6-digit code sent to {email}</p>
          </div>

          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} />}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="otp">One-Time Password (OTP)</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                required
                disabled={loading}
                className="otp-input"
              />
              <small className="form-hint">
                {timeLeft > 0 ? (
                  <>OTP expires in: <strong>{formatTime(timeLeft)}</strong></>
                ) : (
                  <span className="text-danger">OTP expired. Please request a new one.</span>
                )}
              </small>
            </div>

            <button type="submit" className="btn-primary" disabled={loading || timeLeft === 0}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="resend-otp">
              <p>Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResendOTP}
                className="btn-link"
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </form>

          <div className="auth-links">
            <Link to="/user/forgot-password">Change Email</Link>
            <span>•</span>
            <Link to="/user/login">Back to Login</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VerifyOTP;
