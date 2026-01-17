# Service Layer Architecture - Quick Reference Guide

## What is the Service Layer?

The service layer is a **professional design pattern** that centralizes all API calls in one place, making your code cleaner, more maintainable, and easier to update.

## How to Change Base URL

### ✅ CORRECT WAY - Change in ONE Place

**Step 1:** Open the configuration file:
```
frontend/src/config/apiConfig.js
```

**Step 2:** Update the BASE_URL:
```javascript
export const API_CONFIG = {
  BASE_URL: 'https://your-new-api-url.com/api',  // ← Change here only!
  TIMEOUT: 10000,
};
```

**That's it!** All 50+ API calls in your entire application will now use the new URL automatically.

---

## How to Use Services in Your Components

### ❌ OLD WAY (Don't do this)
```javascript
import axios from 'axios';

// Login component
const handleLogin = async () => {
  const response = await axios.post('http://localhost:5000/api/admin/login', {
    email,
    password
  });
};
```

**Problems:**
- URL hardcoded everywhere
- Need to update 50+ places to change URL
- Components know too much about API details
- Hard to test

### ✅ NEW WAY (Professional approach)
```javascript
import { adminService } from '../services';

// Login component
const handleLogin = async () => {
  const response = await adminService.login(email, password);
};
```

**Benefits:**
- ✅ Clean and simple
- ✅ Change URL in one place
- ✅ Easy to test
- ✅ Industry standard

---

## Complete Service Reference

### Admin Service
```javascript
import { adminService } from '../services';

// Login
await adminService.login(email, password);

// Create Admin
await adminService.createAdmin({ name, email, password });

// Dashboard Stats
await adminService.getDashboardStats();

// Pending Jobs
await adminService.getPendingJobs();

// Approve Job
await adminService.approveJob(jobId);

// Reject Job
await adminService.rejectJob(jobId);

// Get All Jobs
await adminService.getAllJobs(page, limit);

// Delete Job
await adminService.deleteJob(jobId);

// Get Companies
await adminService.getAllCompanies();

// Get Users
await adminService.getAllUsers();

// Update Profile
await adminService.updateProfile({ name, email });

// Change Password
await adminService.changePassword(currentPassword, newPassword);
```

### Recruiter Service
```javascript
import { recruiterService } from '../services';

// Register
await recruiterService.register({ name, email, password, contactno, address });

// Login
await recruiterService.login(email, password);

// Dashboard Stats
await recruiterService.getDashboardStats();

// My Jobs
await recruiterService.getMyJobs();

// Update Profile
await recruiterService.updateProfile({ name, contactno, address });

// Change Password
await recruiterService.changePassword(currentPassword, newPassword);
```

### User Service
```javascript
import { userService } from '../services';

// Register
await userService.register({ name, email, password, contactno });

// Login
await userService.login(email, password);

// Get Profile
await userService.getProfile();

// Update Profile
await userService.updateProfile({ name, email, contactno });

// Change Password
await userService.changePassword(currentPassword, newPassword);

// Delete Account
await userService.deleteAccount();
```

### Job Service
```javascript
import { jobService } from '../services';

// Get All Jobs (with filters)
await jobService.getAllJobs({
  location: 'Mumbai',
  category: 'Private',
  search: 'developer',
  page: 1,
  limit: 20
});

// Get Job by ID
await jobService.getJobById(jobId);

// Get Latest Jobs
await jobService.getLatestJobs(10);

// Get Jobs by Category
await jobService.getJobsByCategory('Government', page, limit);

// Get Locations
await jobService.getLocations();

// Get Category Stats
await jobService.getCategoryStats();

// Create Job (Recruiter only)
await jobService.createJob({
  jobtitle,
  experience,
  jobdescription,
  location,
  salary,
  category,
  link
});

// Update Job (Recruiter only)
await jobService.updateJob(jobId, jobData);

// Delete Job (Recruiter only)
await jobService.deleteJob(jobId);
```

---

## Example: Login Component

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Call service method - clean and simple!
      const data = await adminService.login(email, password);

      // Handle success
      login(data.token, data.admin, 'admin');
      navigate('/admin/dashboard');
    } catch (err) {
      // Handle error
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

---

## Adding New Endpoints

If you need to add a new feature:

**Step 1:** Add endpoint to `services/endpoints.js`
```javascript
ADMIN: {
  LOGIN: '/admin/login',
  NEW_FEATURE: '/admin/new-feature',  // ← Add here
}
```

**Step 2:** Add method to `services/adminService.js`
```javascript
newFeature: async (data) => {
  const response = await api.post(ENDPOINTS.ADMIN.NEW_FEATURE, data);
  return response.data;
},
```

**Step 3:** Use in component
```javascript
import { adminService } from '../services';
await adminService.newFeature(data);
```

---

## File Structure

```
frontend/src/
├── config/
│   └── apiConfig.js          ← Change base URL here!
│
├── services/
│   ├── api.js                ← Axios instance with interceptors
│   ├── endpoints.js          ← All endpoint paths
│   ├── adminService.js       ← Admin API calls
│   ├── recruiterService.js   ← Recruiter API calls
│   ├── userService.js        ← User API calls
│   ├── jobService.js         ← Job API calls
│   └── index.js              ← Central export
│
└── components/
    └── YourComponent.jsx     ← Use services here
```

---

## Benefits Summary

| Feature | Without Service Layer | With Service Layer |
|---------|----------------------|-------------------|
| Change API URL | Update 50+ files | Update 1 file |
| Component Code | Long and messy | Clean and short |
| Testing | Hard | Easy |
| Reusability | Copy-paste code | Import service |
| Maintainability | Difficult | Simple |
| Professional | ❌ | ✅ |

---

## Environment Variables

### Development
```env
# frontend/.env
REACT_APP_API_URL=http://localhost:5000/api
```

### Production
```env
# frontend/.env.production
REACT_APP_API_URL=https://api.yoursite.com/api
```

The services will automatically use the correct URL based on the environment!

---

## Questions?

**Q: Do I need to change anything in components when changing the URL?**
A: No! Just update `config/apiConfig.js` and you're done.

**Q: Can I still use axios directly?**
A: You can, but it's not recommended. Use services for consistency.

**Q: How do I handle errors?**
A: Use try-catch blocks when calling service methods.

**Q: Is this industry standard?**
A: Yes! Used by companies like Netflix, Airbnb, and most professional teams.

---

**Remember:** Always use services, never hardcode URLs in components!
