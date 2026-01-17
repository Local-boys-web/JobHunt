// API Configuration - Change base URL here to update entire application
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://lastone-backend.onrender.com/api',
  TIMEOUT: 10000, // 10 seconds
};

// You can also add other configuration here
export const APP_CONFIG = {
  APP_NAME: 'Job Portal',
  ITEMS_PER_PAGE: 20,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};

export default API_CONFIG;
