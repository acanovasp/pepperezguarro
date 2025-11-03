/**
 * Sanity client configuration
 * Provides clients for fetching data from Sanity
 */

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { config } from './config';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Server client for fetching data (used in server components)
 * Disabled CDN in production to ensure fresh content
 */
export const client = createClient({
  projectId: config.projectId,
  dataset: config.dataset,
  apiVersion: config.apiVersion,
  useCdn: false, // Disable CDN to get fresh data (ISR handles caching)
  // Token is optional for reading published content
  // Only needed if dataset is private
  ...(process.env.SANITY_API_TOKEN && { token: process.env.SANITY_API_TOKEN }),
  perspective: 'published',
  ignoreBrowserTokenWarning: true,
});

/**
 * Image URL builder for generating optimized image URLs
 */
const builder = imageUrlBuilder(client);

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

