import { getCollection } from 'astro:content';
import path from 'node:path';

/**
 * Reads the founding document (the Markdown at the repository root) and
 * returns it in one structured shape. Every format (web, json, pdf) is built
 * from this, so no format can drift from the source files.
 *
 * Anything malformed fails the build with a message naming the file, instead
 * of publishing a guess.
 */

export interface Subsection {
  title: string;
  anchor: string;
  markdown: string;
}

export interface Section {
  number: number;
  slug: string;
  file: string;
  title: string;
  /** First paragraph, as HTML. */
  summaryHtml: string;
  /** First paragraph, as plain text. */
  summary: string;
  /** Full source, including the title line. */
  markdown: string;
  /** Rendered body, without the title. */
  html: string;
  subsections: Subsection[];
}

export interface Foundation {
  name: string;
  definitionHtml: string;
  definition: string;
  mottoHtml: string;
  motto: string;
  document: string;
  version: string;
  date: Date;
  dateLabel: string;
  sections: Section[];
}

const FILE_NAME = /^(\d{2})-([a-z0-9-]+)\.md$/;
const TITLE_PAGE = '00-title-page.md';

export function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSubsections(markdown: string, anchors: Map<string, string>): Subsection[] {
  const parts = markdown.split(/^## /m).slice(1);
  return parts.map((part) => {
    const [titleLine, ...rest] = part.split('\n');
    const title = titleLine.trim();
    return {
      title,
      anchor: anchors.get(title) ?? '',
      markdown: rest.join('\n').trim(),
    };
  });
}

let cached: Promise<Foundation> | undefined;

export function getFoundation(): Promise<Foundation> {
  // Cache per build only; in dev each request re-reads so edits show at once.
  if (import.meta.env.DEV) return load();
  return (cached ??= load());
}

/**
 * The title page is plain Markdown: a "# Name" heading, then exactly two
 * paragraphs, the definition and the motto (the motto wholly in italics).
 */
function readTitlePage(entry: { body?: string; rendered?: { html: string } }) {
  const fail = (why: string): never => {
    throw new Error(
      `${TITLE_PAGE}: ${why} It must have a "# Name" heading followed by two paragraphs: ` +
        'the definition, then the motto in *italics*.',
    );
  };
  const markdown = (entry.body ?? '').trim();
  const name = /^# (.+)$/m.exec(markdown)?.[1]?.trim();
  if (!name || !markdown.startsWith('# ')) fail('the first line is not a "# Name" heading.');

  const html = (entry.rendered?.html ?? '').replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/, '').trim();
  const blocks = html.split(/\n+/).filter(Boolean);
  const paragraphs = blocks.map((b) => /^<p>([\s\S]*)<\/p>$/.exec(b)?.[1]);
  if (paragraphs.length !== 2 || paragraphs.some((p) => p === undefined)) {
    fail(`found ${blocks.length} block(s) after the heading instead of two paragraphs.`);
  }
  const [definitionHtml, mottoWrapped] = paragraphs as [string, string];
  const motto = /^<em>([\s\S]*)<\/em>$/.exec(mottoWrapped)?.[1];
  if (motto === undefined) fail('the motto (second paragraph) is not wholly in *italics*.');

  return { name: name as string, definitionHtml, mottoHtml: motto as string };
}

async function load(): Promise<Foundation> {
  const [titleEntries, sectionEntries] = await Promise.all([
    getCollection('titlePage'),
    getCollection('sections'),
  ]);

  if (titleEntries.length !== 1) {
    throw new Error(
      `${TITLE_PAGE} is missing, or its frontmatter (document, version, date) is incomplete. ` +
        'The terminal running the build names the exact field. ' +
        'If it looks right and you are running "npm run dev", restart it.',
    );
  }
  const edition = titleEntries[0].data;
  const title = readTitlePage(titleEntries[0]);

  const sections: Section[] = sectionEntries.map((entry) => {
    const file = path.basename(entry.filePath ?? entry.id);
    const match = FILE_NAME.exec(file);
    if (!match) {
      throw new Error(`${file}: file names must look like "NN-slug.md".`);
    }
    const markdown = (entry.body ?? '').trim();
    const titleMatch = /^# (.+)$/m.exec(markdown);
    if (!titleMatch || !markdown.startsWith('# ')) {
      throw new Error(`${file}: the first line must be a "# Title" heading.`);
    }

    const rendered = entry.rendered?.html ?? '';
    const html = rendered.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/, '');
    const summaryHtml = /<p>([\s\S]*?)<\/p>/.exec(html)?.[1] ?? '';

    const headings = entry.rendered?.metadata?.headings ?? [];
    const anchors = new Map(
      headings.filter((h) => h.depth === 2).map((h) => [h.text, h.slug] as const),
    );

    return {
      number: Number(match[1]),
      slug: match[2],
      file,
      title: titleMatch[1].trim(),
      summaryHtml,
      summary: stripTags(summaryHtml),
      markdown,
      html,
      subsections: splitSubsections(markdown, anchors),
    };
  });

  sections.sort((a, b) => a.number - b.number);

  const seenNumbers = new Set<number>();
  const seenSlugs = new Set<string>();
  for (const s of sections) {
    if (seenNumbers.has(s.number)) throw new Error(`Two sections use the number ${s.number}.`);
    if (seenSlugs.has(s.slug)) throw new Error(`Two sections use the name "${s.slug}".`);
    seenNumbers.add(s.number);
    seenSlugs.add(s.slug);
  }

  return {
    name: title.name,
    definitionHtml: title.definitionHtml,
    definition: stripTags(title.definitionHtml),
    mottoHtml: title.mottoHtml,
    motto: stripTags(title.mottoHtml),
    document: edition.document,
    version: edition.version,
    date: edition.date,
    dateLabel: edition.date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }),
    sections,
  };
}
