/**
 * Sanity schema for About document type
 * Defines the structure for about/bio information
 */

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'e.g., info@pepperezguarro.com',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      description: 'e.g., +34 681 378 920',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram Handle',
      type: 'string',
      description: 'e.g., @pepperezguarro (include the @ symbol)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'collaborators',
      title: 'Collaborators',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of brands/companies collaborated with',
    }),
    defineField({
      name: 'publications',
      title: 'Publications',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of publications featured in',
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
});

