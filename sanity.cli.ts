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
   * Deployment configuration
   * appId prevents prompting on future deploys
   * autoUpdates keeps the studio up to date automatically
   */
  deployment: {
    appId: 'drgfnj4noy2vn2lvp3sv056f',
    autoUpdates: true,
  },
});

