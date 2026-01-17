import api from './api';
import ENDPOINTS from './endpoints';

const adminService = {
  // Admin Login
  login: async (email, password) => {
    const response = await api.post(ENDPOINTS.ADMIN.LOGIN, { email, password });
    return response.data;
  },

  // Create New Admin
  createAdmin: async (adminData) => {
    const response = await api.post(ENDPOINTS.ADMIN.CREATE, adminData);
    return response.data;
  },

  // Get Dashboard Statistics
  getDashboardStats: async () => {
    const response = await api.get(ENDPOINTS.ADMIN.DASHBOARD);
    return response.data;
  },

  // Post Job (Admin - Auto-Approved)
  postJob: async (jobData) => {
    const response = await api.post(ENDPOINTS.ADMIN.POST_JOB, jobData);
    return response.data;
  },

  // Get Pending Jobs for Approval
  getPendingJobs: async () => {
    const response = await api.get(ENDPOINTS.ADMIN.PENDING_JOBS);
    return response.data;
  },

  // Approve Job
  approveJob: async (jobId) => {
    const response = await api.put(ENDPOINTS.ADMIN.APPROVE_JOB(jobId));
    return response.data;
  },

  // Reject Job
  rejectJob: async (jobId) => {
    const response = await api.put(ENDPOINTS.ADMIN.REJECT_JOB(jobId));
    return response.data;
  },

  // Get All Jobs (with pagination)
  getAllJobs: async (page = 1, limit = 20) => {
    const response = await api.get(ENDPOINTS.ADMIN.ALL_JOBS, {
      params: { page, limit }
    });
    return response.data;
  },

  // Delete Job
  deleteJob: async (jobId) => {
    const response = await api.delete(ENDPOINTS.ADMIN.DELETE_JOB(jobId));
    return response.data;
  },

  // Get All Companies
  getAllCompanies: async () => {
    const response = await api.get(ENDPOINTS.ADMIN.COMPANIES);
    return response.data;
  },

  // Get All Users
  getAllUsers: async () => {
    const response = await api.get(ENDPOINTS.ADMIN.USERS);
    return response.data;
  },

  // Update Admin Profile
  updateProfile: async (profileData) => {
    const response = await api.put(ENDPOINTS.ADMIN.PROFILE, profileData);
    return response.data;
  },

  // Change Password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put(ENDPOINTS.ADMIN.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    });
    return response.data;
  },
};

export default adminService;
