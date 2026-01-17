import api from './api';
import ENDPOINTS from './endpoints';

const recruiterService = {
  // Recruiter Registration
  register: async (recruiterData) => {
    const response = await api.post(ENDPOINTS.RECRUITER.REGISTER, recruiterData);
    return response.data;
  },

  // Recruiter Login
  login: async (email, password) => {
    const response = await api.post(ENDPOINTS.RECRUITER.LOGIN, { email, password });
    return response.data;
  },

  // Get Dashboard Statistics
  getDashboardStats: async () => {
    const response = await api.get(ENDPOINTS.RECRUITER.DASHBOARD);
    return response.data;
  },

  // Get My Jobs
  getMyJobs: async () => {
    const response = await api.get(ENDPOINTS.RECRUITER.MY_JOBS);
    return response.data;
  },

  // Update Profile
  updateProfile: async (profileData) => {
    const response = await api.put(ENDPOINTS.RECRUITER.PROFILE, profileData);
    return response.data;
  },

  // Change Password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put(ENDPOINTS.RECRUITER.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Forgot Password - Request OTP
  forgotPassword: async (email) => {
    const response = await api.post(ENDPOINTS.RECRUITER.FORGOT_PASSWORD, { email });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    const response = await api.post(ENDPOINTS.RECRUITER.VERIFY_OTP, { email, otp });
    return response.data;
  },

  // Reset Password
  resetPassword: async (email, otp, newPassword) => {
    const response = await api.post(ENDPOINTS.RECRUITER.RESET_PASSWORD, {
      email,
      otp,
      newPassword
    });
    return response.data;
  },
};

export default recruiterService;
