# Agent guidelines

Instructions for anyone, human or AI agent, working in this repository.

## Layout

- **The Markdown at the root** (`00-title-page.md`, then `01-*.md` to `NN-*.md`) is the founding document of Indagorism and the only source of its content. The conventions each file follows are in `CONTRIBUTING.md`.
- **`formats/`** holds the document as a website (`web/`), a PDF (`pdf/`), and data (`json/`). It is generated from the Markdown. Never edit it by hand.
- **`tools/`** is the code that builds the formats.

Never copy document text into another file. If something needs the content, read it from the root Markdown or from `formats/json/foundation.json`.

The document belongs to its members collectively (see `09-collective.md`). Do not add any person's name, authorship, or ownership to it.

## Formats

The `Formats` workflow (`.github/workflows/formats.yml`) rebuilds `formats/` on every pull request and push to `main`, and commits the result. On `main` it also deploys the website to https://indagorism.github.io/foundation/ and publishes releases.

Formats are always built in CI so every copy comes from the same environment. You may run `npm run formats` locally to preview them. If you commit the result, CI will replace it with its own build where the bytes differ, notably the PDF.

The build is deterministic: the same Markdown always produces the same files, so a diff in `formats/` only appears when the content or the tools change. Keep it that way. Do not add build timestamps, random IDs, or anything else that changes on every build.

## Commit messages

Write one short line that sums up the change. Nothing else: no body, no bullet list, no trailers.

- Good: `Add the Collective section`
- Good: `Fix table wrapping on narrow screens`
- Bad: a summary line followed by paragraphs explaining each file

## Versions and releases

The version is the `version` field at the top of `00-title-page.md`. It follows semantic versioning, `MAJOR.MINOR.PATCH`, and is written nowhere else.

When a commit on `main` carries a version that has no tag yet, the `Formats` workflow tags it `vMAJOR.MINOR.PATCH` and publishes a GitHub release with the PDF and JSON attached. The workflow refuses a version lower than the latest release.

**People decide the version. Agents only suggest it.** When a change may warrant a release, say which part you would bump and why, then wait. Never change `version` or `date`, create a tag, or publish a release unless a person has decided on that exact version.

Use this as the starting point for a suggestion:

| Bump | When | Examples |
| --- | --- | --- |
| **MAJOR** | A change to what members commit to: the creed, or changing or removing an existing tenet, ethical commitment, right, or rule of governance | Rewording a creed principle so it means something different; changing how decisions are made |
| **MINOR** | Something new that leaves existing commitments as they were | A new section, tenet, observance, or practice; a new format |
| **PATCH** | No change in meaning | Typos, clearer wording, formatting, fixes to the formats or tools |

When a version is decided, update `version` and `date` in `00-title-page.md` in the same change.

Under The Living Canon (`11-living-canon.md`), changes to the document are adopted when members reach common ground. Do not present a proposed change as adopted.

## Working on the tools

```bash
cd tools
npm install
npx playwright install chromium   # once, for the PDF
npm run dev       # website at http://localhost:4321/foundation/, updates as the Markdown changes
npm run formats   # rebuilds formats/; must pass before committing
```

The build stops with a message naming the file if any Markdown breaks the conventions.
