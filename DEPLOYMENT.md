# Deployment Checklist

## Pre-Deployment Checklist

✅ **Build Test** - Project builds successfully (`npm run build`)
✅ **Vercel Configuration** - `vercel.json` created with proper settings
✅ **Package.json** - Updated with metadata and correct scripts
✅ **Vite Config** - Optimized for production builds
✅ **Gitignore** - Properly configured to exclude node_modules and dist

## Steps to Deploy

### 1. Push to GitHub

```bash
git init  # If not already initialized
git add .
git commit -m "Initial commit: Inco Privacy Playground"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite configuration:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)
5. Click "Deploy"

### 3. Verify Deployment

- Check that the site loads correctly
- Test the form submission
- Verify all images load properly
- Test on mobile devices

## Build Output

The build creates optimized files in the `dist` folder:
- `index.html` - Main HTML file
- `assets/` - All CSS, JS, and image assets
- All files are minified and optimized for production

## Environment Variables

No environment variables are required for this project.

## Custom Domain (Optional)

After deployment, you can add a custom domain in Vercel settings.

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Run `npm install` locally to verify
- Check for any TypeScript or linting errors

### Images Not Loading
- Verify all images are in `src/asset/images/`
- Check that image imports use relative paths

### Routing Issues
- The `vercel.json` includes a rewrite rule for SPA routing
- All routes should redirect to `index.html`

## Support

For issues or questions, contact [sapiensp on Telegram](https://t.me/sapiensp)

