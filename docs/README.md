# Documentation

Complete documentation for Nick's Blog.

## Quick Links

- [Main README](../README.md) - Project overview and quick start
- [CHANGELOG](../CHANGELOG.md) - Version history and changes
- [CLAUDE.md](../CLAUDE.md) - Guidance for Claude Code AI assistant

## Setup Guides

### [Supabase Setup](SUPABASE_SETUP.md)
Complete guide for setting up Supabase database for like button functionality.

**Contents:**
- Creating a Supabase project
- Database schema and table setup
- Row Level Security policies
- Environment configuration
- Testing and troubleshooting
- Production deployment

### [CMS Setup](CMS_SETUP.md)
Guide for configuring and using Netlify CMS with GitHub OAuth.

**Contents:**
- GitHub OAuth application setup
- CMS configuration details
- Creating and editing blog posts
- Media management
- Customizing the CMS
- Security best practices

## Component Reference

### [Components Documentation](COMPONENTS.md)
Detailed documentation for all custom components.

**Covered Components:**
- **LikeButton**: Interactive like button with Supabase
- **ReadingTime**: Estimated reading time calculator
- **SocialShare**: Social media sharing buttons
- **BlogPost**: Main blog post layout

## Documentation Structure

```
Nick's Blog/
├── README.md                 # Project overview
├── CHANGELOG.md             # Change history
├── CLAUDE.md                # AI assistant guide
└── docs/
    ├── README.md            # This file
    ├── SUPABASE_SETUP.md    # Database setup
    ├── CMS_SETUP.md         # Content management
    └── COMPONENTS.md        # Component reference
```

## Common Tasks

### Starting Development
```bash
npm run dev
```
See: [README - Development](../README.md#development)

### Adding a New Blog Post
1. Via CMS: [CMS Setup - Creating Posts](CMS_SETUP.md#creating-a-new-blog-post)
2. Via File: Create markdown in `src/content/blog/`

### Deploying Changes
Changes pushed to `master` branch automatically trigger deployment.

### Setting Up Like Functionality
Follow: [Supabase Setup Guide](SUPABASE_SETUP.md)

### Customizing the CMS
Follow: [CMS Setup - Customizing](CMS_SETUP.md#customizing-the-cms)

## Getting Help

### Troubleshooting

**Like button not working?**
→ [Supabase Setup - Troubleshooting](SUPABASE_SETUP.md#troubleshooting)

**CMS authentication failing?**
→ [CMS Setup - Troubleshooting](CMS_SETUP.md#troubleshooting)

**Component not rendering?**
→ [Components - Best Practices](COMPONENTS.md#component-best-practices)

### Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [Supabase Documentation](https://supabase.com/docs)
- [Netlify CMS Documentation](https://www.netlifycms.org/docs/)
- [MDX Documentation](https://mdxjs.com/docs/)

## Contributing

When making changes to the project:

1. **Update CHANGELOG.md**: Document what changed
2. **Update relevant docs**: Keep documentation in sync
3. **Test thoroughly**: Verify changes work locally
4. **Update CLAUDE.md**: If architecture changes

## Documentation Maintenance

### When to Update Documentation

- **CHANGELOG.md**: After every feature, fix, or change
- **README.md**: When setup process changes
- **SUPABASE_SETUP.md**: If database schema changes
- **CMS_SETUP.md**: If CMS configuration changes
- **COMPONENTS.md**: When adding/modifying components
- **CLAUDE.md**: If codebase architecture changes

### Documentation Style Guide

- Use clear, concise language
- Include code examples
- Add diagrams for complex flows
- Keep tables for structured data
- Use headings for easy navigation
- Include troubleshooting sections

## Project Stack

| Technology | Purpose | Documentation |
|------------|---------|---------------|
| Astro 5 | Static site framework | [CLAUDE.md](../CLAUDE.md) |
| MDX | Content format | [Astro Docs](https://docs.astro.build/en/guides/markdown-content/) |
| Supabase | Database | [SUPABASE_SETUP.md](SUPABASE_SETUP.md) |
| Netlify CMS | Content management | [CMS_SETUP.md](CMS_SETUP.md) |
| TypeScript | Type safety | [Components](COMPONENTS.md) |

## Version History

See [CHANGELOG.md](../CHANGELOG.md) for detailed version history.

**Current Version**: 0.0.1

**Last Updated**: 2025-12-29
