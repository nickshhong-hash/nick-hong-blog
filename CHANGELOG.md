# Changelog

All notable changes to Nick's Blog will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation (README.md, CHANGELOG.md, CLAUDE.md)
- Detailed setup guides for Supabase and Netlify CMS
- Component documentation

## [0.0.1] - 2025-12-29

### Added
- Initial Astro blog setup with Bear Blog template
- Decap CMS (Netlify CMS) for web-based content management
  - CMS configuration in `public/admin/config.yml`
  - Blog post editing interface
  - Media upload support to `public/uploads/`
- Supabase integration for like button functionality
  - Database table: `post_likes` (post_slug, like_count)
  - Client initialization in `src/lib/supabase.ts`
  - Environment variables: PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY
- Like button component (`src/components/LikeButton.astro`)
  - Real-time like counting
  - localStorage to track user likes
  - Auto-creation of database entries for new posts
  - Visual feedback with heart icon animation
- Reading time component (`src/components/ReadingTime.astro`)
  - Calculates estimated reading time (200 words/minute)
  - Displays in blog post metadata
- Social sharing component (`src/components/SocialShare.astro`)
  - Share buttons for Twitter, Facebook, LinkedIn
  - Pre-filled share text with post title and URL
- GitHub OAuth authentication for CMS
  - Backend configuration for repo: nickshhong-hash/nick-hong-blog
  - Replaced Netlify Identity widget approach
- Site information updates
  - Site URL: https://nickhong.com
  - Custom metadata and OpenGraph tags

### Fixed
- Like button visibility issue in blog post layout

### Changed
- CMS authentication method from Netlify Identity to GitHub OAuth
- Blog post layout to include reading time, social share, and like button

## Project Evolution

### Phase 1: Foundation (Initial Commit)
Created base Astro blog with:
- MDX support
- Sitemap generation
- RSS feed
- SEO optimization
- Responsive design

### Phase 2: Content Management (Decap CMS)
Added web-based content editing:
- No need to edit markdown files directly
- Media upload interface
- User-friendly post creation

### Phase 3: User Engagement (Supabase + Features)
Enhanced interactivity:
- Like button for reader engagement
- Reading time for better UX
- Social sharing for content distribution

### Phase 4: Authentication Refinement (GitHub OAuth)
Simplified CMS access:
- Direct GitHub authentication
- No separate identity service needed
- Streamlined workflow for content creators
