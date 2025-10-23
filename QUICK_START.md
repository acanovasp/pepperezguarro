# Quick Start: Sanity CMS

## ✅ What's Done

Your website is now fully integrated with Sanity CMS. All the code is ready!

## 🚀 Next Steps (5 minutes)

### 1. Create Environment File

Create a file named `.env.local` in the project root:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=vynr1qpf
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=
```

### 2. Start Sanity Studio

```bash
npm run sanity:dev
```

Visit `http://localhost:3333` - this is your content management interface!

### 3. Add Your First Project

In the Sanity Studio:
1. Click "Projects"
2. Click "Create new"
3. Fill in the project details:
   - Title: "Your Project Name"
   - Click "Generate" next to Slug
   - Location: "Paris"
   - Year: "2025"
   - Description: "Your project description"
   - Images: Click "Add item" and upload photos
4. Click "Publish"

### 4. Add About Information

1. Click "About Information"
2. Fill in your details
3. Click "Publish"

### 5. Test Your Website

```bash
npm run dev
```

Visit `http://localhost:3000` - your content from Sanity will appear!

### 6. Deploy Studio (Optional)

```bash
npm run sanity:deploy
```

Access your studio anywhere at: `https://pepperezguarro.sanity.studio/`

## 📚 Full Documentation

See `SANITY_SETUP.md` for complete documentation.

## 🎯 Key Points

- **No rebuild needed**: Changes in Sanity appear immediately
- **Images auto-optimized**: All images are automatically optimized
- **Global CDN**: Content served from Sanity's fast global network
- **Type-safe**: Full TypeScript support throughout

## 🔗 Useful Links

- **Sanity Dashboard**: https://www.sanity.io/manage/personal/project/vynr1qpf
- **Sanity Docs**: https://www.sanity.io/docs
- **Your Studio**: http://localhost:3333 (after running `npm run sanity:dev`)

That's it! You're ready to manage your portfolio content! 🎉

