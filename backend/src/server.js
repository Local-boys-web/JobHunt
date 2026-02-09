const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDatabase = require('./config/database');
const trackVisitor = require('./middlewares/visitorTracker');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Visitor tracking middleware - Track all requests
app.use(trackVisitor);

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/recruiter', require('./routes/recruiterRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
