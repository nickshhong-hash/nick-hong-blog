# Bug Fix Guide

A systematic approach to identifying, debugging, and fixing issues in Nick's Blog.

**Last Updated:** December 30, 2025
**Version:** 1.0

---

## Table of Contents

1. [Bug Triage Process](#bug-triage-process)
2. [Debugging Workflow](#debugging-workflow)
3. [Common Issues & Solutions](#common-issues--solutions)
4. [Debugging Tools](#debugging-tools)
5. [Testing Strategy](#testing-strategy)
6. [Rollback Procedures](#rollback-procedures)
7. [Post-Mortem Template](#post-mortem-template)

---

## Bug Triage Process

### Step 1: Report Collection

When a bug is discovered, collect:

**Required Information:**
- [ ] What happened? (observed behavior)
- [ ] What was expected? (expected behavior)
- [ ] Steps to reproduce
- [ ] Environment (browser, device, OS)
- [ ] Screenshots/error messages
- [ ] URL where issue occurs

**Template:**
```markdown
## Bug Report

**Title:** [Short, descriptive title]

**Description:**
What happened vs what should happen

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. Observe...

**Environment:**
- Browser: Chrome 120
- Device: Desktop
- OS: Windows 11
- URL: https://nickhong.com/blog/post-title

**Screenshots:**
[Attach here]

**Error Messages:**
[Browser console errors]
```

---

### Step 2: Severity Classification

| Severity | Definition | SLA | Examples |
|----------|-----------|-----|----------|
| **P0 - Critical** | Site down, data loss | Fix immediately | Build fails, site unreachable |
| **P1 - High** | Core feature broken | Fix within 24h | Like button doesn't work, CMS can't publish |
| **P2 - Medium** | Minor feature broken | Fix within 1 week | Tags don't display, hover effect broken |
| **P3 - Low** | Cosmetic issue | Fix when convenient | Spacing off, typo |

---

### Step 3: Impact Assessment

**Questions to ask:**
- How many users are affected? (1 user vs all users)
- Is there a workaround?
- Does it block other work?
- Is data at risk?
- Does it affect SEO/accessibility?

**Priority Matrix:**
```
High Impact + High Urgency = P0 (Fix now)
High Impact + Low Urgency = P1 (Fix soon)
Low Impact + High Urgency = P2 (Schedule)
Low Impact + Low Urgency = P3 (Backlog)
```

---

## Debugging Workflow

### The 5-Step Debug Process

#### Step 1: Reproduce the Bug

**Goal:** Confirm the bug exists and understand how to trigger it

```bash
# 1. Check if issue exists locally
npm run dev
# Visit http://localhost:4321 and test

# 2. Check if issue exists in production
# Visit live site and test

# 3. Try different browsers/devices
# Chrome, Firefox, Safari
# Desktop, mobile
```

**Checklist:**
- [ ] Can you reproduce locally?
- [ ] Can you reproduce in production?
- [ ] Is it browser-specific?
- [ ] Is it device-specific?
- [ ] Does it happen 100% of the time?

---

#### Step 2: Isolate the Problem

**Goal:** Narrow down where the bug originates

**Techniques:**

1. **Binary Search Approach**
   ```
   Comment out half the code
   → Bug still there? Keep that half
   → Bug gone? Keep other half
   → Repeat until isolated
   ```

2. **Component Isolation**
   ```bash
   # Test individual components
   # Does LikeButton work in isolation?
   # Does BlogCard work in isolation?
   ```

3. **Check Recent Changes**
   ```bash
   # What changed recently?
   git log --oneline -10

   # Diff recent commits
   git diff HEAD~5
   ```

4. **Browser DevTools**
   - Console: Check for errors
   - Network: Check API calls
   - Elements: Inspect DOM
   - Sources: Debug JavaScript

---

#### Step 3: Identify Root Cause

**Goal:** Understand why the bug occurs

**Common Root Causes:**

| Category | Questions to Ask | Tools |
|----------|-----------------|-------|
| **Logic Error** | Is the algorithm correct? | Console logs, debugger |
| **Type Error** | Type mismatch? Undefined? | TypeScript, console |
| **State Management** | Is state updating correctly? | React DevTools, logs |
| **API/Network** | Is data fetching failing? | Network tab, Supabase logs |
| **Styling** | CSS specificity? Layout issue? | DevTools Elements |
| **Build/Config** | Env vars missing? Build broken? | Build logs, .env check |
| **Dependencies** | Package version conflict? | npm ls, package.json |

**Debugging Checklist:**
- [ ] Added console.logs at key points
- [ ] Checked browser console for errors
- [ ] Checked network tab for failed requests
- [ ] Checked Supabase logs (if DB-related)
- [ ] Checked build logs (if build-related)
- [ ] Read error stack trace carefully
- [ ] Googled the exact error message

---

#### Step 4: Fix the Bug

**Goal:** Implement a solution that addresses the root cause

**Fix Guidelines:**

1. **Understand Before Fixing**
   - Don't guess and check
   - Understand why the bug exists
   - Fix the cause, not the symptom

2. **Write a Test First (if applicable)**
   ```typescript
   // Test that reproduces the bug
   test('like button should not double-submit', async () => {
     // Write test that fails
   });
   ```

3. **Make the Smallest Change Possible**
   - One logical change at a time
   - Don't refactor while fixing bugs
   - Keep the fix focused

4. **Verify the Fix**
   ```bash
   # Test locally
   npm run dev
   # Manual testing

   # Build succeeds?
   npm run build

   # Run tests (if you have them)
   npm test
   ```

---

#### Step 5: Prevent Regression

**Goal:** Ensure the bug doesn't come back

**Prevention Strategies:**

1. **Add Tests** (future enhancement)
   ```typescript
   // Unit test
   test('like button increments count', ...)

   // Integration test
   test('full like flow works', ...)
   ```

2. **Add Comments**
   ```typescript
   // Bug fix: Prevent double-submit by disabling button during request
   // Issue: #123, Date: 2025-12-30
   button.disabled = true;
   ```

3. **Update Documentation**
   - Add to CHANGELOG.md
   - Update relevant docs
   - Document edge cases

4. **Code Review**
   - Have someone else review the fix
   - Explain the root cause and solution
   - Get feedback on approach

---

## Common Issues & Solutions

### Build Failures

#### Issue: Build fails with "Missing environment variables"

**Symptoms:**
```
Error: Missing Supabase environment variables
```

**Root Cause:** Supabase env vars not set

**Solution:**
1. Check `.env` file exists
2. Check `.env` has correct variables:
   ```
   PUBLIC_SUPABASE_URL=...
   PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. For Netlify: Add env vars in dashboard
4. Rebuild

**Prevention:**
- `.env.example` file documents required vars
- Graceful degradation if env vars missing

---

#### Issue: Build fails with TypeScript errors

**Symptoms:**
```
Type 'undefined' is not assignable to type 'string'
```

**Solution:**
1. Read the error message carefully
2. Check the file and line number
3. Fix type mismatch
   ```typescript
   // Bad
   const title: string = post.data.title;

   // Good
   const title = post.data.title || 'Untitled';
   ```

---

### Runtime Errors

#### Issue: Like button doesn't work

**Debugging Steps:**
1. Open browser console
2. Click like button
3. Check for errors

**Common Causes:**
- Supabase credentials missing/incorrect
- Network request blocked (CORS, adblocker)
- Database table doesn't exist
- RLS policies too restrictive

**Solution:**
1. Check Supabase connection:
   ```typescript
   console.log('Supabase configured:', isSupabaseConfigured);
   ```
2. Check network tab for failed requests
3. Check Supabase logs for errors
4. Verify RLS policies allow public access

---

#### Issue: Images not loading

**Symptoms:**
- Broken image icon
- 404 errors in network tab

**Solution:**
1. Check image path is correct
2. Check image exists in `public/` or `src/assets/`
3. Check Astro Image component usage:
   ```astro
   // Import from assets (processed)
   import image from '../assets/image.jpg';
   <Image src={image} alt="..." />

   // Or use public folder (not processed)
   <img src="/uploads/image.jpg" alt="..." />
   ```

---

### Styling Issues

#### Issue: Styles not applying

**Debugging:**
1. Inspect element in DevTools
2. Check if styles are loaded (Styles panel)
3. Check CSS specificity
4. Check for typos in class names

**Common Causes:**
- Scoped styles (Astro components)
- CSS specificity conflicts
- Typo in class name
- Missing import

**Solution:**
```astro
<!-- Scoped styles only apply within component -->
<style>
  .card { /* only affects this component */ }
</style>

<!-- Global styles -->
<style is:global>
  .card { /* affects entire site */ }
</style>
```

---

### CMS Issues

#### Issue: CMS can't save posts

**Symptoms:**
- Save button doesn't work
- No commit to GitHub
- Authentication errors

**Solution:**
1. Check GitHub OAuth is configured
2. Check Netlify OAuth provider settings
3. Check repository permissions
4. Check network tab for auth errors
5. Try logging out and back in

---

### Performance Issues

#### Issue: Page loads slowly

**Debugging:**
1. Run Lighthouse audit
2. Check Network tab (waterfall)
3. Identify bottlenecks

**Common Causes:**
- Large unoptimized images
- Too many network requests
- Slow API calls
- JavaScript blocking render

**Solution:**
```astro
// Optimize images
<Image src={heroImage} width={800} height={400} />

// Lazy load images
<img loading="lazy" ... />

// Defer non-critical JS
<script async src="..." />
```

---

## Debugging Tools

### Browser DevTools

**Console:**
```javascript
// Add strategic console.logs
console.log('Like count:', count);
console.error('Failed to fetch:', error);
console.table(posts); // Nice formatting for arrays
```

**Network Tab:**
- Check API calls (status codes, response times)
- Check for failed requests (red)
- Inspect request/response payloads

**Elements Tab:**
- Inspect computed styles
- Check layout (margin, padding)
- Modify CSS live

**Sources/Debugger:**
```javascript
// Add breakpoints
debugger; // Pause execution here
```

---

### Astro-Specific Tools

**Check Astro logs:**
```bash
npm run dev -- --verbose
```

**Check build output:**
```bash
npm run build 2>&1 | tee build.log
```

**Type checking:**
```bash
npx astro check
```

---

### Supabase Tools

**Supabase Dashboard:**
1. Go to https://app.supabase.com
2. Check Table Editor (data)
3. Check Logs (API calls, errors)
4. Check Auth (user sessions)

**Test queries:**
```javascript
// Browser console
const { data, error } = await supabase
  .from('post_likes')
  .select('*');
console.log(data, error);
```

---

## Testing Strategy

### Manual Testing Checklist

Before deploying a fix:

**Functionality:**
- [ ] Bug is fixed (can't reproduce)
- [ ] Related features still work
- [ ] No new errors in console
- [ ] Build succeeds

**Cross-Browser:**
- [ ] Chrome (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Chrome (Mobile)
- [ ] Safari (iOS)

**Responsive:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768px width)
- [ ] Mobile (375px width)

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader friendly (test with NVDA/VoiceOver)
- [ ] Focus indicators visible
- [ ] Color contrast sufficient

---

### Automated Testing (Future)

**Unit Tests:**
```typescript
// Test utility functions
test('calculateReadingTime returns correct minutes', () => {
  const content = 'word '.repeat(200);
  expect(calculateReadingTime(content)).toBe('1 min');
});
```

**Integration Tests:**
```typescript
// Test components work together
test('BlogCard displays all fields correctly', () => {
  render(<BlogCard {...props} />);
  expect(screen.getByText(props.title)).toBeInTheDocument();
});
```

**E2E Tests:**
```typescript
// Test full user flows
test('User can like a post', async () => {
  await page.goto('/blog/test-post');
  await page.click('[data-testid="like-button"]');
  await expect(page.locator('.like-count')).toHaveText('1');
});
```

---

## Rollback Procedures

### Emergency Rollback (Site Down)

**If production is broken:**

```bash
# Option 1: Netlify Dashboard
# Go to Deploys → Find last working deploy → "Publish deploy"

# Option 2: Git Revert
git revert HEAD
git push origin master
# Netlify auto-deploys previous version
```

**Steps:**
1. Identify last working commit
2. Rollback to that commit
3. Investigate fix offline
4. Deploy fix when ready

---

### Gradual Rollback (Feature Issues)

**If a feature is broken but site works:**

```bash
# Disable feature with feature flag (future)
# Or comment out component
<BlogCard /> <!-- Temporarily disabled -->
```

---

## Post-Mortem Template

After fixing a major bug, document what happened:

```markdown
## Post-Mortem: [Bug Title]

**Date:** 2025-12-30
**Severity:** P1
**Duration:** 2 hours (12:00 - 14:00)
**Impact:** Like button broken for all users

### What Happened
[Description of the incident]

### Root Cause
[Why did this happen?]

### Timeline
- 12:00 - Bug introduced in commit abc123
- 12:30 - User reported issue
- 12:45 - Investigation started
- 13:30 - Root cause identified
- 14:00 - Fix deployed and verified

### Resolution
[What was the fix?]

### Prevention
What we'll do to prevent this:
1. Add unit tests for like button
2. Add manual testing checklist
3. Review error handling patterns

### Action Items
- [ ] Write tests (Due: 2026-01-05)
- [ ] Update docs (Due: 2026-01-03)
- [ ] Code review process improvement (Due: 2026-01-10)
```

---

## Best Practices

### Do's
- ✅ Read error messages carefully
- ✅ Reproduce bugs before fixing
- ✅ Fix root cause, not symptoms
- ✅ Test fix thoroughly
- ✅ Document complex fixes
- ✅ Update CHANGELOG
- ✅ Ask for help when stuck

### Don'ts
- ❌ Guess and check randomly
- ❌ Fix multiple bugs in one commit
- ❌ Skip testing the fix
- ❌ Ignore warnings
- ❌ Rush the fix
- ❌ Fix bugs in production directly
- ❌ Forget to commit fix

---

## Resources

### Internal Docs
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [CODE_REVIEW_FIXES.md](./CODE_REVIEW_FIXES.md) - Recent fixes
- [COMPONENTS.md](./COMPONENTS.md) - Component API

### External Resources
- [Astro Docs](https://docs.astro.build)
- [Supabase Docs](https://supabase.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)
- [Stack Overflow](https://stackoverflow.com)

### Getting Help
- Astro Discord: https://astro.build/chat
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: Report bugs in dependencies

---

## Changelog

**v1.0** (2025-12-30)
- Initial bug fix guide created
- Added systematic debugging workflow
- Added common issues reference
- Added rollback procedures
