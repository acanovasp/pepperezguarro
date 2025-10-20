import { Project, ProjectImage, AboutInfo } from './types';

/**
 * Data abstraction layer for portfolio content
 * This layer is designed to be swapped with CMS (Sanity.io) without changing components
 */

// Helper to generate placeholder images
function generateProjectImages(projectId: string, count: number): ProjectImage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${projectId}-${i + 1}`,
    url: `https://picsum.photos/seed/${projectId}-${i}/1200/800`,
    alt: `Image ${i + 1}`,
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
  }));
}

// Placeholder projects data
const projects: Project[] = [
  {
    id: 'project-1',
    slug: 'ladakhi-bakers',
    title: 'Ladakhi Bakers',
    location: 'India',
    year: '2025',
    description: 'Last October, I traveled to India for a photography assignment for a brand. Taking advantage of the trip, I decided to explore the north of the country for a few days. Along the way, already in the Kashmir region, I saw a small oven where roti was being baked in a tandoor using a wood fire. The place, entirely made of wood, had beautiful lighting. I immediately approached and asked if I could photograph the process. Ana, my partner, is the biggest bread lover I know. Our travels revolve around it: we seek out bakeries, so that Ana can learn their techniques, share her love for bread, and photograph the processes. However, Ana wasn’t with me on this trip. When I found that oven, I felt her presence through my camera. I started photographing every bakery I came across. It was my way of stepping into her shoes, though I soon realized that without her curiosity and her need to understand every gram of the process, something was missing.',
    images: generateProjectImages('ladakhi-bakers', 17),
    collaboration: 'In collaboration with Ana Gallart',
    client: 'Personal Project',
    date: 'Shot between April 12 - May 2'
  },
  {
    id: 'project-2',
    slug: '366-miralls',
    title: '366 Miralls',
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
    location: 'Morocco',
    year: '2023',
    description: 'Morocco is written with two consecutive c’s. (Cc) Is a two-letter abbreviation for the term "cubic centimeters." Just as a car’s engine displacement is measured in liters, a motorcycle engine displacement is measured in cubic centimeters. Moro[cc]o is a project made for the joy of traveling and taking photos during two short trips in Morocco.',
    images: generateProjectImages('morocco', 15)
  },
  {
    id: 'project-4',
    slug: 'factory-x-thinking-mu',
    title: 'Factory x Thinking Mu',
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
    location: 'India',
    year: '2024',
    description: 'A brief but intense visual journey through the spiritual heart of India, capturing the essence of Varanasi in just two days.',
    images: generateProjectImages('varanasi', 14),
    collaboration: 'In collaboration with Marius Uhlig',
    client: 'Personal Project',
    date: 'Shot between April 12 - May 2'
  }
];

// About information
const aboutInfo: AboutInfo = {
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
 * Get all projects
 * This function can be easily swapped to fetch from CMS
 */
export async function getProjects(): Promise<Project[]> {
  // Simulate async operation (for future CMS integration)
  return Promise.resolve(projects);
}

/**
 * Get single project by slug
 * This function can be easily swapped to fetch from CMS
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const project = projects.find(p => p.slug === slug);
  return Promise.resolve(project || null);
}

/**
 * Get about information
 * This function can be easily swapped to fetch from CMS
 */
export async function getAboutInfo(): Promise<AboutInfo> {
  return Promise.resolve(aboutInfo);
}

/**
 * Get all project slugs (for static generation)
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  return Promise.resolve(projects.map(p => p.slug));
}

