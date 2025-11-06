import { Project, ProjectImage, ProjectVideo, MediaItem, AboutInfo, ContactInfo, VideoProvider } from './types';
import { client } from '../sanity/client';
import { urlForImage } from '../sanity/client';
import type { SanityProject, SanityAbout, SanityImageAsset, SanityVideo } from '../sanity/types';

/**
 * Data abstraction layer for portfolio content
 * Fetches from Sanity CMS with fallback to placeholder data
 */

const USE_SANITY = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'your_project_id';

// Helper to generate placeholder images (fallback)
function generateProjectImages(projectId: string, count: number): ProjectImage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${projectId}-${i + 1}`,
    url: `https://picsum.photos/seed/${projectId}-${i}/1200/800`,
    alt: `Image ${i + 1}`,
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
    width: 1200,
    height: 800
  }));
}

// Helper to convert images array to media array
function imagesToMedia(images: ProjectImage[]): MediaItem[] {
  return images.map(image => ({ type: 'image' as const, data: image }));
}

// Placeholder projects data (fallback when Sanity is not configured)
const placeholderProjects: Project[] = [
  {
    id: 'project-1',
    slug: 'ladakhi-bakers',
    title: 'Ladakhi Bakers',
    category: 'project',
    number: 1,
    formattedNumber: 'P01',
    location: 'India',
    year: '2025',
    description: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Last October, I traveled to India for a photography assignment for a brand. Taking advantage of the trip, I decided to explore the north of the country for a few days. Along the way, already in the Kashmir region, I saw a small oven where roti was being baked in a tandoor using a wood fire. The place, entirely made of wood, had beautiful lighting. I immediately approached and asked if I could photograph the process. Ana, my partner, is the biggest bread lover I know. Our travels revolve around it: we seek out bakeries, so that Ana can learn their techniques, share her love for bread, and photograph the processes. However, Ana wasn\'t with me on this trip. When I found that oven, I felt her presence through my camera. I started photographing every bakery I came across. It was my way of stepping into her shoes, though I soon realized that without her curiosity and her need to understand every gram of the process, something was missing.' }],
        style: 'normal'
      }
    ],
    images: generateProjectImages('ladakhi-bakers', 17),
    get media() { return imagesToMedia(this.images); },
    collaboration: 'In collaboration with Ana Gallart',
    client: 'Personal Project',
    date: 'Shot between April 12 - May 2'
  },
  {
    id: 'project-2',
    slug: '366-miralls',
    title: '366 Miralls',
    category: 'project',
    number: 2,
    formattedNumber: 'P02',
    location: 'Barcelona',
    year: 'Ongoing',
    description: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'An ongoing daily self-portrait project exploring identity, time, and self-perception through 366 different mirrors across Barcelona.' }],
        style: 'normal'
      }
    ],
    images: generateProjectImages('366-miralls', 12),
    get media() { return imagesToMedia(this.images); },
    collaboration: 'In collaboration with Ana Gallart',
    client: 'Personal Project',
    date: 'Shot between April 12 - May 2'
  },
  {
    id: 'project-3',
    slug: 'morocco',
    title: 'Moro(cc)o',
    category: 'travel',
    number: 1,
    formattedNumber: 'T01',
    location: 'Morocco',
    year: '2023',
    description: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Morocco is written with two consecutive c\'s. (Cc) Is a two-letter abbreviation for the term "cubic centimeters." Just as a car\'s engine displacement is measured in liters, a motorcycle engine displacement is measured in cubic centimeters. Moro[cc]o is a project made for the joy of traveling and taking photos during two short trips in Morocco.' }],
        style: 'normal'
      }
    ],
    images: generateProjectImages('morocco', 15),
    get media() { return imagesToMedia(this.images); }
  },
  {
    id: 'project-4',
    slug: 'factory-x-thinking-mu',
    title: 'Factory x Thinking Mu',
    category: 'commercial',
    number: 1,
    formattedNumber: 'C01',
    location: 'India',
    year: '2025',
    description: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'A documentary series showcasing sustainable fashion production in India, highlighting the ethical practices and craftsmanship of Thinking Mu factories.' }],
        style: 'normal'
      }
    ],
    images: generateProjectImages('factory-thinking-mu', 20),
    get media() { return imagesToMedia(this.images); },
    client: 'Thinking Mu',
    date: 'Shot between April 12 - May 2'
  },
  {
    id: 'project-5',
    slug: 'varanasi',
    title: 'Two days in Varanasi',
    category: 'travel',
    number: 2,
    formattedNumber: 'T02',
    location: 'India',
    year: '2024',
    description: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'A brief but intense visual journey through the spiritual heart of India, capturing the essence of Varanasi in just two days.' }],
        style: 'normal'
      }
    ],
    images: generateProjectImages('varanasi', 14),
    get media() { return imagesToMedia(this.images); },
    collaboration: 'In collaboration with Marius Uhlig',
    client: 'Personal Project',
    date: 'Shot between April 12 - May 2'
  }
];

