/**
 * Sanity CLI configuration
 */

import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'vynr1qpf',
    dataset: 'production',
  },
  
  /**
   * Enable auto-updates for studios
   * https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
});

