# Render Deployment Setup Guide

## Important: Environment Variables for Render

Since `.env` files are NOT pushed to GitHub (they're in `.gitignore`), you MUST manually configure environment variables on Render.

---

## Backend Environment Variables on Render

Go to your backend service on Render → **Environment** tab → Add these variables:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://Jobdhundo:Jobdhundo%401234@jobdundho.ozqwu6u.mongodb.net/jobportal?retryWrites=true&w=majority
JWT_SECRET=jobhuntting_super_secret_key_123
JWT_EXPIRE=7d
FRONTEND_URL=https://jobhunt-frontend-qg6c.onrender.com
EMAIL_USER=tusharahire18182001@gmail.com
EMAIL_PASS=nzadzvjmjowjqfkp
```

**Note:** Replace `FRONTEND_URL` with your actual frontend Render URL.

---

## Frontend Environment Variables on Render

Go to your frontend service on Render → **Environment** tab → Add this variable:

```
REACT_APP_API_URL=https://jobhunt-backend-1hjr.onrender.com/api
```

**Note:** Replace with your actual backend Render URL.

---

## Deployment Steps

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Update for Render deployment"
git push origin main
```

### Step 2: Configure Render Services

1. **Backend Service:**
   - Go to Render Dashboard → Your Backend Service
   - Click "Environment" tab
   - Add all backend environment variables listed above
   - Click "Save Changes" (auto-deploys)

2. **Frontend Service:**
   - Go to Render Dashboard → Your Frontend Service
   - Click "Environment" tab
   - Add frontend environment variable listed above
   - Click "Save Changes" (auto-deploys)

### Step 3: Verify Deployment

Wait 5-10 minutes for deployment to complete, then test:

1. Visit your frontend URL
2. Try user/recruiter login
3. Test forgot password flow
4. Check if API calls work

---

## Troubleshooting

### Issue: 404 Errors on API Calls

**Solution:** Check CORS configuration
- Ensure `FRONTEND_URL` on backend matches your frontend URL exactly
- Ensure `REACT_APP_API_URL` on frontend matches your backend URL exactly

### Issue: Email OTP Not Sending

**Solution:**
- Verify `EMAIL_USER` and `EMAIL_PASS` are set correctly on Render
- Check backend logs for email errors

### Issue: Database Connection Failed

**Solution:**
- Verify `MONGODB_URI` is correct
- Check if MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

---

## Local Development

For local development, use the `.env` files in your project:

**Backend `.env`:**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://Jobdhundo:Jobdhundo%401234@jobdundho.ozqwu6u.mongodb.net/jobportal?retryWrites=true&w=majority
JWT_SECRET=jobhuntting_super_secret_key_123
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
EMAIL_USER=tusharahire18182001@gmail.com
EMAIL_PASS=nzadzvjmjowjqfkp
```

**Frontend `.env`:**
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Security Notes

- ✅ `.env` files are in `.gitignore` and will NOT be pushed to GitHub
- ✅ Sensitive credentials are only stored on Render
- ⚠️ Never commit `.env` files to GitHub
- ⚠️ Always use environment variables on hosting platforms
