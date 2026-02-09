# JobHuntting Website

A full-stack JobHuntting application built with React.js, Node.js, Express, and MongoDB Atlas.

## Features

- **Three User Types**: Admin, Recruiters, and Job Seekers
- **Admin Dashboard**: Manage jobs, companies, users, and approve/reject job postings
- **Recruiter Dashboard**: Post jobs, manage listings, and track approval status
- **User Features**: Browse jobs, apply for positions, manage profile
- **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop devices

## Tech Stack

**Frontend:**
- React.js 18.2
- React Router DOM 6.20
- Axios for API calls
- Professional Service Layer Architecture

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

## Project Structure

```
AiWebsite/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── middlewares/       # Authentication middleware
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Utility functions
│   │   └── server.js          # Entry point
│   ├── package.json
│   ├── .env.example           # Environment variables template
│   └── .gitignore
│
├── frontend/                   # Frontend React app
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── admin/         # Admin components
│   │   │   ├── recruiter/     # Recruiter components
│   │   │   ├── user/          # User components
│   │   │   └── common/        # Shared components
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── recruiter/     # Recruiter pages
│   │   │   └── user/          # User pages
│   │   ├── services/          # API service layer
│   │   │   ├── api.js         # Axios instance
│   │   │   ├── endpoints.js   # All API endpoints
│   │   │   ├── adminService.js
│   │   │   ├── recruiterService.js
│   │   │   ├── userService.js
│   │   │   └── jobService.js
│   │   ├── config/            # App configuration
│   │   │   └── apiConfig.js   # API base URL config
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.js
│   │   ├── styles/            # CSS files
│   │   ├── utils/             # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── project_flow/               # Project documentation
    ├── tables/                # Database schema docs
    ├── forms/                 # Form specifications
    └── queries/               # API endpoint docs
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from template:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from template:
```bash
cp .env.example .env
```

4. Update `.env` with your backend URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the frontend:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## How to Change API Base URL

The project uses a **professional service layer architecture** for centralized API management.

### Single Point of Change

To change the API base URL for the entire application:

**Option 1: Environment Variable (Recommended)**
```env
# frontend/.env
REACT_APP_API_URL=https://your-production-api.com/api
```

**Option 2: Configuration File**
```javascript
// frontend/src/config/apiConfig.js
export const API_CONFIG = {
  BASE_URL: 'https://your-production-api.com/api',
  TIMEOUT: 10000,
};
```

**That's it!** All API calls throughout the application will automatically use the new URL.

### Service Layer Benefits

✅ **Centralized**: Change base URL in ONE place
✅ **Reusable**: Services used across multiple components
✅ **Clean Code**: Components don't need to know API details
✅ **Easy Testing**: Mock services instead of axios calls
✅ **Professional**: Industry-standard architecture

### Using Services in Components

Instead of using axios directly, use service methods:

```javascript
// ❌ DON'T DO THIS
import axios from 'axios';
axios.post('http://localhost:5000/api/admin/login', data);

// ✅ DO THIS
import { adminService } from '../services';
adminService.login(email, password);
```

**Available Services:**
- `adminService` - Admin operations
- `recruiterService` - Recruiter operations
- `userService` - User operations
- `jobService` - Job operations

## API Documentation

All API endpoints and their usage are documented in:
- `project_flow/queries/admin-queries.txt`
- `project_flow/queries/recruiter-queries.txt`
- `project_flow/queries/user-queries.txt`
- `project_flow/queries/job-queries.txt`

## Database Schema

Database collections and field descriptions are in:
- `project_flow/tables/admin.txt`
- `project_flow/tables/recruiter.txt`
- `project_flow/tables/job.txt`
- `project_flow/tables/user.txt`

## User Roles & Access

### Admin
- Approve/reject job postings
- View all jobs, companies, and users
- Create new admin accounts
- Manage platform content

### Recruiter
- Post job listings (requires admin approval)
- Manage own job postings
- View dashboard statistics
- Update company profile

### Job Seeker (User)
- Browse approved jobs (guest access allowed)
- Apply for jobs (requires login)
- Manage profile
- View job details

## Development Guidelines

### Adding New API Endpoints

1. Add endpoint path to `frontend/src/services/endpoints.js`:
```javascript
ADMIN: {
  NEW_ENDPOINT: '/admin/new-feature',
}
```

2. Add service method to appropriate service file:
```javascript
// adminService.js
newFeature: async (data) => {
  const response = await api.post(ENDPOINTS.ADMIN.NEW_ENDPOINT, data);
  return response.data;
},
```

3. Use in components:
```javascript
import { adminService } from '../services';
const result = await adminService.newFeature(data);
```

## Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Update `FRONTEND_URL` to your production frontend URL
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Update `REACT_APP_API_URL` to your production backend URL
2. Run `npm run build`
3. Deploy build folder to Netlify, Vercel, or AWS S3

### Environment Variables for Production

**Backend (.env):**
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=strong_random_secret_key
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend (.env.production):**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes with middleware
- CORS configuration
- Input validation
- Token expiration handling

## Contributing

1. Follow the existing folder structure
2. Use the service layer for all API calls
3. Document new features in `project_flow/` directory
4. Test on mobile and desktop before committing

## License

MIT License

## Support

For issues and questions, please refer to the documentation in the `project_flow/` directory.
