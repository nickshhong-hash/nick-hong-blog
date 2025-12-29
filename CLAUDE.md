# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Development workflow:
```bash
npm run dev        # Start dev server at localhost:4321
npm run build      # Build production site to ./dist/
npm run preview    # Preview production build locally
```

## Architecture

**Framework**: Astro 5 static site generator with MDX support

**Content System**:
- Blog posts live in `src/content/blog/` as Markdown/MDX files
- Each post has frontmatter (title, description, pubDate, heroImage)
- Posts are rendered via `src/pages/blog/[...slug].astro` using Astro's content collections
- Content is managed via Netlify CMS at `/admin` (config: `public/admin/config.yml`)
- RSS feed automatically generated at `/rss.xml` via @astrojs/rss
- Sitemap automatically generated at `/sitemap-index.xml` via @astrojs/sitemap

**CMS Authentication**:
- Uses GitHub OAuth backend (repo: nickshhong-hash/nick-hong-blog)
- Posts are committed directly to the `master` branch
- Media uploads stored in `public/uploads/`
- For local CMS testing, uncomment `local_backend: true` in `public/admin/config.yml`

**Database Integration**:
- Supabase client initialized in `src/lib/supabase.ts`
- Environment variables: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`
- Used for the like button feature (stores like counts in `post_likes` table)
- For detailed Supabase setup including SQL schema and RLS policies, see `docs/SUPABASE_SETUP.md`

**Key Components**:
- `LikeButton.astro`: Interactive like button with Supabase integration, uses localStorage to track user likes
- `ReadingTime.astro`: Calculates estimated reading time from post body
- `SocialShare.astro`: Social media sharing buttons
- `BlogPost.astro`: Main blog post layout that composes the above components

**Page Structure**:
- `src/pages/index.astro`: Homepage
- `src/pages/about.astro`: About page (editable via CMS)
- `src/pages/blog/index.astro`: Blog listing page
- `src/pages/blog/[...slug].astro`: Dynamic blog post pages

**Supabase Schema**:
- Table: `post_likes` with columns:
  - `post_slug` (text, primary key): URL slug of the blog post
  - `like_count` (integer): Number of likes, default 0
  - `created_at` (timestamp): Auto-set on creation
  - `updated_at` (timestamp): Auto-updated via trigger
- Row Level Security (RLS) policies allow public read/insert/update
- Like button auto-creates entries for new posts on first interaction

**Environment Setup**:
- Create `.env` file with Supabase credentials for like functionality
- Site URL configured in `astro.config.mjs` (currently: https://nickhong.com)

## Deployment Status

**Platform**: Netlify (already configured and deployed)
- Site is live and integrated with GitHub repository
- Environment variables (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`) are already configured in Netlify
- Auto-deploys on push to `master` branch
- Build configuration in `netlify.toml`
- Deployment guide available in `docs/DEPLOYMENT.md`

**Homepage Design**:
- Modern card-based layout with 3-column responsive grid
- "Browse Our Resources" hero section
- BlogCard component with hover effects, tags, and author info
- Navigation: Home and About (Blog link removed as redundant)

**Important Notes**:
- DO NOT recreate environment variables in Netlify - they already exist
- Site automatically redeploys when changes are pushed to GitHub
- CMS is accessible at `/admin` with GitHub OAuth authentication
