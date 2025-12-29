# Nick's Blog

A personal blog built with Astro 5, featuring a content management system, social engagement features, and modern web technologies.

## Features

- Static site generation with Astro 5
- MDX support for rich content
- Netlify CMS for web-based content editing
- GitHub OAuth authentication for CMS
- Like button functionality with Supabase
- Reading time estimation
- Social sharing buttons
- SEO-friendly with canonical URLs and OpenGraph data
- RSS feed and sitemap support
- 100/100 Lighthouse performance score

## Prerequisites

- Node.js (latest LTS recommended)
- npm
- Supabase account and project
- GitHub account (for CMS authentication)

## Environment Setup

Create a `.env` file in the root directory:

```env
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Starts the development server at `http://localhost:4321`

## Building

```bash
npm run build
```

Builds the production site to `./dist/`

## Preview

```bash
npm run preview
```

Preview your production build locally before deploying

## Project Structure

```
├── public/
│   ├── admin/              # Netlify CMS files
│   │   ├── config.yml      # CMS configuration
│   │   └── index.html      # CMS admin interface
│   └── uploads/            # Media uploads from CMS
├── src/
│   ├── components/         # Reusable Astro components
│   │   ├── LikeButton.astro
│   │   ├── ReadingTime.astro
│   │   ├── SocialShare.astro
│   │   └── ...
│   ├── content/
│   │   └── blog/          # Blog posts (Markdown/MDX)
│   ├── layouts/           # Page layouts
│   │   └── BlogPost.astro # Main blog post template
│   ├── lib/              # Utilities and clients
│   │   └── supabase.ts   # Supabase client
│   └── pages/            # File-based routing
│       ├── index.astro
│       ├── about.astro
│       └── blog/
│           ├── index.astro
│           └── [...slug].astro
├── astro.config.mjs      # Astro configuration
└── package.json
```

## Content Management

### Accessing the CMS

Navigate to `/admin` on your deployed site to access the Netlify CMS interface.

Authentication uses GitHub OAuth with the repository: `nickshhong-hash/nick-hong-blog`

### Creating Blog Posts

1. Log in to the CMS at `/admin`
2. Navigate to "Blog Posts"
3. Click "New Blog Posts"
4. Fill in:
   - Title
   - Description
   - Publish Date
   - Hero Image (optional)
   - Body content
5. Save and publish

Posts are automatically committed to the `master` branch.

## Supabase Integration

The blog uses Supabase for the like button feature.

### Database Schema

Table: `post_likes`
- `post_slug` (text, primary key): URL slug of the blog post
- `like_count` (integer): Number of likes for the post

### Setup Instructions

See `docs/SUPABASE_SETUP.md` for detailed setup instructions.

## Components

### LikeButton

Interactive like button that:
- Tracks likes in Supabase
- Uses localStorage to remember user's likes
- Auto-creates database entries for new posts
- Shows real-time like counts

### ReadingTime

Calculates and displays estimated reading time based on word count (200 words/minute).

### SocialShare

Provides sharing buttons for Twitter, Facebook, and LinkedIn.

## Deployment

This site is configured for deployment on **Netlify** at `https://nickhong.com`.

### Quick Deploy Steps

1. Push your code to GitHub
2. Connect repository to Netlify
3. Add environment variables (Supabase credentials)
4. Configure custom domain
5. Set up GitHub OAuth for CMS access

**Full deployment guide**: See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed step-by-step instructions.

### Build Configuration

The `netlify.toml` file includes:
- Build commands and publish directory
- Security headers
- Cache optimization for assets
- Deploy preview settings

**Note**: If deploying to a different domain, update the `site` field in `astro.config.mjs`.

## Technologies

- [Astro 5](https://astro.build) - Static site framework
- [MDX](https://mdxjs.com) - Markdown with JSX
- [Supabase](https://supabase.com) - Backend database
- [Netlify CMS](https://www.netlifycms.org/) - Content management
- [Sharp](https://sharp.pixelplumbing.com/) - Image optimization

## License

Private project

## Credit

Theme based on the [Bear Blog](https://github.com/HermanMartinus/bearblog/) template.