// Placeholder about information (fallback)
const placeholderAbout: AboutInfo = {
  name: 'Pep Perez Guarro',
  bio: 'Pep is based between Paris and Barcelona. His approach to photography and directing is shaped by an exploration of timelessness, texture and authenticity.',
  contact: {
    email: {
      display: 'info@pepperezguarro.com',
      link: 'mailto:info@pepperezguarro.com'
    },
    phone: [
      {
        display: '+34 666 18 13 48',
        link: 'tel:+34666181348'
      },
      {
        display: '+33 767 65 76 43',
        link: 'tel:+33767657643'
      }
    ],
    instagram: {
      display: '@pepperezguarro',
      link: 'https://instagram.com/pepperezguarro'
    }
  },
  collaborators: [
    'ARKET',
    '16Arlington',
    'Atelier Franck Durand',
    'By Malene Birger',
    'COS',
    'D La Repubblica',
    'Dunhill',
    'Farfetch',
    'The Gentlewoman',
    'H&M',
    'JW Anderson',
    'JOSEPH',
    'KASSL Editions',
    'PANGAIA',
    'Re-Edition',
    'RIMOWA',
    'Sandro'
  ],
  publications: [
    'T: The New York Times',
    'Vogue',
    'WSJ. Magazine',
    'ZARA'
  ]
};

/**
 * Parse video URL and extract provider info and video ID
 */
function parseVideoUrl(url: string): { provider: VideoProvider; videoId: string } | null {
  try {
    const urlObj = new URL(url);
    
    // Vimeo
    if (urlObj.hostname.includes('vimeo.com')) {
      const videoId = urlObj.pathname.split('/').filter(Boolean)[0];
      if (videoId) {
        return { provider: 'vimeo', videoId };
      }
    }
    
    // YouTube
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId: string | null = null;
      
      // Standard YouTube URL: youtube.com/watch?v=VIDEO_ID
      if (urlObj.pathname === '/watch') {
        videoId = urlObj.searchParams.get('v');
      }
      // Short URL: youtu.be/VIDEO_ID
      else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.split('/').filter(Boolean)[0];
      }
      // Embed URL: youtube.com/embed/VIDEO_ID
      else if (urlObj.pathname.startsWith('/embed/')) {
        videoId = urlObj.pathname.split('/')[2];
      }
      
      if (videoId) {
        return { provider: 'youtube', videoId };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing video URL:', url, error);
    return null;
  }
}

/**
 * Parse aspect ratio string to number
 */
function parseAspectRatio(aspectRatioStr?: string, customAspectRatio?: string): number {
  const ratioString = aspectRatioStr === 'custom' && customAspectRatio ? customAspectRatio : aspectRatioStr;
  
  if (!ratioString) return 16 / 9; // Default
  
  // Handle formats like "16:9" or "2.35:1"
  const parts = ratioString.split(':').map(p => parseFloat(p.trim()));
  
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[1] !== 0) {
    return parts[0] / parts[1];
  }
  
  return 16 / 9; // Fallback to default
}

/**
 * Generate thumbnail URL for video based on provider
 */
function getVideoThumbnail(provider: VideoProvider, videoId: string, sanityThumbnail?: SanityImageAsset): string | undefined {
  // If Sanity thumbnail exists, use it
  if (sanityThumbnail) {
    // Don't force dimensions - let the image maintain its original aspect ratio
    // Just set max width for optimization
    const thumbnailUrl = urlForImage(sanityThumbnail)
      .width(1200) // Max width for quality, height calculated automatically
      .auto('format')
      .quality(80)
      .url();
    return thumbnailUrl;
  }
  
  // Fallback to provider thumbnails
  switch (provider) {
    case 'youtube':
      // YouTube provides reliable thumbnail URLs
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    case 'vimeo':
      // Vimeo thumbnails require API call, so we leave undefined if no Sanity thumbnail
      return undefined;
    default:
      return undefined;
  }
}

/**
 * Transform Sanity video to ProjectVideo format
 */
