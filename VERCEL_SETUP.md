# Vercel + Sanity Setup Guide

## 🚨 Issue: Placeholder Data Showing on Deployed Site

Your deployed site is showing placeholder projects because the Sanity environment variables are missing in Vercel.

## ✅ Solution: Add Environment Variables to Vercel

### Step 1: Create Local `.env.local` File

Create a file named `.env.local` in your project root with this content:

```env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=vynr1qpf
NEXT_PUBLIC_SANITY_DATASET=production
```

**Note:** This file is already in `.gitignore` and won't be committed to git.

### Step 2: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard:
   **https://vercel.com/your-team/pepperezguarro/settings/environment-variables**

2. Add the following environment variables:

   | Name | Value | Environments |
   |------|-------|-------------|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | `vynr1qpf` | ✅ Production, ✅ Preview, ✅ Development |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` | ✅ Production, ✅ Preview, ✅ Development |

3. Click **"Save"** for each variable

### Step 3: Redeploy Your Site

After adding the environment variables, you need to trigger a new deployment:

**Option A: Via Vercel Dashboard**
- Go to the "Deployments" tab
- Click the three dots on the latest deployment
- Click "Redeploy"

**Option B: Via Git**
```bash
git add .
git commit -m "Fix: Add Sanity environment variables"
git push
```

### Step 4: Verify CORS Settings

Make sure your Vercel domain is added to Sanity CORS:

1. Go to: https://www.sanity.io/manage/project/vynr1qpf/api
2. Under **"CORS Origins"**, add:
   - `https://pepperezguarro.vercel.app` (your current domain)
   - Your custom domain when you add one (e.g., `https://pepperezguarro.com`)
3. Check **"Allow credentials"**: ✅ Yes
4. Click **"Add origin"**

## 🔍 How to Check If It's Working

After redeploying:

1. Visit your Vercel site: https://pepperezguarro.vercel.app
2. You should see the **actual projects from Sanity** instead of placeholder data
3. Check the browser console - you shouldn't see any Sanity errors
4. Changes you make in Sanity Studio should appear on the site within seconds

## 🐛 Troubleshooting

### Still seeing placeholder data?

1. **Check environment variables are set:**
   - Go to Vercel → Settings → Environment Variables
   - Verify both variables are present

2. **Force a fresh deployment:**
   ```bash
   # Clear Vercel cache
   vercel --prod --force
   ```

3. **Check Vercel deployment logs:**
   - Go to your deployment in Vercel
   - Click on "Functions" tab
   - Look for any errors related to Sanity

### Getting Sanity errors?

1. **Verify CORS is configured correctly:**
   - Make sure `https://pepperezguarro.vercel.app` is in the allowed origins
   - Check "Allow credentials" is enabled

2. **Check your dataset is public:**
   - Go to: https://www.sanity.io/manage/project/vynr1qpf/api
   - Under "Datasets", make sure `production` dataset has public read access

## 📝 Optional: API Token for Private Datasets

If you want to make your dataset private, you'll need to add an API token:

1. Create token: https://www.sanity.io/manage/project/vynr1qpf/api#tokens
2. Give it "Viewer" permissions
3. Add to `.env.local` and Vercel:
   ```env
   SANITY_API_TOKEN=your_token_here
   ```

---

**After following these steps, your Vercel deployment should load real data from Sanity!** 🎉

