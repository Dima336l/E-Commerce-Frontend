# GitHub Pages Deployment Guide

This guide explains how to deploy the frontend to GitHub Pages.

## What's Been Configured

### 1. Frontend Configuration
- ✅ Updated `vite.config.js` with base URL: `/E-Commerce/`
- ✅ Updated `package.json` build script to use Vite
- ✅ Frontend already configured to use deployed backend in production

### 2. GitHub Actions Workflow
- ✅ Created `.github/workflows/deploy.yml` for automatic deployment
- ✅ Workflow builds the frontend and deploys to GitHub Pages
- ✅ Triggers on push to main branch (only when frontend files change)

## Deployment Steps

### Step 1: Enable GitHub Pages
1. Go to your GitHub repository: https://github.com/Dima336l/E-Commerce
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### Step 2: Push Changes
Commit and push the changes to trigger deployment:

```bash
cd frontend
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### Step 3: Monitor Deployment
1. Go to **Actions** tab in your GitHub repository
2. You should see a workflow run named "Deploy to GitHub Pages"
3. Wait for it to complete (usually takes 2-3 minutes)

### Step 4: Access Your Site
Once deployed, your frontend will be available at:
**https://dima336l.github.io/E-Commerce/**

## Configuration Details

### Backend Integration
The frontend is already configured to connect to your deployed backend:
- **Production**: `https://e-commerce-backend-w46y.onrender.com`
- **Development**: `http://localhost:3000`

### Build Process
The GitHub Actions workflow:
1. Checks out the code
2. Sets up Node.js 18
3. Installs frontend dependencies
4. Builds the Vue.js application with Vite
5. Deploys to GitHub Pages

### File Structure
```
frontend/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment workflow
├── vite.config.js         # Updated with base URL
├── package.json           # Updated build script
├── src/config.js          # API configuration
└── GITHUB_PAGES_DEPLOYMENT.md  # This guide
```

## Troubleshooting

### If Deployment Fails
1. Check the **Actions** tab for error messages
2. Common issues:
   - Node.js version conflicts
   - Missing dependencies
   - Build errors

### If Site Doesn't Load
1. Verify GitHub Pages is enabled
2. Check the base URL configuration
3. Ensure the workflow completed successfully

### Local Testing
To test the build locally:
```bash
npm run build
npm run preview
```

## Next Steps After Deployment

1. **Test the live site**: Visit https://dima336l.github.io/E-Commerce/
2. **Verify backend connection**: Test adding items to cart
3. **Check all functionality**: Browse lessons, add to cart, view cart
4. **Update any hardcoded URLs** if needed

## Automatic Updates

Every time you push changes to frontend files or the deployment workflow to the `main` branch, the site will automatically rebuild and deploy. No manual intervention needed!

## Support

If you encounter any issues:
1. Check GitHub Actions logs
2. Verify all configuration files
3. Test locally first with `npm run build`