function transformSanityVideo(
  video: SanityVideo,
  projectTitle: string,
  index: number
): ProjectVideo | null {
  const parsed = parseVideoUrl(video.url);
  
  if (!parsed) {
    console.warn(`Unable to parse video URL: ${video.url}`);
    return null;
  }
  
  const { provider, videoId } = parsed;
  const thumbnailUrl = getVideoThumbnail(provider, videoId, video.thumbnail);
  const aspectRatio = parseAspectRatio(video.aspectRatio, video.customAspectRatio);
  
  return {
    id: `${projectTitle.toLowerCase().replace(/\s+/g, '-')}-video-${index + 1}`,
    url: video.url,
    provider,
    videoId,
    title: video.title,
    thumbnailUrl,
    aspectRatio,
  };
}

/**
 * Transform Sanity image to ProjectImage format
 * Generates optimized URLs and blur placeholders
 */
function transformSanityImage(
  image: SanityImageAsset,
  projectTitle: string,
  index: number
): ProjectImage {
  // Generate base URL without fixed dimensions to allow Next.js Image responsive optimization
  // Add auto format and quality settings for Sanity CDN
  const imageUrl = urlForImage(image)
    .auto('format') // Automatically serve WebP/AVIF when supported
    .quality(80) // Optimized quality for web (80 is sweet spot for performance)
    .url();
  
  const blurDataURL = image.metadata?.lqip || undefined;
  
  // Extract actual image dimensions from Sanity metadata
  const width = image.metadata?.dimensions?.width || 1200;
  const height = image.metadata?.dimensions?.height || 800;
  
  // Format: "ProjectTitle-01"
  const imageNumber = String(index + 1).padStart(2, '0');
  const alt = `${projectTitle}-${imageNumber}`;

  return {
    id: `${projectTitle.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
    url: imageUrl,
    alt,
    blurDataURL,
    width,
    height,
  };
}

/**
 * Get category prefix for formatted number
 */
function getCategoryPrefix(category: string): string {
  const prefixMap: Record<string, string> = {
    project: 'P',
    travel: 'T',
    commercial: 'C',
    editorial: 'E',
  };
  return prefixMap[category] || 'P';
}

/**
 * Create formatted number with category prefix (e.g., "P01", "T02")
 */
function formatProjectNumber(category: string, number: number): string {
  const prefix = getCategoryPrefix(category);
  return `${prefix}${String(number).padStart(2, '0')}`;
}

/**
 * Transform Sanity project to Project format
 * Combines images and videos into a unified media array
 */
function transformProject(sanityProject: SanityProject): Project {
  // Transform all images
  const images = sanityProject.images.map((img, index) =>
    transformSanityImage(img, sanityProject.title, index)
  );
  
  // Transform all videos (if any)
  const videos = (sanityProject.videos || [])
    .map((video, index) => transformSanityVideo(video, sanityProject.title, index))
    .filter((video): video is ProjectVideo => video !== null);
  
  // Create media array with proper positioning
  const media: MediaItem[] = [];
  
  // Start with all images
  images.forEach((image) => {
    media.push({ type: 'image', data: image });
  });
  
  // Insert videos at specified positions or append at end
  videos.forEach((video) => {
    const videoData = sanityProject.videos?.find(v => v.url === video.url);
    const position = videoData?.position;
    
    if (position && position > 0 && position <= media.length + 1) {
      // Insert at specified position (1-based index)
      media.splice(position - 1, 0, { type: 'video', data: video });
    } else {
      // Append at end if no position specified or invalid position
      media.push({ type: 'video', data: video });
    }
  });
  
  return {
    id: sanityProject._id,
    slug: sanityProject.slug.current,
    title: sanityProject.title,
    category: sanityProject.category,
    number: sanityProject.number,
    formattedNumber: formatProjectNumber(sanityProject.category, sanityProject.number),
    location: sanityProject.location,
    year: sanityProject.year,
    description: sanityProject.description,
    images, // Keep for backward compatibility
    media, // New unified media array
    collaboration: sanityProject.collaboration,
    client: sanityProject.client,
    date: sanityProject.date,
  };
}

/**
 * Transform Sanity about to AboutInfo format
 */
function transformAbout(sanityAbout: SanityAbout): AboutInfo {
  // Remove @ symbol if present and clean phone number
  const instagramHandle = sanityAbout.instagram.startsWith('@') 
    ? sanityAbout.instagram 
    : `@${sanityAbout.instagram}`;
  
  const instagramUsername = instagramHandle.replace('@', '');

  // Create array of phone ContactInfo objects
  const phones: ContactInfo[] = [
    {
      display: sanityAbout.phone,
      link: `tel:${sanityAbout.phone.replace(/\s+/g, '')}`,
    }
  ];

  // Add second phone if it exists
  if (sanityAbout.phone2) {
    phones.push({
      display: sanityAbout.phone2,
      link: `tel:${sanityAbout.phone2.replace(/\s+/g, '')}`,
    });
  }

  return {
    name: sanityAbout.name,
    bio: sanityAbout.bio,
    contact: {
      email: {
        display: sanityAbout.email,
        link: `mailto:${sanityAbout.email}`,
      },
      phone: phones,
      instagram: {
        display: instagramHandle,
        link: `https://instagram.com/${instagramUsername}`,
      },
    },
    collaborators: sanityAbout.collaborators || [],
    publications: sanityAbout.publications || [],
  };
}

