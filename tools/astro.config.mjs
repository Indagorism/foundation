// @ts-check
import { defineConfig } from 'astro/config';

// Where the web format is published. If the site moves (for example to a
// custom domain), change these two lines; every link follows.
export const SITE = 'https://indagorism.github.io';
export const BASE = '/foundation';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  // Readable HTML, so changes to the web format are easy to review in a diff.
  compressHTML: false,
  vite: {
    server: { watch: { ignored: ['**/formats/**'] } },
  },
});
