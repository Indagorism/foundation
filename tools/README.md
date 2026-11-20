# Tools

The code that builds `../formats` from the Markdown at the repository root. It holds no document text of its own.

```bash
npm install
npx playwright install chromium   # once, for the PDF
npm run dev       # website at http://localhost:4321/foundation/, updates as the Markdown changes
npm run formats   # rebuilds formats/web, formats/json, and formats/pdf
```

- `src/content.config.ts` says where the Markdown is and checks the title page's version and date.
- `src/lib/foundation.ts` turns the Markdown into one structured object and stops the build if a file breaks the conventions in `../CONTRIBUTING.md`.
- `src/pages/` is the website. `src/pages/foundation.json.ts` renders the JSON format.
- `scripts/formats.mjs` builds the site, then splits the output into the three formats and prints the PDF from the full-document page.
- `astro.config.mjs` sets where the website is published. If it moves, change `SITE` and `BASE` there.
