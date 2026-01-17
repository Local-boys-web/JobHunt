// Centralized API Endpoints - All API paths in one place for easy management

const ENDPOINTS = {
  // ==================== ADMIN ENDPOINTS ====================
  ADMIN: {
    LOGIN: '/admin/login',
    CREATE: '/admin/create',
    DASHBOARD: '/admin/dashboard',
    PROFILE: '/admin/profile',
    CHANGE_PASSWORD: '/admin/change-password',

    // Job Management
    POST_JOB: '/admin/jobs/create',
    PENDING_JOBS: '/admin/jobs/pending',
    ALL_JOBS: '/admin/jobs',
    APPROVE_JOB: (jobId) => `/admin/jobs/${jobId}/approve`,
    REJECT_JOB: (jobId) => `/admin/jobs/${jobId}/reject`,
    DELETE_JOB: (jobId) => `/admin/jobs/${jobId}`,

    // Company & User Management
    COMPANIES: '/admin/companies',
    USERS: '/admin/users',
  },

  // ==================== RECRUITER ENDPOINTS ====================
  RECRUITER: {
    REGISTER: '/recruiter/register',
    LOGIN: '/recruiter/login',
    DASHBOARD: '/recruiter/dashboard',
    MY_JOBS: '/recruiter/my-jobs',
    PROFILE: '/recruiter/profile',
    CHANGE_PASSWORD: '/recruiter/change-password',

    // Password Reset
    FORGOT_PASSWORD: '/recruiter/forgot-password',
    VERIFY_OTP: '/recruiter/verify-otp',
    RESET_PASSWORD: '/recruiter/reset-password',
  },

  // ==================== USER ENDPOINTS ====================
  USER: {
    REGISTER: '/user/register',
    LOGIN: '/user/login',
    PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    DELETE_ACCOUNT: '/user/delete',

    // Password Reset
    FORGOT_PASSWORD: '/user/forgot-password',
    VERIFY_OTP: '/user/verify-otp',
    RESET_PASSWORD: '/user/reset-password',
  },

  // ==================== JOB ENDPOINTS ====================
  JOBS: {
    // Public endpoints
    GET_ALL: '/jobs',
    GET_BY_ID: (jobId) => `/jobs/${jobId}`,
    GET_LATEST: '/jobs/latest',
    GET_BY_CATEGORY: (category) => `/jobs/category/${category}`,
    GET_LOCATIONS: '/jobs/filters/locations',
    GET_CATEGORY_STATS: '/jobs/stats/categories',

    // Protected endpoints (Recruiter)
    CREATE: '/jobs/create',
    UPDATE: (jobId) => `/jobs/${jobId}`,
    DELETE: (jobId) => `/jobs/${jobId}`,
  },

  // ==================== GENERAL ENDPOINTS ====================
  HEALTH: '/health',
};

export default ENDPOINTS;
