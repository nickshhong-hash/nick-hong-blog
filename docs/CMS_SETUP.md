# Netlify CMS Setup Guide

This guide explains how to set up and use Netlify CMS (Decap CMS) with GitHub OAuth for content management in Nick's Blog.

## Overview

Netlify CMS provides a web-based interface for managing blog content without directly editing markdown files. It uses GitHub as the backend, automatically committing changes to your repository.

## Prerequisites

- GitHub account
- GitHub repository: `nickshhong-hash/nick-hong-blog`
- Admin access to the repository
- Site deployed and accessible (for OAuth callback)

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│   Browser   │────▶│ Netlify CMS  │────▶│   GitHub   │
│  /admin     │     │   (Client)   │     │    API     │
└─────────────┘     └──────────────┘     └────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  GitHub      │
                    │  OAuth App   │
                    └──────────────┘
```

## Files Overview

### `public/admin/config.yml`
CMS configuration file that defines:
- Backend (GitHub)
- Repository details
- Content collections
- Field definitions

### `public/admin/index.html`
CMS admin interface that loads:
- Netlify CMS JavaScript library
- Netlify Identity widget (for authentication)

## Step 1: GitHub OAuth Application Setup

To enable authentication, you need to create a GitHub OAuth application.

### Option A: Using Netlify (Recommended)

If deploying to Netlify:

1. Deploy your site to Netlify
2. In Netlify Dashboard:
   - Go to **Site settings** → **Access control** → **OAuth**
   - Click **Install provider**
   - Select **GitHub**
   - This automatically creates and configures the OAuth app
3. Netlify handles the authentication flow

### Option B: Manual GitHub OAuth App

For other hosting platforms or custom setup:

1. Go to GitHub Settings → **Developer settings** → **OAuth Apps**
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: Nick's Blog CMS
   - **Homepage URL**: `https://nickhong.com`
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
   - For other hosts, use: `https://your-domain.com/admin/`
4. Click **Register application**
5. Copy the **Client ID** and generate a **Client Secret**
6. Configure your hosting platform with these credentials

## Step 2: CMS Configuration

The CMS is already configured in `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: nickshhong-hash/nick-hong-blog
  branch: master

media_folder: "public/uploads"
public_folder: "/uploads"

collections:
  - name: "blog"
    label: "Blog Posts"
    folder: "src/content/blog"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Description", name: "description", widget: "string" }
      - { label: "Publish Date", name: "pubDate", widget: "datetime" }
      - { label: "Hero Image", name: "heroImage", widget: "image", required: false }
      - { label: "Body", name: "body", widget: "markdown" }
```

### Configuration Breakdown

- **backend**: Uses GitHub API to read/write files
- **repo**: Points to your GitHub repository
- **branch**: Commits are made to `master` branch
- **media_folder**: Where uploaded images are stored (in repo)
- **public_folder**: URL path to access uploaded images
- **collections**: Defines content types (blog posts)

## Step 3: Accessing the CMS

### Development (Local)

For local testing, you can use the test backend:

1. In `public/admin/config.yml`, uncomment:
   ```yaml
   local_backend: true
   ```

2. Install and run the backend proxy:
   ```bash
   npx netlify-cms-proxy-server
   ```

3. In another terminal:
   ```bash
   npm run dev
   ```

4. Navigate to `http://localhost:4321/admin`

### Production

1. Deploy your site
2. Navigate to `https://yourdomain.com/admin`
3. Click **Login with GitHub**
4. Authorize the application
5. You'll be redirected to the CMS dashboard

## Step 4: Using the CMS

### Creating a New Blog Post

1. Log in to the CMS
2. Click **Blog Posts** in the sidebar
3. Click **New Blog Posts**
4. Fill in the fields:
   - **Title**: Post title (required)
   - **Description**: Brief summary (required)
   - **Publish Date**: When to publish (required)
   - **Hero Image**: Featured image (optional)
   - **Body**: Main content in Markdown (required)
5. Use the rich text editor or toggle to markdown mode
6. Click **Publish** → **Publish now**

The post is automatically committed to GitHub and deployed.

### Editing Existing Posts

1. In the CMS, click **Blog Posts**
2. Click on the post you want to edit
3. Make your changes
4. Click **Publish** → **Publish now**

