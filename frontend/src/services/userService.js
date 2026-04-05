import api from './api';
import ENDPOINTS from './endpoints';

const userService = {
  // User Registration
  register: async (userData) => {
    const response = await api.post(ENDPOINTS.USER.REGISTER, userData);
    return response.data;
  },

  // User Login
  login: async (email, password) => {
    const response = await api.post(ENDPOINTS.USER.LOGIN, { email, password });
    return response.data;
  },

  // Get User Profile
  getProfile: async () => {
    const response = await api.get(ENDPOINTS.USER.PROFILE);
    return response.data;
  },

  // Update Profile
  updateProfile: async (profileData) => {
    const response = await api.put(ENDPOINTS.USER.PROFILE, profileData);
    return response.data;
  },

  // Change Password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put(ENDPOINTS.USER.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Delete Account
  deleteAccount: async () => {
    const response = await api.delete(ENDPOINTS.USER.DELETE_ACCOUNT);
    return response.data;
  },

  // Forgot Password - Request OTP
  forgotPassword: async (email) => {
    const response = await api.post(ENDPOINTS.USER.FORGOT_PASSWORD, { email });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    const response = await api.post(ENDPOINTS.USER.VERIFY_OTP, { email, otp });
    return response.data;
  },

  // Reset Password
  resetPassword: async (email, otp, newPassword) => {
    const response = await api.post(ENDPOINTS.USER.RESET_PASSWORD, {
      email,
      otp,
      newPassword
    });
    return response.data;
  },
};

export default userService;
