# Components Documentation

This document provides detailed information about all custom components in Nick's Blog.

## Overview

The blog uses Astro components for reusable UI elements. All components are located in `src/components/`.

## Interactive Components

### LikeButton

**File**: `src/components/LikeButton.astro`

A fully interactive like button with Supabase integration for persistent like counting.

#### Props

```typescript
interface Props {
  postSlug: string;  // URL slug of the blog post
}
```

#### Usage

```astro
---
import LikeButton from '../components/LikeButton.astro';
---

<LikeButton postSlug="first-post" />
```

#### Features

- **Persistent Storage**: Likes are stored in Supabase `post_likes` table
- **User State**: Uses localStorage to remember if user has liked the post
- **Auto-Creation**: Automatically creates database entry for new posts
- **Real-time Updates**: Fetches and displays current like count on load
- **Toggle Behavior**: Click to like, click again to unlike
- **Visual Feedback**: Heart icon fills when liked, animates on interaction
- **Error Handling**: Gracefully handles database errors with console logging

#### How It Works

1. **Initialization**:
   - Fetches current like count from Supabase
   - Checks localStorage for user's like status
   - Applies `liked` class if user previously liked

2. **Like Action**:
   - Reads current count from database
   - Increments (+1) or decrements (-1) based on current state
   - Updates database with new count
   - Updates UI with new count
   - Saves like status to localStorage (`liked-{postSlug}`)

3. **Database Integration**:
   - If post doesn't exist: Creates entry with `like_count: 0`
   - If post exists: Updates `like_count` field
   - Uses Supabase client from `src/lib/supabase.ts`

#### Styling

- Circular button with heart icon and count
- Brand color: `#e63946` (red)
- Hover effect: Light background, slight scale
- Active state: Filled background, white text
- Disabled state: Reduced opacity during updates

#### Dependencies

