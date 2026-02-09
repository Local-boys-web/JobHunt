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
      from: `"JobHuntting" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - JobHuntting',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header {
              background-color: #2c3e50;
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              padding: 40px 30px;
            }
            .otp-box {
              background: #f8f9fa;
              border: 2px solid #2c3e50;
              border-radius: 6px;
              padding: 25px;
              text-align: center;
              margin: 30px 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: 700;
              color: #2c3e50;
              letter-spacing: 8px;
            }
            .info-text {
              color: #666;
              font-size: 14px;
              margin: 20px 0;
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background-color: #f8f9fa;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>JobHuntting</h1>
            </div>
            <div class="content">
              <h2 style="color: #2c3e50; margin-top: 0;">Password Reset Request</h2>
              <p>Hello ${name},</p>
              <p>We received a request to reset your password. Please use the verification code below:</p>

              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>

              <div class="info-text">
                <strong>Important Information:</strong><br>
                • This OTP is valid for 10 minutes<br>
                • Do not share this code with anyone<br>
                • If you didn't request this, please ignore this email
              </div>

              <p>Best regards,<br><strong>JobHuntting Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} JobHuntting. All rights reserved.</p>
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
      from: `"JobHuntting" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Successful - JobHuntting',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header {
              background-color: #27ae60;
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .success-icon {
              font-size: 60px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background-color: #f8f9fa;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>JobHuntting</h1>
            </div>
            <div class="content">
              <div class="success-icon">✅</div>
              <h2 style="color: #27ae60; margin-top: 0;">Password Reset Successful</h2>
              <p>Hello ${name},</p>
              <p>Your password has been successfully reset.</p>
              <p>You can now log in to your account using your new password.</p>
              <p>If you didn't make this change, please contact support immediately.</p>
              <p style="margin-top: 30px;">Best regards,<br><strong>JobHuntting Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} JobHuntting. All rights reserved.</p>
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
      from: `"JobHuntting" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - JobHuntting',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header {
              background-color: #3498db;
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              padding: 40px 30px;
            }
            .otp-box {
              background: #f8f9fa;
              border: 2px solid #3498db;
              border-radius: 6px;
              padding: 25px;
              text-align: center;
              margin: 30px 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: 700;
              color: #3498db;
              letter-spacing: 8px;
            }
            .info-text {
              color: #666;
              font-size: 14px;
              margin: 20px 0;
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background-color: #f8f9fa;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>JobHuntting</h1>
            </div>
            <div class="content">
              <h2 style="color: #3498db; margin-top: 0;">Welcome to JobHuntting!</h2>
              <p>Hello ${name},</p>
              <p>Thank you for registering. Please verify your email address using the code below:</p>

              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>

              <div class="info-text">
                <strong>Important Information:</strong><br>
                • This OTP is valid for 10 minutes<br>
                • Do not share this code with anyone<br>
                • If you didn't register, please ignore this email
              </div>

              <p>Once verified, you can start posting jobs and managing your recruitment process.</p>

              <p>Best regards,<br><strong>JobHuntting Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} JobHuntting. All rights reserved.</p>
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
