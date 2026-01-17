const Job = require('../models/Job');

// Create Job (by recruiter)
exports.createJob = async (req, res) => {
  try {
    const { jobtitle, experience, jobdescription, location, salary, category, companyName, link } = req.body;

    // Debug logging
    console.log('=== CREATE JOB DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Recruiter ID from token:', req.recruiterId);
    console.log('========================');

    if (!jobtitle || !experience || !jobdescription || !location || !salary || !category || !companyName || !link) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if recruiterId exists
    if (!req.recruiterId) {
      return res.status(401).json({
        success: false,
        message: 'Recruiter ID not found. Please login again.'
      });
    }

    const job = await Job.create({
      jobtitle,
      experience,
      jobdescription,
      postedBy: req.recruiterId,
      postedByRole: 'Recruiter',
      location,
      salary,
      category,
      companyName,
      link
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully. Waiting for admin approval.',
      job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get All Approved Jobs (Public)
exports.getAllApprovedJobs = async (req, res) => {
  try {
    const { location, category, search, page = 1, limit = 20 } = req.query;

    const query = { status: 'approved' };

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { jobtitle: { $regex: search, $options: 'i' } },
        { jobdescription: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .populate('postedBy', 'name companyName contactno')
      .sort({ jobposteddate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      jobs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get Single Job Details (Public)
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, status: 'approved' })
      .populate('postedBy', 'name companyName email contactno address');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get Jobs by Category (Public)
exports.getJobsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find({ status: 'approved', category })
      .populate('postedBy', 'name companyName contactno')
      .sort({ jobposteddate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments({ status: 'approved', category });

    res.status(200).json({
      success: true,
      category,
      jobs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get Latest Jobs (Public)
exports.getLatestJobs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const jobs = await Job.find({ status: 'approved' })
      .populate('postedBy', 'name companyName contactno')
      .sort({ jobposteddate: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      jobs,
      total: jobs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get Available Locations (Public)
exports.getLocations = async (req, res) => {
  try {
    const locations = await Job.distinct('location', { status: 'approved' });
    const sortedLocations = locations.sort();

    res.status(200).json({
      success: true,
      locations: sortedLocations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get Jobs Count by Category (Public)
exports.getCategoryStats = async (req, res) => {
  try {
    const privateCount = await Job.countDocuments({ status: 'approved', category: 'Private' });
    const governmentCount = await Job.countDocuments({ status: 'approved', category: 'Government' });
    const internshipCount = await Job.countDocuments({ status: 'approved', category: 'Internship' });

    res.status(200).json({
      success: true,
      stats: {
        Private: privateCount,
        Government: governmentCount,
        Internship: internshipCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update Job (by recruiter)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.recruiterId });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or unauthorized'
      });
    }

    const { jobtitle, experience, jobdescription, location, salary, category, link } = req.body;

    job.jobtitle = jobtitle || job.jobtitle;
    job.experience = experience || job.experience;
    job.jobdescription = jobdescription || job.jobdescription;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.category = category || job.category;
    job.link = link || job.link;
    job.status = 'pending'; // Reset to pending for re-approval

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job updated successfully. Pending admin approval.',
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete Job (by recruiter)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.jobId, postedBy: req.recruiterId });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
