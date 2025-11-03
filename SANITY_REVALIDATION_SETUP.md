# Sanity Content Update Fix - Setup Guide

## What Was Fixed

Your production site was caching content indefinitely at build time. I've implemented **Incremental Static Regeneration (ISR)** with two update mechanisms:

1. ⏰ **Time-based revalidation** - Pages refresh every 60 seconds
2. ⚡ **On-demand revalidation** - Instant updates when you edit content in Sanity

---

## Setup Instructions

### Step 1: Add Environment Variable to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add a new variable:
   - **Name**: `REVALIDATION_SECRET`
   - **Value**: Generate a secure random string (e.g., `h7k9j2m4n6p8q1r3s5t7u9v2w4x6y8z0`)
   - **Environment**: Production, Preview, Development (check all)
4. Click **Save**

💡 **Tip**: Generate a secure secret with:
```bash
openssl rand -base64 32
```

---

### Step 2: Configure Sanity Webhook

1. Go to [Sanity Management Console](https://www.sanity.io/manage)
2. Select your project: **PepPerez** (vynr1qpf)
3. Navigate to **API → Webhooks**
4. Click **Create webhook**
5. Configure:
   - **Name**: `Vercel Production Revalidation`
   - **URL**: `https://pepperezguarro.vercel.app/api/revalidate?secret=YOUR_SECRET_HERE`
     - Replace `YOUR_SECRET_HERE` with the secret you created in Step 1
   - **Dataset**: `production`
   - **Trigger on**: Create, Update, Delete
   - **Filter**: Leave empty (or use `_type == "project" || _type == "about"`)
   - **Projection**: `{_type, "slug": slug.current}`
   - **HTTP method**: `POST`
   - **API version**: `v2024-10-23`
6. Click **Save**

---

### Step 3: Test the Setup

#### Test Time-Based Revalidation (60 seconds)
1. Make a change in Sanity Studio (e.g., edit a project title)
2. Wait **60 seconds**
3. Visit your production site and hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
4. Your changes should appear

#### Test On-Demand Revalidation (instant)
1. Make a change in Sanity Studio
2. Go to Sanity **API → Webhooks**
3. Click on your webhook → View deliveries
4. You should see a successful delivery (green checkmark)
5. Visit your production site immediately (no need to wait)
6. Changes should appear instantly

---

### Step 4: Redeploy Your Site

After adding the environment variable:

1. Go to Vercel → Your project → Deployments
2. Find the latest deployment
3. Click **...** → **Redeploy**
4. Select **Use existing Build Cache** → Redeploy

Or push a new commit to trigger a fresh deployment.

---

## How It Works Now

### Before (Broken)
```
Sanity Studio → [Build Time Cache] → Production (never updates)
```

### After (Fixed)
```
Sanity Studio → Webhook → Instant Update → Production ✓
                    ↓
              Time passes (60s) → Auto Refresh → Production ✓
```

---

## What Each Update Mechanism Does

### 1. Time-Based Revalidation (ISR)
- **Interval**: 60 seconds
- **How**: Next.js automatically checks for updates every 60s
- **When**: User visits a page that hasn't been refreshed in 60s
- **Good for**: Automatic background updates without webhooks

### 2. On-Demand Revalidation (Webhooks)
- **Speed**: Instant (< 1 second)
- **How**: Sanity calls your API when content changes
- **When**: You save/update/delete content in Sanity Studio
- **Good for**: Real-time updates for client editing

---

## What Gets Revalidated

### When you edit a Project:
- ✅ Homepage (project list updates)
- ✅ Project page (content updates)
- ✅ Menu (project appears/updates)
- ✅ All components showing project data

### When you edit About info:
- ✅ Footer (contact info updates)
- ✅ Menu (about section updates)
- ✅ All pages (layout revalidates)

### When you change a slug:
- ✅ Old URL shows 404
- ✅ New URL works immediately
- ✅ Homepage links update

---

## Troubleshooting

### Changes still not showing?

**1. Check webhook deliveries in Sanity:**
- Go to API → Webhooks → Your webhook → View deliveries
- Look for failed deliveries (red X)
- Check error messages

**2. Check Vercel logs:**
- Go to your Vercel project → Logs
- Look for `[Revalidation]` messages
- Check for errors

**3. Hard refresh your browser:**
- Chrome/Edge: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
- Firefox: `Ctrl+F5` (Windows) / `Cmd+Shift+R` (Mac)
- Safari: `Cmd+Option+R`

**4. Clear browser cache:**
- Sometimes browsers cache aggressively
- Try incognito/private mode

**5. Wait 60 seconds:**
- Even without webhooks, time-based revalidation will work
- Wait a full minute and refresh

**6. Redeploy:**
- Last resort: trigger a new deployment in Vercel
- This rebuilds everything from scratch

---

## Performance Impact

### Optimizations Made:
- ✅ Disabled Sanity CDN caching (ensures fresh data)
- ✅ ISR handles caching (better than CDN for dynamic content)
- ✅ Pages still statically generated (fast initial load)
- ✅ Only revalidates changed content (efficient)

### Expected Behavior:
- **First visitor after update**: Sees cached version, triggers revalidation in background
- **Subsequent visitors**: See updated version
- **With webhooks**: Everyone sees updates within 1-2 seconds

---

## Optional: Adjust Revalidation Time

If 60 seconds is too slow/fast, edit these files:

**`app/layout.tsx`, `app/page.tsx`, `app/projects/[slug]/page.tsx`:**
```typescript
// Change from 60 to your preferred seconds
export const revalidate = 60;
```

**Recommendations:**
- **High-traffic sites**: 300 seconds (5 minutes)
- **Medium traffic**: 60 seconds (1 minute)
- **Low traffic / real-time needs**: 10-30 seconds
- **Use webhooks for instant updates regardless**

---

## Summary

✅ **ISR enabled** - Pages update automatically every 60 seconds  
✅ **Revalidation API created** - Webhooks trigger instant updates  
✅ **Sanity CDN disabled** - Fresh data on every revalidation  
✅ **Static paths generated** - All project pages pre-rendered  

Your production site will now stay in sync with Sanity Studio automatically!

