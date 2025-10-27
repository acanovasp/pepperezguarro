/**
 * TypeScript interfaces for the photography portfolio
 * Designed to be CMS-agnostic for easy Sanity.io integration later
 */

export interface ProjectImage {
  id: string;
  url: string;
  alt: string;
  blurDataURL?: string;
  width: number;
  height: number;
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
  client?: string;
  date?: string;
}

export interface ContactInfo {
  display: string;
  link: string;
}

export interface AboutInfo {
  name: string;
  bio: string;
  contact: {
    email: ContactInfo;
    phone: ContactInfo;
    instagram: ContactInfo;
  };
  collaborators: string[];
  publications: string[];
}

export interface MenuSection {
  id: 'projects' | 'about' | 'project-info';
  title: string;
}

