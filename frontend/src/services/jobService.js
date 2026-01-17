import api from './api';
import ENDPOINTS from './endpoints';

const jobService = {
  // ==================== PUBLIC ENDPOINTS ====================

  // Get All Approved Jobs with filters and pagination
  getAllJobs: async (filters = {}) => {
    const { location, category, search, page = 1, limit = 20 } = filters;
    const response = await api.get(ENDPOINTS.JOBS.GET_ALL, {
      params: { location, category, search, page, limit }
    });
    return response.data;
  },

  // Get Single Job by ID
  getJobById: async (jobId) => {
    const response = await api.get(ENDPOINTS.JOBS.GET_BY_ID(jobId));
    return response.data;
  },

  // Get Latest Jobs
  getLatestJobs: async (limit = 10) => {
    const response = await api.get(ENDPOINTS.JOBS.GET_LATEST, {
      params: { limit }
    });
    return response.data;
  },

  // Get Jobs by Category
  getJobsByCategory: async (category, page = 1, limit = 20) => {
    const response = await api.get(ENDPOINTS.JOBS.GET_BY_CATEGORY(category), {
      params: { page, limit }
    });
    return response.data;
  },

  // Get All Available Locations
  getLocations: async () => {
    const response = await api.get(ENDPOINTS.JOBS.GET_LOCATIONS);
    return response.data;
  },

  // Get Category Statistics
  getCategoryStats: async () => {
    const response = await api.get(ENDPOINTS.JOBS.GET_CATEGORY_STATS);
    return response.data;
  },

  // ==================== RECRUITER PROTECTED ENDPOINTS ====================

  // Create New Job (Recruiter only)
  createJob: async (jobData) => {
    const response = await api.post(ENDPOINTS.JOBS.CREATE, jobData);
    return response.data;
  },

  // Update Job (Recruiter only)
  updateJob: async (jobId, jobData) => {
    const response = await api.put(ENDPOINTS.JOBS.UPDATE(jobId), jobData);
    return response.data;
  },

  // Delete Job (Recruiter only)
  deleteJob: async (jobId) => {
    const response = await api.delete(ENDPOINTS.JOBS.DELETE(jobId));
    return response.data;
  },
};

export default jobService;
