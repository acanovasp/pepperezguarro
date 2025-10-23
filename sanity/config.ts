/**
 * Sanity configuration
 * Contains project ID, dataset, and API version
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vynr1qpf';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2024-10-23'; // Use current date for API version

export const config = {
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use CDN for faster delivery and better caching
};

