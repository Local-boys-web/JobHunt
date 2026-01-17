const nodemailer = require('nodemailer');

// Create transporter with Gmail SMTP
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS in .env file');
  }

  if (process.env.EMAIL_USER === 'your-email@gmail.com' || process.env.EMAIL_PASS === 'your-16-character-app-password') {
    throw new Error('Please replace placeholder email credentials with actual Gmail credentials in .env file');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS  // Your Gmail app password
    }
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, name) => {
  // TEMPORARY: If email not configured, just log OTP to console for testing
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
    process.env.EMAIL_USER === 'your-email@gmail.com' ||
    process.env.EMAIL_PASS === 'your-16-character-app-password-here') {
    console.log('\n========================================');
    console.log('📧 EMAIL NOT CONFIGURED - CONSOLE OTP MODE');
    console.log('========================================');
    console.log(`📨 TO: ${email}`);
    console.log(`👤 NAME: ${name}`);
    console.log(`🔐 OTP: ${otp}`);
    console.log('⏰ EXPIRES: In 10 minutes');
    console.log('========================================\n');
    console.log('⚠️  To send real emails, configure EMAIL_USER and EMAIL_PASS in .env');
    console.log('    Visit: https://myaccount.google.com/apppasswords\n');

    // Return success for testing purposes
    return { success: true, messageId: 'console-mode' };
  }

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - Job Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 10px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .otp-box {
              background: #f0f0f0;
              border: 2px dashed #667eea;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 5px;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>We received a request to reset your password. Use the OTP below to reset your password:</p>

              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>

              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul style="margin: 10px 0;">
                  <li>This OTP is valid for <strong>10 minutes</strong></li>
                  <li>Do not share this OTP with anyone</li>
                  <li>If you didn't request this, please ignore this email</li>
                </ul>
              </div>

              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

              <p>Best regards,<br>Job Portal Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Job Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Send password reset success email
const sendPasswordResetSuccessEmail = async (email, name) => {
  // TEMPORARY: If email not configured, just log to console for testing
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
    process.env.EMAIL_USER === 'your-email@gmail.com' ||
    process.env.EMAIL_PASS === 'your-16-character-app-password-here') {
    console.log('\n========================================');
    console.log('✅ PASSWORD RESET SUCCESS - CONSOLE MODE');
    console.log('========================================');
    console.log(`📨 TO: ${email}`);
    console.log(`👤 NAME: ${name}`);
    console.log(`✔️  Password has been reset successfully!`);
    console.log('========================================\n');

    // Return success for testing purposes
    return { success: true, messageId: 'console-mode' };
  }

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Successful - Job Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 10px;
            }
            .header {
              background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .success-icon {
              font-size: 50px;
              text-align: center;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Successful</h1>
            </div>
            <div class="content">
              <div class="success-icon">✅</div>
              <p>Hello ${name},</p>
              <p>Your password has been successfully reset.</p>
              <p>You can now log in to your account using your new password.</p>
              <p>If you didn't make this change, please contact our support team immediately.</p>
              <p>Best regards,<br>Job Portal Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Job Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset success email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset success email:', error);
    // Don't throw error here, as password is already reset
    return { success: false, error: error.message };
  }
};

// Send Email Verification OTP (for registration)
const sendEmailVerificationOTP = async (email, otp, name) => {
  // TEMPORARY: If email not configured, just log OTP to console for testing
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
    process.env.EMAIL_USER === 'your-email@gmail.com' ||
    process.env.EMAIL_PASS === 'your-16-character-app-password-here') {
    console.log('\n========================================');
    console.log('📧 REGISTRATION OTP - CONSOLE MODE');
    console.log('========================================');
    console.log(`📨 TO: ${email}`);
    console.log(`👤 NAME: ${name}`);
    console.log(`🔐 VERIFICATION OTP: ${otp}`);
    console.log('⏰ EXPIRES: In 10 minutes');
    console.log('========================================\n');
    console.log('⚠️  To send real emails, configure EMAIL_USER and EMAIL_PASS in .env');
    console.log('    Visit: https://myaccount.google.com/apppasswords\n');

    // Return success for testing purposes
    return { success: true, messageId: 'console-mode' };
  }

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - Job Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 10px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .otp-box {
              background: #f0f0f0;
              border: 2px dashed #667eea;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 5px;
            }
            .warning {
              background: #e7f3ff;
              border-left: 4px solid #2196F3;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Job Portal!</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>Thank you for registering with Job Portal. Please verify your email address to complete your registration.</p>

              <div class="otp-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Your Verification Code</p>
                <div class="otp-code">${otp}</div>
              </div>

              <div class="warning">
                <strong>ℹ️ Important:</strong>
                <ul style="margin: 10px 0;">
                  <li>This OTP is valid for <strong>10 minutes</strong></li>
                  <li>Do not share this OTP with anyone</li>
                  <li>If you didn't register, please ignore this email</li>
                </ul>
              </div>

              <p>Once verified, you'll be able to post jobs and manage your recruitment process.</p>

              <p>Best regards,<br>Job Portal Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Job Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email Verification OTP sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email verification OTP:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendPasswordResetSuccessEmail,
  sendEmailVerificationOTP
};