### Managing Media

1. Click the image field or use the media library
2. Upload new images or select existing ones
3. Images are stored in `public/uploads/`
4. Automatically committed to the repository

### Deleting Posts

1. Open the post in the CMS
2. Click **Delete** button (usually in the top menu)
3. Confirm deletion
4. The markdown file is removed from the repository

## Content Workflow

```
┌──────────────┐
│ Edit in CMS  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Save Draft   │ (Optional - stored in browser)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Publish    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Git Commit   │ (Automatic - pushed to master)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Deploy     │ (Automatic - triggered by commit)
└──────────────┘
```

## Post Frontmatter Format

When the CMS creates a post, it generates frontmatter like:

```markdown
---
title: 'My Awesome Post'
description: 'This is a great post about...'
pubDate: '2025-12-29T10:30:00.000Z'
heroImage: '/uploads/my-image.jpg'
---

Post content here...
```

## Customizing the CMS

### Adding New Fields

Edit `public/admin/config.yml` to add fields:

```yaml
fields:
  - { label: "Tags", name: "tags", widget: "list" }
  - { label: "Author", name: "author", widget: "string" }
  - { label: "Featured", name: "featured", widget: "boolean", default: false }
```

### Adding New Collections

To manage other content (like pages):

```yaml
collections:
  - name: "pages"
    label: "Pages"
    files:
      - label: "About Page"
        name: "about"
        file: "src/pages/about.astro"
        fields:
          - { label: "Title", name: "title", widget: "string" }
          - { label: "Body", name: "body", widget: "markdown" }
```

### Customizing Widgets

Available widgets:
- `string`: Text input
- `text`: Textarea
- `markdown`: Rich text editor
- `datetime`: Date/time picker
- `image`: Image uploader
- `file`: File uploader
- `boolean`: Checkbox
- `select`: Dropdown
- `list`: Repeatable fields
- `relation`: Link to other entries

## Troubleshooting

### "Unable to load entries"
- Verify GitHub repository name is correct
- Ensure you have access to the repository
- Check that the branch exists

### Authentication fails
- Verify OAuth app is correctly configured
- Check callback URL matches your deployment
- Ensure you're accessing via HTTPS (not HTTP)

### Changes not appearing on site
- Check if the commit was made to GitHub
- Verify your deployment is triggered by commits
- Check build logs for errors

### Images not loading
- Verify `media_folder` and `public_folder` paths
- Check that images are committed to repository
- Ensure image paths in posts are correct

### "Config could not be loaded"
- Check `public/admin/config.yml` syntax (YAML is strict)
- Verify indentation is correct (use spaces, not tabs)
- Validate YAML structure

## Security Best Practices

1. **Repository Access**: Only grant admin access to trusted users
2. **OAuth Scope**: CMS only requests repository access it needs
3. **Branch Protection**: Consider protecting `master` branch in GitHub
4. **Review Changes**: Enable pull request workflow instead of direct commits:
   ```yaml
   backend:
     name: github
     repo: nickshhong-hash/nick-hong-blog
     branch: master
     open_authoring: true  # Enable fork-based workflow
   ```

## Advanced Configuration

### Editorial Workflow

Enable draft/review process:

```yaml
publish_mode: editorial_workflow
```

This creates three states:
- **Draft**: Work in progress
- **In Review**: Ready for review
- **Ready**: Approved and ready to publish

### Custom Previews

Add real-time preview templates in `public/admin/index.html`.

### Localization

Support multiple languages:

```yaml
i18n:
  structure: multiple_folders
  locales: [en, es, fr]
```

## Migration Notes

This project switched from Netlify Identity to GitHub OAuth:
- **Previous**: Netlify Identity widget for user management
- **Current**: Direct GitHub OAuth for simpler authentication
- **Benefit**: No separate identity service, uses existing GitHub accounts

## Resources

- [Netlify CMS Documentation](https://www.netlifycms.org/docs/)
- [Decap CMS](https://decapcms.org/) - New fork/name for Netlify CMS
- [Widget Reference](https://www.netlifycms.org/docs/widgets/)
- [Configuration Options](https://www.netlifycms.org/docs/configuration-options/)
