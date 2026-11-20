// Builds every format of the founding document into ../formats:
//   formats/web   the website (deployed to GitHub Pages)
//   formats/json  foundation.json, the whole document as data
//   formats/pdf   indagorism.pdf, printed from the full-document page
//
// The Markdown at the repository root is the only input. Run it with
// `npm run formats` from tools/. Continuous integration runs it on every pull
// request and on main, and commits the result, so contributors never need to.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PDFDocument, PDFName } from 'pdf-lib';
import { BASE, SITE } from '../astro.config.mjs';

const tools = fileURLToPath(new URL('..', import.meta.url));
const root = path.resolve(tools, '..');
const dist = path.join(tools, 'dist');
const out = path.join(root, 'formats');
const PDF_NAME = 'indagorism.pdf';
const JSON_NAME = 'foundation.json';

function log(message) {
  console.log(`[formats] ${message}`);
}

// 1. Build the site, which also renders foundation.json.
log('building the site');
execFileSync(path.join(tools, 'node_modules', '.bin', 'astro'), ['build'], {
  cwd: tools,
  stdio: 'inherit',
});
const data = JSON.parse(await fs.readFile(path.join(dist, JSON_NAME), 'utf8'));

// 2. web: the built site, without the files that have their own format folder.
log('writing formats/web');
await fs.rm(path.join(out, 'web'), { recursive: true, force: true });
await fs.cp(dist, path.join(out, 'web'), {
  recursive: true,
  filter: (src) => path.relative(dist, src) !== JSON_NAME,
});

// 3. json
log('writing formats/json');
await fs.mkdir(path.join(out, 'json'), { recursive: true });
await fs.copyFile(path.join(dist, JSON_NAME), path.join(out, 'json', JSON_NAME));

// 4. pdf: serve the built site locally and print the full-document page.
log('writing formats/pdf');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.json': 'application/json',
};
const server = http.createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (!url.startsWith(BASE)) return res.writeHead(404).end();
  let file = path.join(dist, url.slice(BASE.length));
  if (!file.startsWith(dist)) return res.writeHead(403).end();
  try {
    if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const body = await fs.readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
let printed;
try {
  const page = await browser.newPage();
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await page.goto(`${origin}${BASE}/document/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // Links in the PDF point at the published site, not this temporary server.
  await page.evaluate((site) => {
    for (const a of document.querySelectorAll('a[href]')) {
      if (!a.getAttribute('href').startsWith('#')) a.href = new URL(a.pathname + a.hash, site).href;
    }
  }, SITE);
  printed = await page.pdf({
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate:
      '<div style="width:100%;text-align:center;font-family:monospace;font-size:8px;color:#5c574e;">' +
      '<span class="pageNumber"></span></div>',
  });
} finally {
  await browser.close();
  server.close();
}

// Fixed metadata, so the same Markdown always produces the same PDF bytes.
const pdf = await PDFDocument.load(printed, { updateMetadata: false });
const date = new Date(`${data.date}T00:00:00Z`);
pdf.setTitle(`${data.name}: ${data.document}, version ${data.version}`);
pdf.setSubject(data.motto);
pdf.setKeywords([data.name, `version ${data.version}`]);
pdf.setCreator('Indagorism formats');
pdf.setProducer('Indagorism formats');
pdf.setCreationDate(date);
pdf.setModificationDate(date);
pdf.setLanguage('en');
pdf.context.trailerInfo.ID = undefined;
pdf.catalog.delete(PDFName.of('Metadata'));
await fs.mkdir(path.join(out, 'pdf'), { recursive: true });
await fs.writeFile(path.join(out, 'pdf', PDF_NAME), await pdf.save({ useObjectStreams: false }));

log(`done: version ${data.version}, ${data.sections.length} sections`);
