/**
 * Sanity schema for Project document type
 * Defines the structure for photography projects
 */

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Project category - affects numbering prefix (P01, T01, C01, E01)',
      options: {
        list: [
          { title: 'Project', value: 'project' },
          { title: 'Commercial', value: 'commercial' },
          { title: 'Travel', value: 'travel' },
          { title: 'Editorial', value: 'editorial' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'project',
    }),
    defineField({
      name: 'number',
      title: 'Number (within category)',
      type: 'number',
      description: 'Position within category (1, 2, 3, etc.). Each category has its own numbering.',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Auto-generated from title. Used in URL.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' }
          ],
          lists: [],
          marks: {
            decorators: [],
            annotations: []
          }
        }
      ],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Upload images in bulk. Alt text will be auto-generated as Title-01, Title-02, etc.',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true, // Enable image cropping
            metadata: ['lqip', 'palette'], // Generate low-quality placeholder and color palette
          },
          fields: [
            {
              name: 'featuredOnHomepage',
              title: 'Featured on Homepage',
              type: 'boolean',
              description: 'Check this to include this image in the homepage slider rotation. If no images are marked, all images will be eligible.',
              initialValue: false,
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      description: 'Add videos from Vimeo, YouTube, or other platforms. Videos will be displayed alongside images in the project slideshow.',
      of: [
        {
          type: 'object',
          name: 'video',
          title: 'Video',
          fields: [
            {
              name: 'url',
              title: 'Video URL',
              type: 'url',
              description: 'Full URL from Vimeo (https://vimeo.com/...) or YouTube (https://www.youtube.com/watch?v=...)',
              validation: (Rule) => Rule.required().uri({ scheme: ['https', 'http'] }),
            },
            {
              name: 'title',
              title: 'Video Title',
              type: 'string',
              description: 'Optional: Custom title for the video',
            },
            {
              name: 'thumbnail',
              title: 'Video Thumbnail',
              type: 'image',
              description: 'Thumbnail image for the video (shown in grid and as ghost image). If not provided, will use a placeholder.',
              options: {
                hotspot: true,
                metadata: ['lqip', 'palette'],
              },
            },
            {
              name: 'aspectRatio',
              title: 'Aspect Ratio',
              type: 'string',
              description: 'Video aspect ratio (e.g., "16:9", "4:3", "9:16", "1:1"). Default is 16:9 if not specified.',
              options: {
                list: [
                  { title: '16:9 (Landscape)', value: '16:9' },
                  { title: '9:16 (Portrait)', value: '9:16' },
                  { title: '4:3 (Standard)', value: '4:3' },
                  { title: '1:1 (Square)', value: '1:1' },
                  { title: '21:9 (Ultrawide)', value: '21:9' },
                  { title: 'Custom', value: 'custom' },
                ],
              },
              initialValue: '16:9',
            },
            {
              name: 'customAspectRatio',
              title: 'Custom Aspect Ratio',
              type: 'string',
              description: 'If "Custom" is selected above, enter aspect ratio as "width:height" (e.g., "2.35:1")',
              hidden: ({ parent }) => parent?.aspectRatio !== 'custom',
            },
            {
              name: 'position',
              title: 'Position in Gallery',
              type: 'number',
              description: 'Where to insert this video among the images (e.g., 3 = after the 3rd image). Leave empty to add at the end.',
              validation: (Rule) => Rule.integer().positive(),
            },
          ],
          preview: {
            select: {
              title: 'title',
              url: 'url',
            },
            prepare({ title, url }) {
              // Extract video ID for preview
              let provider = 'Video';
              if (url?.includes('vimeo.com')) {
                provider = 'Vimeo';
              } else if (url?.includes('youtube.com') || url?.includes('youtu.be')) {
                provider = 'YouTube';
              }
              return {
                title: title || 'Untitled Video',
                subtitle: `${provider} - ${url || 'No URL'}`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'collaboration',
      title: 'Collaboration',
      type: 'string',
      description: 'Optional: e.g., "In collaboration with Ana Gallart"',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      description: 'Optional: e.g., "Thinking Mu" or "Personal Project"',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'string',
      description: 'Optional: e.g., "Shot between April 12 - May 2"',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      number: 'number',
      category: 'category',
      media: 'images.0',
    },
    prepare({ title, number, category, media }) {
      // Get category prefix
      const prefixMap: Record<string, string> = {
        project: 'P',
        travel: 'T',
        commercial: 'C',
        editorial: 'E',
      };
      const prefix = prefixMap[category as string] || 'P';
      const formattedNumber = `${prefix}${String(number).padStart(2, '0')}`;
      
      return {
        title: `${formattedNumber}. ${title}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'By Number',
      name: 'numberAsc',
      by: [{ field: 'number', direction: 'asc' }],
    },
  ],
});

