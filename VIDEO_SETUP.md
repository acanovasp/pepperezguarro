# Video Support Documentation

## Overview

Your photography portfolio now supports videos alongside images! Videos can be added from **Vimeo** (free/paid), **YouTube** (free), or other video platforms. Videos seamlessly integrate with the existing slideshow and grid view.

## ✅ What Was Added

### 1. **Sanity Schema Updates**
- Added `videos` field to projects in Sanity Studio
- Each video has:
  - `url`: The video URL (Vimeo, YouTube, etc.)
  - `title`: Optional custom title
  - `thumbnailUrl`: Optional custom thumbnail
  - `position`: Where to insert video among images (optional)

### 2. **New Components**
- `VideoPlayer` component with:
  - ✅ Lazy loading (loads only when in viewport)
  - ✅ Intersection Observer for performance
  - ✅ Auto-detects Vimeo vs YouTube
  - ✅ Privacy-enhanced embeds
  - ✅ Responsive aspect ratio

### 3. **Updated Components**
- `ProjectSlider`: Now handles both images and videos
- `ImageGrid`: Shows video thumbnails with play icon indicator
- `HomeSlider`: Intelligently selects random images (not videos)
- All counters show "Items" instead of "Images"

### 4. **Type System**
- New types: `ProjectVideo`, `MediaItem`, `VideoProvider`
- Backward compatible: `project.images` still works
- New unified array: `project.media` (images + videos combined)

## 🎥 How to Add Videos

### Step 1: Get Your Video URL

**For Vimeo (Free/Pro):**
1. Upload video to vimeo.com
2. Copy the URL (e.g., `https://vimeo.com/123456789`)
3. In video settings, set privacy to "Unlisted" or "Hide from Vimeo"

**For YouTube:**
1. Upload video to youtube.com
2. Set visibility to "Unlisted" (recommended for portfolios)
3. Copy the URL (e.g., `https://www.youtube.com/watch?v=abcdefghijk`)

### Step 2: Add Video in Sanity Studio

1. Open your project in Sanity Studio
2. Navigate to the project you want to add video to
3. Scroll to the **"Videos"** section
4. Click **"Add item"**
5. Fill in:
   - **Video URL** (required): Paste your Vimeo or YouTube URL
   - **Video Title** (optional): Custom display name
   - **Custom Thumbnail URL** (optional): Custom thumbnail image
   - **Position in Gallery** (optional): Insert at specific position (e.g., `3` = after 3rd image)

6. Click **"Publish"**

### Step 3: That's It!

The video will automatically:
- ✅ Appear in the slideshow
- ✅ Show in the grid view with a play icon
- ✅ Lazy load for performance
- ✅ Adapt to Vimeo/YouTube automatically

## 📐 Video Positioning

Videos can be inserted at specific positions:

```
Images: 1, 2, 3, 4, 5
Position: 3 → Video appears after image 3

Result: 1, 2, 3, VIDEO, 4, 5
```

If no position is specified, videos are appended at the end.

## 🎨 Supported Video Providers

### ✅ Vimeo (Recommended)
- **Free Plan**: 5GB storage, 10 videos max, small logo
- **Pro Plan**: $20/month, 250GB, no branding
- **Embed Quality**: Excellent
- **Example URL**: `https://vimeo.com/123456789`

### ✅ YouTube
- **Free Forever**: Unlimited storage & bandwidth
- **Embed Quality**: Excellent
- **Note**: Shows YouTube branding
- **Example URL**: `https://www.youtube.com/watch?v=abc123`

### ⚠️ Other Providers
- Direct embed URLs will be used as-is
- May require additional configuration

## 🚀 Performance Features

### Automatic Optimizations:
- **Lazy Loading**: Videos load only when scrolled into view
- **Intersection Observer**: 50px margin for smooth loading
- **Thumbnail Preload**: Shows thumbnail before video loads
- **Adaptive Streaming**: Vimeo/YouTube handle quality automatically
- **Privacy Mode**: Uses `youtube-nocookie.com` and Vimeo DNT

