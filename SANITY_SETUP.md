# Sanity CMS Setup Guide

Complete guide to set up and use Sanity CMS for your photography portfolio.

## Prerequisites

- Node.js and npm installed
- Sanity account created at [sanity.io](https://sanity.io)
- Project ID: `vynr1qpf`
- Organization ID: `og6xO2mOP`

## Step 1: Configure Environment Variables

1. Create a `.env.local` file in the project root (if not already created):

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=vynr1qpf
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
```

2. Generate an API token:
   - Go to [sanity.io/manage](https://sanity.io/manage)
   - Select your project "PepPerez"
   - Go to **API** → **Tokens**
   - Click **Add API token**
   - Name it: "Production Website Token"
   - Permissions: **Viewer** (read-only is sufficient for public site)
   - Copy the token and paste it in `.env.local` as `SANITY_API_TOKEN`

3. **Important**: Never commit `.env.local` to git (it's already in .gitignore)

## Step 2: Start Sanity Studio

1. Open a terminal and run:

```bash
npm run sanity
```

2. This will start Sanity Studio at `http://localhost:3333`

3. You'll be prompted to log in to Sanity (if not already logged in)

4. The Studio interface will open in your browser

## Step 3: Create About Information

1. In Sanity Studio, click on **About** in the left sidebar

2. Fill in all fields:
   - **Name**: Your full name (e.g., "Pep Perez Guarro")
   - **Bio**: Brief bio text
   - **Email**: Contact email (e.g., "info@pepperezguarro.com")
   - **Phone**: Phone number with country code (e.g., "+34 681 378 920")
   - **Instagram Handle**: Your Instagram handle (include @ or not, both work)
   - **Collaborators**: Click "Add item" for each brand/company
   - **Publications**: Click "Add item" for each publication

3. Click **Publish** (bottom right)

## Step 4: Create Your First Project

1. In Sanity Studio, click on **Projects** in the left sidebar

2. Click **Create new project** button (bottom right)

3. Fill in all required fields:

   **Required Fields:**
   - **Project Number (Position)**: Enter a number (1, 2, 3, etc.) to control the order
   - **Title**: Project title (e.g., "Ladakhi Bakers")
   - **Slug**: Click "Generate" to auto-create from title
   - **Location**: Where the project was shot (e.g., "India")
   - **Year**: Year of the project (e.g., "2025")
   - **Description**: Full project description (can be long text)
   
   **Optional Fields:**
   - **Collaboration**: e.g., "In collaboration with Ana Gallart"
   - **Client**: e.g., "Personal Project" or "Thinking Mu"
   - **Date**: e.g., "Shot between April 12 - May 2"

4. **Upload Images:**
   - Scroll to **Images** field
   - Click **Select** or drag and drop images
   - You can upload multiple images at once (bulk upload)
   - Recommended: Use webp format, max 2000px wide for best performance
   - Alt text will be auto-generated as: `ProjectTitle-01`, `ProjectTitle-02`, etc.

5. Click **Publish** when done

## Step 5: Reorder Projects

Projects are ordered by the **Project Number (Position)** field:
- Project with number `1` appears first
- Project with number `2` appears second
- And so on...

To reorder projects:
1. Edit the project
2. Change the **Project Number (Position)** field
3. Publish the changes

## Step 6: Test Your Website

1. In a new terminal window, start your Next.js development server:

```bash
npm run dev
```

2. Open `http://localhost:3000` in your browser

3. You should now see content from Sanity!

## Image Upload Best Practices

### Recommended Image Specs:
- **Format**: WebP (best) or JPEG
- **Dimensions**: 1920px × 1280px (3:2 ratio) or similar
- **File size**: Under 2MB per image (Sanity will optimize further)
- **Color profile**: sRGB

### Bulk Upload:
- You can upload 70+ images at once
- Drag and drop works for multiple files
- Images will maintain the order you uploaded them
- Image numbers auto-generate: Title-01, Title-02, etc.

### Image Optimization:
Sanity automatically:
- Generates blur placeholders (LQIP)
- Creates multiple sizes for responsive images
- Serves images via global CDN
- Converts to modern formats (AVIF, WebP)

## Managing Content

### Editing a Project:
1. Go to **Projects** in Sanity Studio
2. Click on the project you want to edit
3. Make your changes
4. Click **Publish** to go live

### Deleting a Project:
1. Open the project
2. Click the three dots menu (top right)
3. Select **Delete**
4. Confirm deletion

### Unpublishing (Hide without Deleting):
1. Open the project
2. Click the three dots menu (top right)
3. Select **Unpublish**

## Deployment

### Deploy Sanity Studio:

To deploy Sanity Studio to the web (so you can edit content from anywhere):

```bash
npm run sanity:deploy
```

This will deploy Studio to: `https://pepperez.sanity.studio`

You can then access it from any device without running locally.

### Deploy Next.js Website:

Your Next.js website will automatically fetch content from Sanity when deployed to Vercel or any hosting platform. Just make sure to:

1. Add environment variables to your hosting platform:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID=vynr1qpf`
   - `NEXT_PUBLIC_SANITY_DATASET=production`
   - `SANITY_API_TOKEN=your_token_here`

2. Deploy as normal

## Troubleshooting

### "No projects found" or showing placeholder data:

**Check:**
1. Environment variables are set correctly in `.env.local`
2. Projects are **published** (not just saved as draft)
3. API token has correct permissions
4. Sanity Studio is running without errors

**Solution:**
- Restart Next.js dev server after changing `.env.local`
- Check browser console for error messages
- Verify projects are published in Sanity Studio

### Images not loading:

**Check:**
1. Images are uploaded and visible in Sanity Studio
2. `cdn.sanity.io` is in `next.config.ts` remotePatterns
3. Browser console for CORS or network errors

**Solution:**
- Re-upload images if corrupted
- Check network tab in browser dev tools
- Verify image URLs are correct

### "Cannot find module" errors:

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Slug conflicts:

Each project must have a unique slug. If you get a slug conflict:
1. Edit the project with the conflicting slug
2. Change the slug manually
3. Publish

## Content Structure Reference

### Project Fields:
```typescript
{
  number: number;           // Order/position (1, 2, 3...)
  title: string;            // "Ladakhi Bakers"
  slug: string;             // "ladakhi-bakers" (auto-generated)
  location: string;         // "India"
  year: string;             // "2025"
  description: string;      // Long description text
  images: image[];          // Array of images (70+ supported)
  collaboration?: string;   // Optional
  client?: string;          // Optional
  date?: string;           // Optional
}
```

### About Fields:
```typescript
{
  name: string;            // "Pep Perez Guarro"
  bio: string;             // Bio text
  email: string;           // "info@example.com"
  phone: string;           // "+34 681 378 920"
  instagram: string;       // "@pepperezguarro"
  collaborators: string[]; // Array of brand names
  publications: string[];  // Array of publication names
}
```

## Useful Commands

```bash
# Start Next.js development server
npm run dev

# Start Sanity Studio locally
npm run sanity

# Build Sanity Studio for production
npm run sanity:build

# Deploy Sanity Studio to the web
npm run sanity:deploy

# Build Next.js for production
npm run build

# Start Next.js production server
npm run start
```

## Support & Resources

- **Sanity Documentation**: [sanity.io/docs](https://www.sanity.io/docs)
- **Sanity Management**: [sanity.io/manage](https://www.sanity.io/manage)
- **Sanity Community**: [slack.sanity.io](https://slack.sanity.io)
- **Next.js Image Docs**: [nextjs.org/docs/pages/building-your-application/optimizing/images](https://nextjs.org/docs/pages/building-your-application/optimizing/images)

## Quick Reference: First Time Setup Checklist

- [ ] Add API token to `.env.local`
- [ ] Run `npm run sanity` to start Studio
- [ ] Create About information
- [ ] Create first project with images
- [ ] Publish all content
- [ ] Test website at `http://localhost:3000`
- [ ] Deploy Sanity Studio with `npm run sanity:deploy`
- [ ] Add environment variables to hosting platform
- [ ] Deploy Next.js website

---

**Note**: The website will show placeholder data if Sanity is not configured or if there are any errors. This ensures the site never breaks even during initial setup.

