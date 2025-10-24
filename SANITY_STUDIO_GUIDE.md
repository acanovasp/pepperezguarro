# Sanity Studio Access Guide

## 🌐 Studio URL

Your Sanity Studio is now live and accessible at:

**https://pepperez-portfolio.sanity.studio/**

## 👤 Client Access

To give your client access to the Sanity Studio:

### Option 1: Invite via Sanity Manage (Recommended)

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Select your project: **PepPerez** (vynr1qpf)
3. Go to **"Project Members"** in the left sidebar
4. Click **"Invite project members"**
5. Enter your client's email address
6. Select their role:
   - **Administrator** - Full access (manage members, billing, etc.)
   - **Editor** - Can create, edit, and delete content (recommended for clients)
   - **Viewer** - Read-only access
7. Click **"Send invites"**

Your client will receive an email with instructions to create a Sanity account (if they don't have one) and access the studio.

### Option 2: Direct Link

If your client already has a Sanity account with access to the project:
1. Send them the studio URL: https://pepperez-portfolio.sanity.studio/
2. They can log in with their Sanity credentials

## 📝 Content Management

Once logged in, your client can:

### Projects
- Create new projects
- Edit existing projects
- Upload images in bulk
- Reorder projects by changing the "Number" field
- Publish/unpublish projects

### About Section
- Edit bio, name, contact info
- Update collaborators and publications
- Manage social media links

## 🔄 Publishing Changes

Changes made in Sanity Studio are **immediately published** and will appear on the website within seconds (thanks to CDN caching).

## 🔧 Updating the Studio

To update the studio with new features or schemas:

```bash
# Build and deploy updates
npm run sanity:deploy
```

This will automatically update the live studio without any downtime.

## 🔒 Security & CORS

The studio is configured to work with your website. If you change domains or add new ones, you'll need to update CORS settings in the Sanity Manage dashboard.

## 📚 Resources

- **Sanity Documentation**: https://www.sanity.io/docs
- **Manage Dashboard**: https://www.sanity.io/manage/project/vynr1qpf
- **Studio URL**: https://pepperez-portfolio.sanity.studio/

---

**Note**: The first time someone logs into the studio, they may need to verify their email address.

