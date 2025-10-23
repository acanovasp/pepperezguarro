/**
 * Sanity Studio configuration
 * This file configures the Sanity Studio interface
 */

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  name: 'default',
  title: 'PepPerez Portfolio',

  projectId: 'vynr1qpf',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Projects')
              .child(
                S.documentTypeList('project')
                  .title('Projects')
                  .defaultOrdering([{ field: 'number', direction: 'asc' }])
              ),
            S.listItem()
              .title('About')
              .child(
                S.document()
                  .schemaType('about')
                  .documentId('about')
              ),
          ]),
    }),
    visionTool(), // Query tool for testing GROQ queries
  ],

  schema: {
    types: schemaTypes,
  },
});

