import type { APIRoute } from 'astro';
import { getFoundation } from '../lib/foundation';

/**
 * The whole founding document as JSON, generated from the Markdown at the repository root on every
 * build. Use this for any other tool or site instead of copying the text.
 */
export const GET: APIRoute = async () => {
  const f = await getFoundation();
  const body = {
    name: f.name,
    definition: f.definition,
    document: f.document,
    version: f.version,
    date: f.date.toISOString().slice(0, 10),
    motto: f.motto,
    sections: f.sections.map((s) => ({
      number: s.number,
      slug: s.slug,
      title: s.title,
      summary: s.summary,
      source: s.file,
      markdown: s.markdown,
      html: s.html,
      subsections: s.subsections.map(({ title, anchor, markdown }) => ({ title, anchor, markdown })),
    })),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
