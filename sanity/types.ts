/**
 * Sanity-specific TypeScript types
 * These represent the raw data structure from Sanity
 */

import { PortableTextBlock } from '@portabletext/react';

export interface SanityImageAsset {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  metadata?: {
    lqip?: string;
    dimensions?: {
      width: number;
      height: number;
      aspectRatio: number;
    };
  };
}

export type ProjectCategory = 'project' | 'travel' | 'commercial' | 'editorial';

export interface SanityVideo {
  url: string;
  title?: string;
  thumbnail?: SanityImageAsset;
  aspectRatio?: string;
  customAspectRatio?: string;
  position?: number;
}

export interface SanityProject {
  _id: string;
  _type: 'project';
  category: ProjectCategory;
  number: number;
  title: string;
  slug: {
    current: string;
  };
  location: string;
  year: string;
  description: PortableTextBlock[];
  images: SanityImageAsset[];
  videos?: SanityVideo[];
  collaboration?: string;
  client?: string;
  date?: string;
}

export interface SanityAbout {
  _id: string;
  _type: 'about';
  name: string;
  bio: string;
  email: string;
  phone: string;
  phone2?: string;
  instagram: string;
  collaborators: string[];
  publications: string[];
}

