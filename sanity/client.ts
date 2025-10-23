/**
 * Sanity client configuration
 * Provides clients for fetching data from Sanity
 */

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { config } from './config';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Public client for fetching published content (client-side safe)
 */
export const client = createClient({
  ...config,
  useCdn: true, // Use CDN for public client
});

/**
 * Server client with API token for fetching draft content
 * Only use in server-side functions
 */
export const serverClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/**
 * Image URL builder for generating optimized image URLs
 */
const builder = imageUrlBuilder(client);

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

