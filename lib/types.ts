/**
 * TypeScript interfaces for the photography portfolio
 * Designed to be CMS-agnostic for easy Sanity.io integration later
 */

export interface ProjectImage {
  id: string;
  url: string;
  alt: string;
  blurDataURL?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  year: string;
  description: string;
  images: ProjectImage[];
  collaboration?: string;
}

export interface AboutInfo {
  name: string;
  bio: string;
  contact: {
    email: string;
    phone: string;
    instagram: string;
  };
  collaborators: string[];
  publications: string[];
}

export interface MenuSection {
  id: 'projects' | 'about' | 'project-info';
  title: string;
}

