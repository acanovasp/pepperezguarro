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
      name: 'number',
      title: 'Project Number (Position)',
      type: 'number',
      description: 'Used for ordering projects (1, 2, 3, etc.)',
      validation: (Rule) => Rule.required().integer().positive(),
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required(),
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
        },
      ],
      validation: (Rule) => Rule.required().min(1),
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
      media: 'images.0',
    },
    prepare({ title, number, media }) {
      return {
        title: `${number}. ${title}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Project Number',
      name: 'numberAsc',
      by: [{ field: 'number', direction: 'asc' }],
    },
  ],
});

