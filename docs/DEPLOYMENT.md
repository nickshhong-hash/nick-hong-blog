# Deployment Guide

This guide walks you through deploying Nick's Blog to Netlify.

## Prerequisites

- GitHub account with your repository pushed to GitHub
- Netlify account (free tier is sufficient)
- Domain name (nickhong.com) configured

## Step 1: Push to GitHub

Ensure all your changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin master
```

## Step 2: Connect to Netlify

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select your repository: `nickshhong-hash/nick-hong-blog`

## Step 3: Configure Build Settings

Netlify should auto-detect settings from `netlify.toml`, but verify:

- **Branch to deploy**: `master`
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 20 (set in netlify.toml)

Click "Deploy site"

## Step 4: Configure Environment Variables

After initial deployment, add your Supabase credentials:

1. In Netlify dashboard, go to: **Site settings** → **Environment variables**
2. Add the following variables:
   - `PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

3. Click "Save"
4. Trigger a new deployment: **Deploys** → **Trigger deploy** → **Deploy site**

## Step 5: Configure Custom Domain

### Using nickhong.com

1. In Netlify dashboard: **Domain settings** → **Add custom domain**
2. Enter `nickhong.com`
3. Follow Netlify's DNS configuration instructions:
   - If using Netlify DNS:
     - Update your domain registrar's nameservers to Netlify's nameservers
   - If using external DNS:
     - Add an A record pointing to Netlify's load balancer IP
     - Add a CNAME record for `www` pointing to your Netlify subdomain

4. Enable HTTPS (automatic with Let's Encrypt)

## Step 6: Configure GitHub OAuth for CMS

Your CMS is already configured for GitHub OAuth. To complete setup:

1. In GitHub, go to: **Settings** → **Developer settings** → **OAuth Apps**
2. Create a new OAuth App (if not already created):
   - **Application name**: Nick's Blog CMS
   - **Homepage URL**: `https://nickhong.com`
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
3. Copy the Client ID and Client Secret

4. In Netlify dashboard: **Site settings** → **Access control** → **OAuth**
5. Under "Authentication providers", click "Install provider"
6. Select "GitHub" and enter:
   - Client ID
   - Client Secret
7. Save

## Step 7: Test Your Deployment

1. Visit your site at `https://nickhong.com`
2. Test the CMS at `https://nickhong.com/admin`
3. Log in with your GitHub account
4. Create a test post to verify CMS functionality
5. Check that the like button works (Supabase integration)

## Continuous Deployment

Once set up, Netlify automatically deploys when you push to the `master` branch:

```bash
# Make changes locally
git add .
git commit -m "Update blog post"
git push origin master

# Netlify automatically builds and deploys
```

## Deploy Previews

Netlify creates preview deployments for:
- Pull requests (automatic preview URLs)
- Branch deployments (each branch gets its own URL)

This lets you test changes before merging to master.

## Monitoring

### Build Status
- Check build logs in Netlify dashboard: **Deploys** tab
- Failed builds will show error messages

### Performance
- Netlify Analytics (paid add-on) for visitor analytics
- Use Lighthouse in Chrome DevTools for performance audits

### Supabase Monitoring
- Monitor database usage in Supabase dashboard
- Check for any RLS policy issues

## Troubleshooting

### Build Fails
- Check Node version matches (20)
- Verify all dependencies in package.json
- Check build logs for specific errors

### CMS Login Issues
- Verify GitHub OAuth app callback URL
- Check Netlify OAuth provider configuration
- Ensure repository access is granted

### Environment Variables Not Working
- Prefix must be `PUBLIC_` for client-side access
- Redeploy after adding variables
- Clear browser cache

### Domain Not Resolving
- DNS changes can take up to 48 hours
- Verify DNS records with `dig nickhong.com`
- Check Netlify domain settings

## Rollback

To rollback to a previous deployment:
1. Go to **Deploys** tab
2. Find the working deployment
3. Click "..." → "Publish deploy"

## Resources

- [Netlify Documentation](https://docs.netlify.com)
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/netlify/)
- [Netlify CMS Documentation](https://www.netlifycms.org/docs/)
