# Supabase Setup Guide

This guide explains how to set up Supabase for the like button functionality in Nick's Blog.

## Prerequisites

- Supabase account (sign up at https://supabase.com)
- Access to your project's environment variables

## Step 1: Create a Supabase Project

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Project Name**: nick-blog (or your preferred name)
   - **Database Password**: Create a strong password (save this)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to finish setting up (~2 minutes)

## Step 2: Create the Database Table

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click **New Query**
3. Paste the following SQL:

```sql
-- Create the post_likes table
CREATE TABLE post_likes (
  post_slug TEXT PRIMARY KEY,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on like_count for potential future features
CREATE INDEX idx_post_likes_count ON post_likes(like_count DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read likes
CREATE POLICY "Allow public read access" ON post_likes
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert new post entries
CREATE POLICY "Allow public insert" ON post_likes
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow anyone to update like counts
CREATE POLICY "Allow public update" ON post_likes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_post_likes_updated_at
  BEFORE UPDATE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

4. Click **Run** to execute the SQL
5. Verify the table was created by going to **Table Editor** and checking for `post_likes`

## Step 3: Get Your API Credentials

1. In the Supabase dashboard, go to **Settings** (gear icon) → **API**
2. Find the following values:
   - **Project URL**: Under "Project URL" (e.g., `https://xxxxx.supabase.co`)
   - **anon public key**: Under "Project API keys" → "anon public"

## Step 4: Configure Environment Variables

1. In your project root, create or edit `.env`:

```env
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
```

2. Replace the values with your actual Supabase credentials
3. **IMPORTANT**: Make sure `.env` is in your `.gitignore` (it should be by default)

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to any blog post
3. Click the like button
4. Verify in Supabase Dashboard → **Table Editor** → `post_likes` that:
   - A new row was created with the post slug
   - The like count increased
   - The timestamps were set correctly

## Database Schema Details

### Table: `post_likes`

| Column | Type | Description |
|--------|------|-------------|
| `post_slug` | TEXT | Primary key. URL slug of the blog post (e.g., "first-post") |
| `like_count` | INTEGER | Number of likes for the post. Default: 0 |
| `created_at` | TIMESTAMP | When the record was created (UTC) |
| `updated_at` | TIMESTAMP | When the record was last updated (UTC) |

### Row Level Security Policies

- **Public Read**: Anyone can view like counts
- **Public Insert**: Anyone can create new post entries
- **Public Update**: Anyone can increment/decrement likes

This configuration allows anonymous users to interact with likes without authentication.

## How the Like Button Works

1. **Initial Load**: Fetches like count from Supabase for the current post slug
2. **Auto-Creation**: If post doesn't exist in database, creates entry with 0 likes
3. **Like Action**:
   - Reads current count
   - Increments/decrements by 1
   - Updates database
   - Updates UI
   - Saves state to localStorage
4. **User State**: Uses localStorage to remember if user has liked the post

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Ensure `.env` file exists in project root
- Verify variable names are exactly `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`
- Restart your development server after adding environment variables

### Likes not persisting
- Check browser console for errors
- Verify RLS policies are correctly set up in Supabase
- Confirm your anon key has the correct permissions

### Unable to create new post entries
- Verify the INSERT policy is enabled
- Check that your Supabase project is not paused (free tier limitation)

## Security Considerations

- The anon key is safe to expose in client-side code
- Row Level Security prevents unauthorized database modifications
- Consider adding rate limiting for production to prevent abuse
- For admin features, use service role key on the backend only

## Production Deployment

When deploying to production (Netlify, Vercel, etc.):

1. Add environment variables to your hosting platform
2. Use the same `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`
3. Verify the build includes these variables
4. Test the like functionality on the deployed site

## Monitoring

Monitor your Supabase usage:
- **Dashboard** → **Database** → **Usage**: Check storage and bandwidth
- **API** → **Logs**: View real-time database requests
- **Auth** → **Users**: Track any authenticated actions (not used currently)

## Future Enhancements

Potential improvements:
- Add analytics to track most-liked posts
- Implement like animations
- Add dislike functionality
- Create an admin dashboard to view all post likes
- Add rate limiting per IP address
