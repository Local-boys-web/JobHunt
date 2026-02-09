# Gmail SMTP Setup Guide for Production

This guide will help you configure Gmail SMTP for sending OTP emails in your Job Portal application.

## Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/security
2. Under "Signing in to Google", click **"2-Step Verification"**
3. Follow the prompts to enable 2FA if not already enabled
   - You'll need your phone number for verification
   - Choose your preferred 2FA method (SMS, Google Authenticator, etc.)

## Step 2: Generate App Password

1. Visit: https://myaccount.google.com/apppasswords
2. Sign in with your Google account if prompted
3. **Select app:** Choose **"Mail"** from the dropdown
4. **Select device:** Choose **"Other (Custom name)"**
5. Type a custom name: **"Job Portal"** or **"Job Portal Backend"**
6. Click **"Generate"**

You'll see a 16-character password like: `abcd efgh ijkl mnop`

**IMPORTANT:**
- Copy this password immediately (you won't see it again!)
- Remove all spaces from the password
- Example: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

## Step 3: Update .env File

Open your `backend/.env` file and update these lines:

```env
# Email Configuration (Gmail SMTP)
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

Replace:
- `your-gmail-address@gmail.com` with your actual Gmail address
- `abcdefghijklmnop` with your actual 16-character app password (no spaces!)

**Example:**
```env
EMAIL_USER=tusharahire18182001@gmail.com
EMAIL_PASS=xyzabcdefghijklm
```

## Step 4: Restart Your Server

After updating the `.env` file, **RESTART** your backend server:

```bash
# Stop the current server (Ctrl+C)

# Start again
cd backend
npm start
```

## Step 5: Test Email Sending

1. Register a new recruiter account
2. Check your email inbox for the verification OTP

3. Emails will be sent from: "Job Portal <your-email@gmail.com>"

## Troubleshooting

### Error: "Username and Password not accepted"
- Make sure you're using the **App Password**, not your regular Gmail password
- Double-check there are no spaces in the password
- Ensure 2FA is enabled on your Google account

### Error: "Invalid login"
- Verify the EMAIL_USER is your full Gmail address
- Check that EMAIL_PASS is the 16-character app password

### Emails not arriving
- Check spam/junk folder
- Verify Gmail account is active and not suspended
- Make sure you restarted the server after updating .env

### "Less secure app access" error
- Use App Password instead (this guide)
- Don't enable "Less secure app access" (deprecated by Google)

## Security Notes

- **Never commit your .env file to Git**
- Keep your App Password secret
- If compromised, revoke the App Password and generate a new one
- Use different App Passwords for different applications

## For Production Deployment

When deploying to a hosting service (Heroku, AWS, DigitalOcean, etc.):

1. Set environment variables in your hosting platform's dashboard
2. Do NOT upload the .env file
3. Use the platform's environment variable settings:
   - `EMAIL_USER=your-gmail@gmail.com`
   - `EMAIL_PASS=your-app-password`

## Alternative Email Services

If you prefer not to use Gmail, you can use:
- **SendGrid** (recommended for production)
- **Mailgun**
- **AWS SES**
- **Postmark**

These services require different configuration. Contact support if needed.

## Support

If you encounter issues:
1. Check the backend console logs for detailed error messages
2. Verify all steps in this guide
3. Make sure your Gmail account is in good standing

---

**Last Updated:** January 2025
