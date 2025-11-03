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
          { title: 'Travel', value: 'travel' },
          { title: 'Commercial', value: 'commercial' },
          { title: 'Editorial', value: 'editorial' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'project',
    }),
    defineField({
      name: 'number',
      title: 'Number (within category)',
      type: 'number',
      description: 'Position within category (1, 2, 3, etc.). Each category has its own numbering.',
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
      title: 'Category & Number',
      name: 'categoryNumberAsc',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'number', direction: 'asc' }
      ],
    },
    {
      title: 'Number Only',
      name: 'numberAsc',
      by: [{ field: 'number', direction: 'asc' }],
    },
  ],
});

