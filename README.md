# Pep Perez Guarro - Photography Portfolio

A high-performance, minimalist photography portfolio website built with Next.js 14, TypeScript, and Swiper.js. Features smooth 60fps animations, exceptional performance (Lighthouse 95+), and a unique menu belt navigation system.

## 🚀 Features

- **Full-Screen Project Slider**: Homepage slider with smooth fade transitions and random image selection
- **Dynamic Project Pages**: Individual pages for each project with slideshow and grid views
- **Unique Menu Belt**: Left-edge navigation that expands on hover with automatic section switching
- **60fps Animations**: GPU-accelerated animations using CSS transforms and opacity
- **Random Image Positioning**: Images positioned randomly on project pages with ghost effect
- **Responsive Design**: Mobile-first approach with optimized layouts for all screen sizes
- **SEO Optimized**: Dynamic metadata, Open Graph tags, and semantic HTML
- **CMS-Ready**: Data abstraction layer designed for easy Sanity.io integration

## 🛠️ Tech Stack

### Core
- **Next.js 14+** with App Router
- **TypeScript** with strict mode
- **React 18+**
- **Node 18+**

### Key Libraries
- **Swiper.js v12+** for sliders/carousels

### Styling
- **Vanilla CSS** with CSS Modules
- **CSS Custom Properties** for theming
- Modern CSS: Grid, Flexbox, Container Queries

### Image Handling
- **Next.js Image** component for optimization
- **WebP/AVIF** formats
- Blur placeholders
- Lazy loading with preloading for critical images

## 📁 Project Structure

```
/app
  /projects/[slug]      # Dynamic project pages
    page.tsx           # Project page component
    loading.tsx        # Loading state
    error.tsx          # Error boundary
  layout.tsx           # Root layout with global menu
  page.tsx             # Homepage with project slider
  globals.css          # Global styles and CSS variables

/components
  /menu                # Menu belt components
    MenuBelt.tsx       # Main menu container
    ProjectsSection.tsx
    AboutSection.tsx
    ProjectInfoSection.tsx
  /sliders             # Slider components
    HomeSlider.tsx     # Homepage project slider
    ProjectSlider.tsx  # Project page slider
  /ui                  # Shared UI components
    ProjectInfo.tsx    # Project info display
    ImageGrid.tsx      # Grid view component

/lib
  data.ts              # Data layer with abstraction
  types.ts             # TypeScript interfaces

/public/images         # Project images organized by ID
  /project-1
  /project-2
  ...
```

## 🎨 Key Components

### Homepage
- Full-screen slider showcasing all projects
- Each slide displays a random image from the project (40dvh height)
- Project info at top center
- Image caption with counter and "Open project" link
- Navigation: arrows, keyboard, mouse wheel, touch swipe

### Project Pages
Two view modes with toggle:

**Slideshow View (Default):**
- Images positioned randomly on viewport
- Previous image visible as ghost (5% opacity)
- Click ghost to navigate to previous slide
- Toggle to grid view by clicking image counter

**Grid View:**
- Responsive thumbnail grid (2-6 columns based on screen)
- Each thumbnail shows image number
- Click to return to slideshow at that image

### Menu Belt
- 6px collapsed stripe on left edge (20px margin)
- Expands to full width on hover
- Three sections:
  1. **Projects Index**: All projects with navigation
  2. **About**: Photographer bio and contact
  3. **Project Info**: Current project details
- Spring animation (800ms)
- Close with Escape key or mouse leave

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## 📊 Performance Optimizations

- **GPU Acceleration**: All animations use `transform` and `opacity`
- **Image Optimization**: AVIF/WebP formats with Next.js Image
- **Code Splitting**: Dynamic imports for optimal bundle size
- **Layout Containment**: CSS `contain` for better rendering
- **Lazy Loading**: Images load on demand with blur placeholders
- **Tree Shaking**: Optimized package imports

## 🎯 CMS Integration Ready

The project is designed for easy CMS integration (Sanity.io):

### Current Setup (Phase 1)
- Local TypeScript data files
- Placeholder images from Picsum

### CMS Migration (Phase 2)
Simply update the data fetching functions in `lib/data.ts`:
- `getProjects()` → Fetch from Sanity
- `getProjectBySlug(slug)` → Fetch single project
- `getAboutInfo()` → Fetch about data

Components receive data via props - no refactoring needed!

## 🎨 Customization

### Colors
Edit CSS custom properties in `app/globals.css`:
```css
:root {
  --color-bg: #ffffff;
  --color-text: #000000;
  --color-menu-bg: #000000;
  --color-menu-text: #ffffff;
}
```

### Layout
Adjust spacing and sizing:
```css
:root {
  --image-height: 40dvh;
  --menu-height: 40dvh;
  --edge-margin: 20px;
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 480px (2 grid columns)
- **Tablet**: 481px - 768px (3-4 grid columns)
- **Desktop**: 769px - 1024px (4 grid columns)
- **Large**: > 1025px (6 grid columns)

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Touch-optimized for mobile

## 📄 License

All rights reserved. ©Pep Perez Guarro, 2025
Design & Code by Alvaro Canovas

## 🔄 Future Enhancements

- [ ] Sanity.io CMS integration
- [ ] Image upload and management
- [ ] Advanced filtering and search
- [ ] Social media sharing
- [ ] Analytics integration
- [ ] Progressive Web App (PWA)
