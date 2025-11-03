import { Project, ProjectImage, AboutInfo } from './types';
import { client } from '../sanity/client';
import { urlForImage } from '../sanity/client';
import type { SanityProject, SanityAbout, SanityImageAsset } from '../sanity/types';

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
    description: 'Last October, I traveled to India for a photography assignment for a brand. Taking advantage of the trip, I decided to explore the north of the country for a few days. Along the way, already in the Kashmir region, I saw a small oven where roti was being baked in a tandoor using a wood fire. The place, entirely made of wood, had beautiful lighting. I immediately approached and asked if I could photograph the process. Ana, my partner, is the biggest bread lover I know. Our travels revolve around it: we seek out bakeries, so that Ana can learn their techniques, share her love for bread, and photograph the processes. However, Ana wasn\'t with me on this trip. When I found that oven, I felt her presence through my camera. I started photographing every bakery I came across. It was my way of stepping into her shoes, though I soon realized that without her curiosity and her need to understand every gram of the process, something was missing.',
    images: generateProjectImages('ladakhi-bakers', 17),
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
    description: 'An ongoing daily self-portrait project exploring identity, time, and self-perception through 366 different mirrors across Barcelona.',
    images: generateProjectImages('366-miralls', 12),
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
    description: 'Morocco is written with two consecutive c\'s. (Cc) Is a two-letter abbreviation for the term "cubic centimeters." Just as a car\'s engine displacement is measured in liters, a motorcycle engine displacement is measured in cubic centimeters. Moro[cc]o is a project made for the joy of traveling and taking photos during two short trips in Morocco.',
    images: generateProjectImages('morocco', 15)
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
    description: 'A documentary series showcasing sustainable fashion production in India, highlighting the ethical practices and craftsmanship of Thinking Mu factories.',
    images: generateProjectImages('factory-thinking-mu', 20),
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
    description: 'A brief but intense visual journey through the spiritual heart of India, capturing the essence of Varanasi in just two days.',
    images: generateProjectImages('varanasi', 14),
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
    phone: {
      display: 'ES +34 681 378 920',
      link: 'tel:+34681378920'
    },
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
 */
function transformProject(sanityProject: SanityProject): Project {
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
    images: sanityProject.images.map((img, index) =>
      transformSanityImage(img, sanityProject.title, index)
    ),
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

  return {
    name: sanityAbout.name,
    bio: sanityAbout.bio,
    contact: {
      email: {
        display: sanityAbout.email,
        link: `mailto:${sanityAbout.email}`,
      },
      phone: {
        display: sanityAbout.phone,
        link: `tel:${sanityAbout.phone.replace(/\s+/g, '')}`,
      },
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
