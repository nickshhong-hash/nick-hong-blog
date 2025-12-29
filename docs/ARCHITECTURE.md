# System Architecture

This document describes the technical architecture, data flow, and system design of Nick's Blog.

**Last Updated:** December 30, 2025
**Version:** 1.0

---

## Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Diagram](#architecture-diagram)
4. [Data Flow](#data-flow)
5. [Component Architecture](#component-architecture)
6. [Database Schema](#database-schema)
7. [Content Management](#content-management)
8. [Deployment Pipeline](#deployment-pipeline)
9. [Security Architecture](#security-architecture)
10. [Performance Considerations](#performance-considerations)

---

## High-Level Overview

**Type:** JAMstack static site
**Pattern:** Static Site Generation (SSG) with client-side interactivity
**Deployment:** Continuous deployment via Git push

### Key Characteristics

- **Static-First:** Pre-rendered HTML for optimal performance
- **Edge Delivery:** Served via CDN for global low latency
- **Progressive Enhancement:** Works without JavaScript, enhanced with JS
- **Git-Based CMS:** Content stored in repository, version controlled
- **Serverless Database:** Supabase for dynamic features (likes)

---

## Technology Stack

### Frontend Layer

| Technology | Purpose | Version |
|------------|---------|---------|
| **Astro 5** | Static site framework, SSG | 5.16.6 |
| **MDX** | Markdown with JSX for rich content | 4.3.13 |
| **TypeScript** | Type safety, developer experience | Latest |
| **CSS** | Scoped styling (Astro components) | CSS3 |

### Content Layer

| Technology | Purpose |
|------------|---------|
| **Zod** | Content schema validation |
| **Content Collections** | Type-safe content management |
| **Netlify CMS** | Web-based content editor |
| **GitHub** | Content storage, version control |

### Data Layer

| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database (like counts) |
| **LocalStorage** | Client-side state (user likes) |

### Build & Deployment

| Technology | Purpose |
|------------|---------|
| **Netlify** | Hosting, CDN, CI/CD |
| **GitHub Actions** | (Future) Advanced CI/CD |
| **Sharp** | Image optimization |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                            │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────────┐     │
│  │  HTML/CSS  │  │ Client-Side │  │   LocalStorage       │     │
│  │  (Static)  │  │ JavaScript  │  │ (Like Preferences)   │     │
│  └────────────┘  └─────────────┘  └──────────────────────┘     │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                      NETLIFY CDN (Edge)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Pre-rendered Static Files (HTML, CSS, JS, Images)      │   │
│  │  - Homepage with blog cards                              │   │
│  │  - Individual blog posts                                 │   │
│  │  - About page, RSS, Sitemap                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BUILD PROCESS                               │
│  ┌─────────────────┐         ┌──────────────────┐               │
│  │  Astro Build    │────────>│  Dist Folder     │               │
│  │  - SSG Pages    │         │  - Optimized     │               │
│  │  - Image Opt    │         │  - Minified      │               │
│  └─────────────────┘         └──────────────────┘               │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ↑ (Git Push Triggers Build)
                        │
┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                             │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────────┐       │
│  │  Source Code │  │   Content   │  │  Configuration   │       │
│  │  (src/)      │  │  (blog/*.md)│  │  (astro.config)  │       │
│  └──────────────┘  └─────────────┘  └──────────────────┘       │
└───────────────────────┬─────────────────────────────────────────┘
                        ↑
                        │ (CMS Commits)
                        │
┌─────────────────────────────────────────────────────────────────┐
│                      NETLIFY CMS                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Web-based Editor (/admin)                               │   │
│  │  - Create/Edit Posts                                     │   │
│  │  - Upload Images                                         │   │
│  │  - GitHub OAuth Auth                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE (PostgreSQL)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  post_likes Table                                        │   │
│  │  - post_slug (PK)                                        │   │
│  │  - like_count (integer)                                  │   │
│  │  - RLS Policies (public read/write)                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│         ↑                                                        │
│         │ (REST API Calls from Client)                          │
└─────────┴──────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Page Load Flow (Read)

```
User Request → Netlify CDN → Pre-rendered HTML → Browser
                                     ↓
                            Client JS Hydrates
                                     ↓
                            Fetch Like Count from Supabase
                                     ↓
                            Update UI with Count
```

### 2. Like Button Flow (Write)

```
User Clicks Like → Loading State
                        ↓
              Supabase API Call (UPDATE)
                        ↓
              Database Updates like_count
                        ↓
              Response Returns New Count
                        ↓
              UI Updates + LocalStorage Saves
```

### 3. Content Publishing Flow

```
Author Writes in CMS → Preview
                          ↓
                    Click "Publish"
                          ↓
                 CMS Commits to GitHub
                          ↓
                 GitHub Webhook → Netlify
                          ↓
                 Netlify Builds Site
                          ↓
                 Deploy to CDN (live in ~2 min)
```

---

## Component Architecture

### Layout Hierarchy

```
Page (index.astro, blog/[slug].astro)
  ├── BaseHead (SEO, meta tags)
  ├── Header (navigation)
  ├── Main Content
  │   ├── BlogCard (homepage grid)
  │   ├── BlogPost Layout
  │   │   ├── ReadingTime
  │   │   ├── SocialShare
  │   │   └── LikeButton
  └── Footer
```

### Component Responsibilities

| Component | Responsibility | Type |
|-----------|---------------|------|
| **BlogCard** | Display post preview in grid | Presentational |
| **LikeButton** | Interactive like feature | Interactive |
| **ReadingTime** | Calculate reading time | Utility |
| **SocialShare** | Share buttons | Presentational |
| **Header** | Site navigation | Layout |
| **Footer** | Site footer | Layout |
| **BaseHead** | SEO, meta tags | SEO |

### State Management

**No global state management library** - Intentionally simple:

- **Server State:** Pre-rendered at build time
- **Client State:**
  - LocalStorage for user preferences (likes)
  - Component-level state for UI (loading, errors)
- **Remote State:** Supabase for like counts (fetched on demand)

---

## Database Schema

### Supabase Tables

#### `post_likes`

```sql
CREATE TABLE post_likes (
  post_slug TEXT PRIMARY KEY,
  like_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read" ON post_likes
  FOR SELECT USING (true);

-- Public insert access
CREATE POLICY "Allow public insert" ON post_likes
  FOR INSERT WITH CHECK (true);

-- Public update access
CREATE POLICY "Allow public update" ON post_likes
  FOR UPDATE USING (true);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_likes_updated_at
  BEFORE UPDATE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

---

## Content Management

### Content Schema (Zod)

```typescript
// src/content.config.ts
const blog = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: image().optional(),
    author: z.string().default('Nick Hong'),
    tags: z.array(z.string()).optional().default([]),
  }),
});
```

### Content Storage

- **Location:** `src/content/blog/*.md`
- **Format:** Markdown with frontmatter
- **Versioning:** Git (full history)
- **Backup:** GitHub repository

---

## Deployment Pipeline

### Continuous Deployment Flow

```
1. Code Change (Local)
     ↓
2. Git Commit
     ↓
3. Git Push to GitHub (master)
     ↓
4. GitHub Webhook → Netlify
     ↓
5. Netlify Clone Repo
     ↓
6. Install Dependencies (npm install)
     ↓
7. Build Site (npm run build)
     ├── Astro SSG
     ├── Image Optimization
     ├── Code Minification
     └── Generate Sitemap/RSS
     ↓
8. Deploy to CDN
     ↓
9. Site Live (2-3 minutes total)
```

### Build Configuration

**File:** `netlify.toml`

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20
- Environment variables injected at build time

---

## Security Architecture

### Layers of Security

1. **Static-First Security**
   - No server-side code to exploit
   - Pre-rendered HTML (no runtime injection)

2. **Environment Variables**
   - Secrets stored in Netlify (not in code)
   - Public keys exposed (Supabase anon key)
   - Private keys never exposed

3. **Database Security (Supabase)**
   - Row Level Security (RLS) enabled
   - Public read/write limited to `post_likes` table
   - No SQL injection risk (parameterized queries)

4. **HTTP Headers** (netlify.toml)
   ```
   X-Frame-Options: DENY
   X-XSS-Protection: 1; mode=block
   X-Content-Type-Options: nosniff
   Referrer-Policy: strict-origin-when-cross-origin
   ```

5. **CMS Security**
   - GitHub OAuth (no custom auth)
   - Repository-level permissions
   - Audit trail via Git commits

---

## Performance Considerations

### Build-Time Optimizations

- **Static Site Generation:** All pages pre-rendered
- **Image Optimization:** Sharp (WebP conversion, resizing)
- **Code Splitting:** Automatic via Astro
- **Minification:** CSS, JS minified in production

### Runtime Optimizations

- **CDN Delivery:** Netlify edge network
- **Caching Strategy:**
  - Static assets: 1 year cache (`immutable`)
  - HTML: No cache (always fresh)
- **Lazy Loading:** Images load on scroll
- **Prefetching:** Links prefetched on hover (future)

### Performance Metrics

**Target (Lighthouse):**
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

---

## Scalability Considerations

### Current Limits

- **Netlify Free Tier:** 100GB bandwidth/month
- **Supabase Free Tier:** 500MB database, 2GB bandwidth
- **Build Time:** ~2-3 seconds (scales linearly with posts)

### Scaling Strategy

**If traffic grows:**

1. **Phase 1** (0-10k visitors/month)
   - Current architecture sufficient
   - No changes needed

2. **Phase 2** (10k-100k visitors/month)
   - Upgrade Netlify plan for bandwidth
   - Consider ISR (Incremental Static Regeneration)
   - Add CDN analytics

3. **Phase 3** (100k+ visitors/month)
   - Migrate to Cloudflare Workers/Pages
   - Add edge caching for like counts
   - Consider read replicas for Supabase

---

## Future Architecture Considerations

### Potential Enhancements

1. **Search Functionality**
   - Add Algolia or Pagefind
   - Client-side search index

2. **Comments System**
   - Giscus (GitHub Discussions)
   - Or Supabase-based comments

3. **Analytics**
   - Plausible or Fathom (privacy-first)
   - Or Netlify Analytics

4. **Newsletter**
   - Buttondown or ConvertKit integration
   - Email collection form

5. **API Routes**
   - Netlify Functions for server-side logic
   - Rate limiting, webhooks

---

## Maintenance & Monitoring

### Health Checks

- **Build Status:** Monitor Netlify deploy logs
- **Database Health:** Supabase dashboard metrics
- **Performance:** Lighthouse CI (future)
- **Uptime:** Netlify status page

### Update Strategy

- **Dependencies:** Monthly security updates
- **Astro:** Quarterly major version reviews
- **Node.js:** Follow LTS schedule

---

## Related Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment procedures
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database setup
- [COMPONENTS.md](./COMPONENTS.md) - Component API docs
- [PRD.md](./PRD.md) - Product requirements
- [BUG_FIX_GUIDE.md](./BUG_FIX_GUIDE.md) - Debugging guide
