import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The founding document is the Markdown at the root of the repository, and it
// is the only source of truth. Nothing here restates its content.
const ROOT = '..';

/** 00-title-page.md: the edition details live in its frontmatter. */
const titlePage = defineCollection({
  loader: glob({ pattern: '00-title-page.md', base: ROOT }),
  schema: z
    .object({
      document: z.string(),
      version: z.coerce
        .string()
        .regex(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/, 'version must be MAJOR.MINOR.PATCH, e.g. "1.0.0"'),
      date: z.coerce.date(),
    })
    .strict(),
});

/** Sections: 01-slug.md to 99-slug.md. Title and order come from the file itself. */
const sections = defineCollection({
  loader: glob({ pattern: ['[0-9][0-9]-*.md', '!00-*.md'], base: ROOT }),
  schema: z.object({}).strict(),
});

export const collections = { titlePage, sections };
