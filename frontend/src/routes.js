import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import pages (these will be created next)
// Public pages
import HomePage from './pages/user/HomePage';
import JobDetails from './pages/user/JobDetails';
import UserLogin from './pages/user/UserLogin';
import UserRegister from './pages/user/UserRegister';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPostJob from './pages/admin/AdminPostJob';
import JobApproval from './pages/admin/JobApproval';
import AllJobs from './pages/admin/AllJobs';
import CompanyList from './pages/admin/CompanyList';
import UserList from './pages/admin/UserList';
import CreateAdmin from './pages/admin/CreateAdmin';
import AdminProfile from './pages/admin/AdminProfile';

// Recruiter pages
import RecruiterLogin from './pages/recruiter/RecruiterLogin';
import RecruiterRegister from './pages/recruiter/RecruiterRegister';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJob from './pages/recruiter/PostJob';
import MyJobs from './pages/recruiter/MyJobs';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';

// User pages
import UserProfile from './pages/user/UserProfile';
import UserForgotPassword from './pages/user/ForgotPassword';
import UserVerifyOTP from './pages/user/VerifyOTP';
import UserResetPassword from './pages/user/ResetPassword';

// Recruiter password reset pages
import RecruiterForgotPassword from './pages/recruiter/ForgotPassword';
import RecruiterVerifyOTP from './pages/recruiter/VerifyOTP';
import RecruiterResetPassword from './pages/recruiter/ResetPassword';

// Protected Route Components
const ProtectedRoute = ({ children, allowedUserType }) => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedUserType && userType !== allowedUserType) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/job/:jobId" element={<JobDetails />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />

      {/* User Password Reset Routes */}
      <Route path="/user/forgot-password" element={<UserForgotPassword />} />
      <Route path="/user/verify-otp" element={<UserVerifyOTP />} />
      <Route path="/user/reset-password" element={<UserResetPassword />} />

      {/* User Protected Routes */}
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute allowedUserType="user">
            <UserProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedUserType="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/post-job"
        element={
          <ProtectedRoute allowedUserType="admin">
            <AdminPostJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/job-approval"
        element={
          <ProtectedRoute allowedUserType="admin">
            <JobApproval />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/all-jobs"
        element={
          <ProtectedRoute allowedUserType="admin">
            <AllJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/companies"
        element={
          <ProtectedRoute allowedUserType="admin">
            <CompanyList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedUserType="admin">
            <UserList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create-admin"
        element={
          <ProtectedRoute allowedUserType="admin">
            <CreateAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedUserType="admin">
            <AdminProfile />
          </ProtectedRoute>
        }
      />

      {/* Recruiter Routes */}
      <Route path="/recruiter/login" element={<RecruiterLogin />} />
      <Route path="/recruiter/register" element={<RecruiterRegister />} />

      {/* Recruiter Password Reset Routes */}
      <Route path="/recruiter/forgot-password" element={<RecruiterForgotPassword />} />
      <Route path="/recruiter/verify-otp" element={<RecruiterVerifyOTP />} />
      <Route path="/recruiter/reset-password" element={<RecruiterResetPassword />} />
      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute allowedUserType="recruiter">
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/post-job"
        element={
          <ProtectedRoute allowedUserType="recruiter">
            <PostJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/my-jobs"
        element={
          <ProtectedRoute allowedUserType="recruiter">
            <MyJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/profile"
        element={
          <ProtectedRoute allowedUserType="recruiter">
            <RecruiterProfile />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
