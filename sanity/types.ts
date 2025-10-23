/**
 * Sanity-specific TypeScript types
 * These represent the raw data structure from Sanity
 */

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

export interface SanityProject {
  _id: string;
  _type: 'project';
  number: number;
  title: string;
  slug: {
    current: string;
  };
  location: string;
  year: string;
  description: string;
  images: SanityImageAsset[];
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
  instagram: string;
  collaborators: string[];
  publications: string[];
}

