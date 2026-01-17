const Recruiter = require('../models/Recruiter');
const Job = require('../models/Job');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const { generateOTP, sendOTPEmail, sendPasswordResetSuccessEmail, sendEmailVerificationOTP } = require('../utils/emailService');

// Recruiter Registration
exports.registerRecruiter = async (req, res) => {
  try {
    const { name, email, password, contactno, address } = req.body;

    console.log('=== RECRUITER REGISTRATION ===');
    console.log('Email:', email);

    if (!name || !email || !password || !contactno) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const existingRecruiter = await Recruiter.findOne({ email });

    if (existingRecruiter) {
      return res.status(400).json({
        success: false,
        message: 'Recruiter with this email already exists'
      });
    }

    // Generate OTP for email verification
    const otp = generateOTP();
    console.log('Generated OTP:', otp);

    // Hash OTP before storing
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    const recruiter = await Recruiter.create({
      name,
      email,
      password,
      contactno,
      address,
      emailVerificationOTP: hashedOTP,
      emailVerificationOTPExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
      isEmailVerified: false
    });

    // Send verification OTP email
    try {
      await sendEmailVerificationOTP(email, otp, name);

      res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email for verification OTP.',
        requiresVerification: true,
        email: recruiter.email
      });
    } catch (emailError) {
      // If email fails, delete the recruiter account
      await Recruiter.findByIdAndDelete(recruiter._id);

      console.error('Email sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Verify Email OTP (after registration)
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log('=== EMAIL VERIFICATION ===');
    console.log('Email:', email);
    console.log('OTP:', otp);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP'
      });
    }

    const recruiter = await Recruiter.findOne({ email }).select('+emailVerificationOTP +emailVerificationOTPExpires');

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }

    if (recruiter.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified. Please login.'
      });
    }

    if (!recruiter.emailVerificationOTP) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      });
    }

    // Check if OTP has expired
    if (Date.now() > recruiter.emailVerificationOTPExpires) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    const isOTPValid = await bcrypt.compare(otp, recruiter.emailVerificationOTP);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }

    // Mark email as verified
    recruiter.isEmailVerified = true;
    recruiter.emailVerificationOTP = undefined;
    recruiter.emailVerificationOTPExpires = undefined;
    await recruiter.save();

    console.log('Email verified successfully for:', email);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now login.'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Resend Email Verification OTP
