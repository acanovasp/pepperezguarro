/**
 * TypeScript interfaces for the photography portfolio
 * Designed to be CMS-agnostic for easy Sanity.io integration later
 */

import { PortableTextBlock } from '@portabletext/react';

export interface ProjectImage {
  id: string;
  url: string;
  alt: string;
  blurDataURL?: string;
  width: number;
  height: number;
}

export type ProjectCategory = 'project' | 'travel' | 'commercial' | 'editorial';

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  number: number; // Raw number (1, 2, 3, etc.)
  formattedNumber: string; // Formatted with prefix (P01, T01, etc.)
  location: string;
  year: string;
  description: PortableTextBlock[];
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
    phone: ContactInfo[];
    instagram: ContactInfo;
  };
  collaborators: string[];
  publications: string[];
}

export interface MenuSection {
  id: 'projects' | 'about' | 'project-info';
  title: string;
}