/**
 * Get all projects
 * Fetches from Sanity or returns placeholder data
 */
export async function getProjects(): Promise<Project[]> {
  if (!USE_SANITY) {
    console.log('Using placeholder data (Sanity not configured)');
    return Promise.resolve(placeholderProjects);
  }

  try {
    const query = `*[_type == "project"] {
      _id,
      _type,
      category,
      number,
      title,
      slug,
      location,
      year,
      description,
      "images": images[]{
        ...,
        "metadata": asset->metadata
      },
      "videos": videos[]{
        url,
        title,
        "thumbnail": thumbnail{
          ...,
          "metadata": asset->metadata
        },
        aspectRatio,
        customAspectRatio,
        position
      },
      collaboration,
      client,
      date,
      "sortOrder": select(
        category == "project" => 1,
        category == "travel" => 2,
        category == "editorial" => 3,
        category == "commercial" => 4,
        5
      )
    } | order(sortOrder asc, number asc)`;

    const sanityProjects: SanityProject[] = await client.fetch(query);
    
    if (!sanityProjects || sanityProjects.length === 0) {
      console.warn('No projects found in Sanity, using placeholder data');
      return placeholderProjects;
    }

    return sanityProjects.map(transformProject);
  } catch (error) {
    console.error('Error fetching projects from Sanity:', error);
    return placeholderProjects;
  }
}

/**
 * Get single project by slug
 * Fetches from Sanity or returns placeholder data
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!USE_SANITY) {
    const project = placeholderProjects.find(p => p.slug === slug);
    return Promise.resolve(project || null);
  }

  try {
    const query = `*[_type == "project" && slug.current == $slug][0] {
      _id,
      _type,
      category,
      number,
      title,
      slug,
      location,
      year,
      description,
      "images": images[]{
        ...,
        "metadata": asset->metadata
      },
      "videos": videos[]{
        url,
        title,
        "thumbnail": thumbnail{
          ...,
          "metadata": asset->metadata
        },
        aspectRatio,
        customAspectRatio,
        position
      },
      collaboration,
      client,
      date
    }`;

    const sanityProject: SanityProject | null = await client.fetch(query, { slug });
    
    if (!sanityProject) {
      // Fallback to placeholder data
      const project = placeholderProjects.find(p => p.slug === slug);
      return project || null;
    }

    return transformProject(sanityProject);
  } catch (error) {
    console.error('Error fetching project from Sanity:', error);
    const project = placeholderProjects.find(p => p.slug === slug);
    return project || null;
  }
}

/**
 * Get about information
 * Fetches from Sanity or returns placeholder data
 */
export async function getAboutInfo(): Promise<AboutInfo> {
  if (!USE_SANITY) {
    return Promise.resolve(placeholderAbout);
  }

  try {
    const query = `*[_type == "about"][0] {
      _id,
      _type,
      name,
      bio,
      email,
      phone,
      phone2,
      instagram,
      collaborators,
      publications
    }`;

    const sanityAbout: SanityAbout | null = await client.fetch(query);
    
    if (!sanityAbout) {
      console.warn('No about document found in Sanity. Create one in Sanity Studio.');
      return placeholderAbout;
    }

    return transformAbout(sanityAbout);
  } catch (error) {
    console.error('Error fetching about info from Sanity:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return placeholderAbout;
  }
}

/**
 * Get all project slugs (for static generation)
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  if (!USE_SANITY) {
    return Promise.resolve(placeholderProjects.map(p => p.slug));
  }

  try {
    const query = `*[_type == "project"].slug.current`;
    const slugs: string[] = await client.fetch(query);
    
    if (!slugs || slugs.length === 0) {
      return placeholderProjects.map(p => p.slug);
    }

    return slugs;
  } catch (error) {
    console.error('Error fetching project slugs from Sanity:', error);
    return placeholderProjects.map(p => p.slug);
  }
}