exports.resendEmailVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;

    console.log('=== RESEND VERIFICATION OTP ===');
    console.log('Email:', email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      });
    }

    const recruiter = await Recruiter.findOne({ email }).select('+emailVerificationOTP +emailVerificationOTPExpires');

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }

    if (recruiter.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified. Please login.'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    console.log('New OTP generated:', otp);

    // Hash OTP before storing
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    // Update OTP and expiration
    recruiter.emailVerificationOTP = hashedOTP;
    recruiter.emailVerificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await recruiter.save();

    // Send verification OTP email
    try {
      await sendEmailVerificationOTP(email, otp, recruiter.name);

      res.status(200).json({
        success: true,
        message: 'Verification OTP sent to your email successfully'
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Recruiter Login
exports.loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const recruiter = await Recruiter.findOne({ email }).select('+password');

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }

    // Check if email is verified
    if (!recruiter.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in. Check your inbox for the verification OTP.',
        requiresVerification: true,
        email: recruiter.email
      });
    }

    const isPasswordValid = await recruiter.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    const token = generateToken(recruiter._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      recruiter: {
        _id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        contactno: recruiter.contactno,
        address: recruiter.address
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

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ postedBy: req.recruiterId });
    const pendingJobs = await Job.countDocuments({ postedBy: req.recruiterId, status: 'pending' });
    const approvedJobs = await Job.countDocuments({ postedBy: req.recruiterId, status: 'approved' });
    const rejectedJobs = await Job.countDocuments({ postedBy: req.recruiterId, status: 'rejected' });

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        pendingJobs,
        approvedJobs,
        rejectedJobs
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

// Get My Jobs
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.recruiterId })
      .sort({ jobposteddate: -1 });

    res.status(200).json({
      success: true,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, contactno, address } = req.body;

    const recruiter = await Recruiter.findByIdAndUpdate(
      req.recruiterId,
      { name, contactno, address },
      { new: true, runValidators: true }
    );

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      recruiter: {
        _id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        contactno: recruiter.contactno,
        address: recruiter.address
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

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const recruiter = await Recruiter.findById(req.recruiterId).select('+password');

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }

    const isPasswordValid = await recruiter.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    recruiter.password = newPassword;
    await recruiter.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Forgot Password - Request OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log('=== FORGOT PASSWORD DEBUG ===');
    console.log('Email requested:', email);
    console.log('EMAIL_USER env:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS configured:', process.env.EMAIL_PASS ? 'Yes' : 'No');
    console.log('EMAIL_PASS value:', process.env.EMAIL_PASS);
    console.log('============================');

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      });
    }

    const recruiter = await Recruiter.findOne({ email }).select('+resetPasswordOTP +resetPasswordOTPExpires');

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter with this email does not exist'
      });
    }

    console.log('Recruiter found:', recruiter.name);

    // Generate OTP
    const otp = generateOTP();
    console.log('OTP generated:', otp);

    // Hash OTP before storing
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    // Store hashed OTP and expiration time (10 minutes)
    recruiter.resetPasswordOTP = hashedOTP;
    recruiter.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await recruiter.save();

    console.log('OTP saved to database');

    // Send OTP email
    try {
      console.log('Attempting to send email...');
      await sendOTPEmail(email, otp, recruiter.name);

      res.status(200).json({
        success: true,
        message: 'OTP sent to your email successfully'
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      console.error('Error details:', emailError.message);
      console.error('Error stack:', emailError.stack);

      // Clear OTP if email sending fails
      recruiter.resetPasswordOTP = undefined;
      recruiter.resetPasswordOTPExpires = undefined;
      await recruiter.save();

      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP'
      });
    }

    const recruiter = await Recruiter.findOne({ email }).select('+resetPasswordOTP +resetPasswordOTPExpires');

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }

    if (!recruiter.resetPasswordOTP || !recruiter.resetPasswordOTPExpires) {
      return res.status(400).json({
        success: false,
        message: 'No OTP request found. Please request a new OTP.'
      });
    }

    // Check if OTP has expired
    if (Date.now() > recruiter.resetPasswordOTPExpires) {
      recruiter.resetPasswordOTP = undefined;
      recruiter.resetPasswordOTPExpires = undefined;
      await recruiter.save();

      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    const isOTPValid = await bcrypt.compare(otp, recruiter.resetPasswordOTP);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, OTP, and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const recruiter = await Recruiter.findOne({ email }).select('+resetPasswordOTP +resetPasswordOTPExpires +password');

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }

    if (!recruiter.resetPasswordOTP || !recruiter.resetPasswordOTPExpires) {
      return res.status(400).json({
        success: false,
        message: 'No OTP request found. Please request a new OTP.'
      });
    }

    // Check if OTP has expired
    if (Date.now() > recruiter.resetPasswordOTPExpires) {
      recruiter.resetPasswordOTP = undefined;
      recruiter.resetPasswordOTPExpires = undefined;
      await recruiter.save();

      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    const isOTPValid = await bcrypt.compare(otp, recruiter.resetPasswordOTP);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }

    // Reset password
    recruiter.password = newPassword;
    recruiter.resetPasswordOTP = undefined;
    recruiter.resetPasswordOTPExpires = undefined;
    await recruiter.save();

    // Send success email
    try {
      await sendPasswordResetSuccessEmail(email, recruiter.name);
    } catch (emailError) {
      console.error('Failed to send success email:', emailError);
      // Don't fail the request if success email fails
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