### Bandwidth Considerations:
- Videos only load when user scrolls to them
- No impact on initial page load
- Thumbnails are lightweight images

## 📝 Example Project Structure

```javascript
// In Sanity:
Project: "Ladakhi Bakers"
├── Images (17)
│   ├── ladakhi-bakers-01.jpg
│   ├── ladakhi-bakers-02.jpg
│   └── ...
└── Videos (2)
    ├── Video 1
    │   ├── URL: https://vimeo.com/123456789
    │   ├── Title: "Behind the Scenes"
    │   └── Position: 5 (after 5th image)
    └── Video 2
        ├── URL: https://www.youtube.com/watch?v=abc123
        └── Position: (not set - will append at end)

// Result in slideshow:
1-4: Images
5: Images
6: Video 1 (Behind the Scenes)
7-17: Images
18: Video 2
```

## 🔧 Technical Details

### Video Embed Parameters

**Vimeo:**
```
?dnt=1              // Do not track (privacy)
&title=0            // Hide title
&byline=0           // Hide author
&portrait=0         // Hide avatar
&autopause=0        // Don't pause on blur
```

**YouTube:**
```
?rel=0              // Only show related from same channel
&modestbranding=1   // Minimal branding
&enablejsapi=1      // Enable API for future features
```

### Aspect Ratio
- Default: 16:9 (1.777)
- Automatically calculated for responsive display
- Matches slideshow image height (40dvh)

## 🎯 Best Practices

### For Vimeo:
1. Start with **free plan** to test
2. Set videos to "Unlisted" or "Hide from Vimeo"
3. Enable embedding on your domain
4. Use custom thumbnails for brand consistency

### For YouTube:
1. Set videos to **"Unlisted"** (not private)
2. Use a professional channel name
3. Disable comments if desired
4. Consider YouTube Premium to remove ads for viewers

### General:
1. **Video Length**: Keep under 3 minutes for portfolios
2. **Quality**: Upload at 1080p minimum
3. **Format**: MP4 (H.264) is universally supported
4. **Thumbnails**: 1920x1080 JPG for best quality
5. **Positioning**: Place videos strategically to break up image galleries

## 🐛 Troubleshooting

### Video not showing?
- ✅ Check URL is correct (https://...)
- ✅ Ensure video is not private
- ✅ Enable embedding in video settings
- ✅ Check browser console for errors

### Video shows but won't play?
- ✅ Check video privacy settings on Vimeo/YouTube
- ✅ Try incognito mode to test
- ✅ Ensure video is not region-restricted

### Slow loading?
- ✅ Videos lazy load automatically (no action needed)
- ✅ Add custom thumbnails for faster preview
- ✅ Consider shorter video lengths

## 📊 Cost Comparison

| Provider | Free Plan | Paid Plan | Best For |
|----------|-----------|-----------|----------|
| **Vimeo** | 5GB, 10 videos | $20/mo, 250GB | Professional portfolios |
| **YouTube** | Unlimited | N/A | Budget-friendly, high traffic |
| **Bunny.net** | N/A | $5/mo, 1TB | Scaling up (future) |

## 🎓 Video Provider Setup Guides

### Vimeo Setup:
1. Create account at vimeo.com
2. Upload video
3. Settings → Privacy → "Unlisted"
4. Settings → Embed → Enable "Allow embedding"
5. Copy video URL
6. Paste into Sanity

### YouTube Setup:
1. Create YouTube channel
2. Upload video
3. Visibility → "Unlisted"
4. Advanced settings → Allow embedding
5. Copy video URL
6. Paste into Sanity

## 🔮 Future Enhancements

Potential future features:
- [ ] Auto-fetch Vimeo thumbnails via API
- [ ] Video autoplay options
- [ ] Fullscreen mode
- [ ] Video captions/subtitles
- [ ] Analytics integration

---

## Need Help?

If videos aren't working as expected:
1. Check the Sanity Studio console for errors
2. Verify video URLs are publicly accessible
3. Test embed codes directly in HTML
4. Check Next.js build output for warnings

**Your video support is now fully functional and production-ready! 🎉**

