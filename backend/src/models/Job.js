const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobtitle: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true
  },
  experience: {
    type: String,
    required: [true, 'Please provide experience requirement'],
    trim: true
  },
  jobdescription: {
    type: String,
    required: [true, 'Please provide job description'],
    trim: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'postedByRole',
    required: true
  },
  postedByRole: {
    type: String,
    required: true,
    enum: ['Recruiter', 'Admin']
  },
  location: {
    type: String,
    required: [true, 'Please provide job location'],
    trim: true
  },
  salary: {
    type: String,
    required: [true, 'Please provide salary information'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select job category'],
    enum: ['Private', 'Government', 'Internship']
  },
  companyName: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true
  },
  jobposteddate: {
    type: Date,
    default: Date.now
  },
  link: {
    type: String,
    required: [true, 'Please provide application link'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

// Index for better query performance
jobSchema.index({ status: 1, jobposteddate: -1 });
jobSchema.index({ category: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ postedBy: 1 });

module.exports = mongoose.model('Job', jobSchema);