- `@supabase/supabase-js`: Database client
- `src/lib/supabase.ts`: Configured Supabase instance
- Environment variables: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`

#### Customization

To change the like button appearance:

```astro
<style>
  .like-button {
    /* Modify colors */
    --primary-color: #e63946;
    --hover-color: #ffe5e7;

    /* Modify sizing */
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
</style>
```

---

### ReadingTime

**File**: `src/components/ReadingTime.astro`

Calculates and displays estimated reading time based on word count.

#### Props

```typescript
interface Props {
  content: string;  // Raw markdown/text content of the post
}
```

#### Usage

```astro
---
import ReadingTime from '../components/ReadingTime.astro';

const postContent = "Your blog post content here...";
---

<ReadingTime content={postContent} />
```

#### Algorithm

- **Reading Speed**: 200 words per minute (industry standard)
- **Word Counting**: Splits text on whitespace using `/\s+/` regex
- **Rounding**: Uses `Math.ceil()` to always round up to next minute

#### Formula

```typescript
readingTime = Math.ceil(wordCount / 200)
```

#### Output

Displays as: `⏰ X min read` where X is the calculated time.

#### Styling

- Clock icon (SVG)
- Gray color matching site theme
- Inline-flex layout with icon and text
- Font size: 0.9rem
- Gap between icon and text: 0.3rem

#### Example Output

- 150 words → "1 min read"
- 350 words → "2 min read"
- 1000 words → "5 min read"

#### Customization

To adjust reading speed:

```astro
---
const wordsPerMinute = 250; // Adjust for faster readers
const readingTime = Math.ceil(words / wordsPerMinute);
---
```

---

### SocialShare

**File**: `src/components/SocialShare.astro`

Provides social media sharing buttons for blog posts.

#### Props

```typescript
interface Props {
  title: string;  // Post title
  url: string;    // Full URL of the post
}
```

#### Usage

```astro
---
import SocialShare from '../components/SocialShare.astro';

const postTitle = "My Awesome Post";
const postUrl = "https://nickhong.com/blog/my-awesome-post";
---

<SocialShare title={postTitle} url={postUrl} />
```

#### Supported Platforms

1. **Twitter/X**
   - Shares title and URL
   - Opens in new window
   - Color: `#1DA1F2` (Twitter blue)

2. **LinkedIn**
   - Shares URL (LinkedIn fetches metadata automatically)
   - Opens in new window
   - Color: `#0A66C2` (LinkedIn blue)

3. **Facebook**
   - Uses Facebook sharer dialog
   - Opens in new window
   - Color: `#1877F2` (Facebook blue)

#### Share URLs

```typescript
// Twitter
https://twitter.com/intent/tweet?text={encodedTitle}&url={encodedUrl}

// LinkedIn
https://www.linkedin.com/sharing/share-offsite/?url={encodedUrl}

// Facebook
https://www.facebook.com/sharer/sharer.php?u={encodedUrl}
```

#### Features

- **URL Encoding**: Properly encodes title and URL for sharing
- **Accessibility**: Includes `aria-label` for screen readers
- **Security**: Uses `rel="noopener noreferrer"` for external links
- **Responsive**: Buttons wrap on small screens
- **Hover Effects**: Slight lift animation on hover

#### Styling

- Circular buttons (44px × 44px)
- Platform brand colors
- Hover effect: Darker shade + translateY(-2px)
- Flexbox layout with 1rem gap
- Background container with light gray background

#### Customization

To add more platforms:

```astro
---
const redditUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
---

<a href={redditUrl} class="share-button reddit">
  <!-- Reddit SVG icon -->
</a>

<style>
  .reddit {
    background: #FF4500;
    color: white;
  }
</style>
```

---

## Layout Components

### BlogPost

**File**: `src/layouts/BlogPost.astro`

Main layout for blog post pages, composing header, content, and interactive components.

#### Props

```typescript
type Props = CollectionEntry<'blog'>['data'] & {
  body?: string;
};
```

Fields:
- `title`: Post title
- `description`: Post description (for meta tags)
- `pubDate`: Publication date
- `updatedDate`: Optional update date
- `heroImage`: Optional hero image
- `body`: Post content (for reading time calculation)

#### Structure

```
┌─────────────────────────────┐
│          Header             │
├─────────────────────────────┤
│        Hero Image           │
├─────────────────────────────┤
│      Metadata Section       │
│  - Date                     │
│  - Reading Time             │
│  - Updated Date (optional)  │
├─────────────────────────────┤
│         Post Title          │
├─────────────────────────────┤
│      Post Content           │
│      (MDX/Markdown)         │
├─────────────────────────────┤
│      Social Share           │
├─────────────────────────────┤
│       Like Button           │
├─────────────────────────────┤
│          Footer             │
└─────────────────────────────┘
```

#### Usage

```astro
---
import BlogPost from '../../layouts/BlogPost.astro';

const post = await getEntry('blog', 'my-post');
const { Content } = await render(post);
---

<BlogPost {...post.data} body={post.body}>
  <Content />
</BlogPost>
```

#### Features

- Responsive layout (max-width: 720px for content)
- Automatic slug extraction from URL
- Full URL generation for social sharing
- Hero image optimization with Astro Image
- Centered title and metadata
- Reading time display
- Last updated indicator
- Social sharing buttons
- Like button at bottom

#### Post Slug Extraction

```typescript
const postSlug = Astro.url.pathname
  .split('/')
  .filter(Boolean)
  .pop() || '';
```

Extracts slug from URLs like:
- `/blog/first-post/` → `first-post`
- `/blog/using-mdx/` → `using-mdx`

---

## Utility Components

### BaseHead

**File**: `src/components/BaseHead.astro`

Handles all `<head>` elements including meta tags, OpenGraph, and scripts.

### Header

**File**: `src/components/Header.astro`

Site header with navigation links.

### Footer

**File**: `src/components/Footer.astro`

Site footer with copyright and social links.

### FormattedDate

**File**: `src/components/FormattedDate.astro`

Formats dates consistently across the site.

### HeaderLink

**File**: `src/components/HeaderLink.astro`

Navigation link component with active state styling.

---

## Component Best Practices

### When to Use Each Component

| Component | Use When |
|-----------|----------|
| LikeButton | Blog post pages that need engagement tracking |
| ReadingTime | Any content with significant text (blog posts, articles) |
| SocialShare | Content you want users to share (blog posts, announcements) |
| BlogPost | Creating blog post layouts |

### Performance Considerations

1. **LikeButton**:
   - Makes 2 API calls on load (fetch count + check if exists)
   - Consider caching or static generation for high-traffic posts

2. **ReadingTime**:
   - Calculation happens at build time (no runtime cost)
   - Very lightweight

3. **SocialShare**:
   - No JavaScript required
   - Simple HTML links
   - Icons embedded as SVG (no external requests)

### Accessibility

All components follow accessibility best practices:
- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- Sufficient color contrast

---

## Adding New Components

To create a new component:

1. Create file in `src/components/`
2. Define TypeScript interface for props
3. Add component logic and markup
4. Include scoped styles
5. Document in this file
6. Import and use in layouts/pages

Example template:

```astro
---
interface Props {
  myProp: string;
}

const { myProp } = Astro.props;
---

<div class="my-component">
  {myProp}
</div>

<style>
  .my-component {
    /* Scoped styles */
  }
</style>

<script>
  // Optional client-side JavaScript
</script>
```

---

## Testing Components

To test components locally:

1. Start dev server: `npm run dev`
2. Navigate to a blog post with the component
3. Open browser DevTools
4. Test interactions and check console for errors

For LikeButton specifically:
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Click like button
4. Verify count updates in Supabase dashboard
5. Refresh page - verify state persists

---

## Future Component Ideas

Potential components to add:
- **CommentSection**: Integration with commenting system (Giscus, Utterances)
- **TableOfContents**: Auto-generated from post headings
- **RelatedPosts**: Show similar blog posts
- **NewsletterSignup**: Email subscription form
- **CodeBlock**: Enhanced code highlighting with copy button
- **ImageGallery**: Lightbox for multiple images
- **AuthorBio**: Author information at end of posts
