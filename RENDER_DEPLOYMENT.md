# Zerodha Render Deployment Guide

Your project is now configured for monolithic deployment on Render! Follow these steps:

## What I've Setup For You ✅

1. **Backend Package.json** - Updated with build and start scripts
2. **Backend Static Serving** - Configured to serve frontend + dashboard
3. **render.yaml** - Deployment configuration file
4. **Path Module** - Added to backend for file serving

## Before Deploying

### Step 1: Build Frontend & Dashboard Locally

```bash
# In project root
npm run build --prefix frontend
npm run build --prefix dashboard
```

This creates:
- `frontend/dist/` - Landing page
- `dashboard/dist/` - Trading dashboard

### Step 2: Update Environment Variables

**dashboard/.env** - Change this line:
```
VITE_API_URL=https://your-render-app-name.onrender.com
```
(Replace `your-render-app-name` with your actual Render app name)

**frontend/.env.local** - Change this line:
```
VITE_API_URL=https://your-render-app-name.onrender.com
```

### Step 3: Rebuild After Env Changes

```bash
npm run build --prefix frontend
npm run build --prefix dashboard
```

## Deploy on Render

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Setup for Render deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up or log in
3. Connect your GitHub account

### Step 3: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Select your **Zerodha repository**
3. Fill in the details:

| Field | Value |
|-------|-------|
| Name | `zerodha-app` |
| Environment | `Node` |
| Build Command | `npm install --prefix frontend && npm install --prefix dashboard && npm install --prefix backend && npm run build --prefix backend` |
| Start Command | `npm start --prefix backend` |
| Plan | Free |

### Step 4: Add Environment Variables

In Render dashboard, go to **Environment**:

```
NODE_ENV=production
PORT=10000
MONGO_URL=mongodb+srv://samubeen:mubeen786@cluster0.ihoyisi.mongodb.net/zerodha?retryWrites=true&w=majority
JWT_SECRET=zerodha_jwt_secret_key_2024
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will start building automatically
3. Monitor in the **Logs** tab

**Build will take 5-10 minutes** (first time installs all dependencies)

### Step 6: Update API URLs

Once deployed, your app will be at: `https://zerodha-app.onrender.com`

Update your local .env files:
```
VITE_API_URL=https://zerodha-app.onrender.com
```

Rebuild locally:
```bash
npm run build --prefix frontend
npm run build --prefix dashboard
git add .
git commit -m "Update API URLs to production"
git push origin main
```

Render will auto-redeploy.

## What Gets Deployed

```
Backend (Node.js) - Serves everything
  ├── API Routes (/api/*)
  ├── Socket.io Real-time
  ├── dashboard/dist/ - Trading Platform
  ├── frontend/dist/ - Landing Page
  └── MongoDB Atlas Connection
```

## Accessing Your App

- **Main App**: https://zerodha-app.onrender.com
- **API**: https://zerodha-app.onrender.com/api/*
- **Dashboard**: https://zerodha-app.onrender.com (when logged in)

## Troubleshooting

### Build Fails
- Check Logs tab for errors
- Ensure all .env variables are set
- Verify MongoDB Atlas allows connections from Render IPs

### App Shows 502 Error
- Wait 2-3 minutes (Render needs time to start)
- Check Logs for MongoDB connection errors
- Verify MONGO_URL is correct

### API Calls Fail
- Ensure frontend/dashboard .env has correct VITE_API_URL
- Rebuild and push changes
- Clear browser cache (Ctrl+Shift+Delete)

### Real-time Updates Not Working
- Socket.io should work automatically on Render
- Check browser console for connection errors
- Verify CORS is enabled in backend

## Future Updates

Every time you push to main:

```bash
git add .
git commit -m "Your message"
git push origin main
```

Render automatically redeploys! ✨

## File Structure After Deployment

```
Zerodha (GitHub)
├── backend/
│   ├── index.js (serves static files)
│   └── package.json (build + start scripts)
├── frontend/
│   ├── dist/ (built landing page)
│   └── src/
├── dashboard/
│   ├── dist/ (built trading app)
│   └── src/
└── render.yaml (deployment config)
```

## Important Notes

⚠️ **Free Plan Limitations:**
- App spins down after 15 minutes of inactivity
- First request after spin-down takes 30 seconds
- Limited to 0.5GB RAM
- Upgrade to Pro for 24/7 availability

✅ **For Production:**
Consider upgrading to Render Pro ($7/month) for:
- Always-on service
- Better performance
- Priority support

---

**Questions?** Check Render docs: https://render.com/docs
