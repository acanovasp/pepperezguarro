# Fix Sanity API Access Error

## The Issue
You're getting a "Request error" when trying to fetch data from Sanity API. This is because your Sanity dataset needs to be configured for public access.

## Solution: Make Dataset Public

### Option 1: Via Sanity CLI (Fastest)

Run this command in your terminal:

```bash
npx sanity dataset visibility set public production
```

This will make your `production` dataset publicly readable.

### Option 2: Via Sanity Management UI

1. Go to: https://sanity.io/manage
2. Select your project: **"PepPerez"** (ID: vynr1qpf)
3. Go to **API** → **Datasets**
4. Find your `production` dataset
5. Change **Visibility** from **Private** to **Public**
6. Click **Save**

## Why This Works

- **Public dataset** = Can read published content without API token
- **Private dataset** = Requires API token for all reads (can cause CORS issues)

Since you're only showing published content on your website (not drafts), making it public is safe and recommended.

## Alternative: Configure CORS (If You Want to Keep Private)

If you prefer to keep the dataset private:

1. Go to: https://sanity.io/manage
2. Select your project: **"PepPerez"**
3. Go to **API** → **CORS Origins**
4. Click **Add CORS Origin**
5. Add:
   - **Origin**: `http://localhost:3000` (for development)
   - **Allow Credentials**: ✅ Checked
6. For production, also add your live domain

## After Making the Change

1. Restart your dev server:
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

2. The error should be gone! ✅

## Verify It's Working

Once you make the dataset public, check in your terminal/browser console - the errors should disappear and data should load smoothly.

