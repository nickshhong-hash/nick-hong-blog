# Deployment Checklist

Use this checklist to ensure a smooth deployment to Netlify.

## Pre-Deployment

- [ ] All code committed to Git
- [ ] Tests passing (run `npm run build` locally)
- [ ] Environment variables documented
- [ ] Domain name registered (nickhong.com)
- [ ] GitHub repository created and pushed
- [ ] Supabase project set up with database tables

## Netlify Setup

- [ ] Netlify account created
- [ ] Repository connected to Netlify
- [ ] Build settings verified (auto-detected from netlify.toml)
- [ ] Initial deployment successful
- [ ] Environment variables added:
  - [ ] `PUBLIC_SUPABASE_URL`
  - [ ] `PUBLIC_SUPABASE_ANON_KEY`
- [ ] Site redeployed after adding env vars

## Domain Configuration

- [ ] Custom domain added (nickhong.com)
- [ ] DNS configured:
  - [ ] A record OR CNAME record added
  - [ ] www subdomain configured
- [ ] HTTPS/SSL enabled (automatic with Netlify)
- [ ] Domain propagated (check with `dig nickhong.com`)

## CMS Setup

- [ ] GitHub OAuth app created
  - [ ] Homepage URL: `https://nickhong.com`
  - [ ] Callback URL: `https://api.netlify.com/auth/done`
- [ ] OAuth provider configured in Netlify
- [ ] CMS accessible at `/admin`
- [ ] Successfully logged in via GitHub
- [ ] Test post created and published

## Post-Deployment Testing

- [ ] Homepage loads correctly
- [ ] Blog posts display properly
- [ ] Like button functional (Supabase integration)
- [ ] Reading time displays
- [ ] Social share buttons work
- [ ] CMS can create/edit/delete posts
- [ ] Images upload correctly
- [ ] RSS feed accessible (`/rss.xml`)
- [ ] Sitemap accessible (`/sitemap-index.xml`)
- [ ] Mobile responsive design verified

## Performance & SEO

- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Check page load times
- [ ] Verify meta tags (title, description, OG tags)
- [ ] Test social media sharing previews
- [ ] Verify Google Search Console integration (optional)

## Monitoring Setup

- [ ] Netlify deploy notifications configured
- [ ] Supabase monitoring dashboard reviewed
- [ ] Error tracking considered (Sentry, LogRocket, etc.)

## Documentation

- [ ] Team members informed of deployment
- [ ] Deployment guide shared (docs/DEPLOYMENT.md)
- [ ] Credentials stored securely (password manager)
- [ ] Rollback procedure understood

## Maintenance

- [ ] Calendar reminder for dependency updates (monthly)
- [ ] Backup strategy for content (Git-based, automatic)
- [ ] Domain renewal date noted
- [ ] Monitoring plan established

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build test
npm run build

# Preview production build
npm run preview

# Deploy (automatic via Git push)
git push origin master
```

## Need Help?

- Netlify Status: https://www.netlifystatus.com
- Astro Discord: https://astro.build/chat
- Supabase Support: https://supabase.com/support

## Notes

- Deployments typically take 2-3 minutes
- DNS changes can take up to 48 hours
- CMS commits directly to the `master` branch
- Each push triggers automatic redeployment
