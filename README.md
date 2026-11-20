# Indagorism

This repository is the founding document of Indagorism. It is written in plain Markdown, and anyone can propose a change to it.

## Read it

- **Website:** https://indagorism.github.io/foundation/
- **PDF:** [formats/pdf/indagorism.pdf](formats/pdf/indagorism.pdf)
- **Data (JSON):** [formats/json/foundation.json](formats/json/foundation.json)
- **Markdown:** start with [00-title-page.md](00-title-page.md) and read the numbered files in order.

Each release is also listed under [Releases](https://github.com/Indagorism/foundation/releases), with its PDF and JSON attached.

## How this repository is organized

| Where | What it is | Who edits it |
| --- | --- | --- |
| `00-title-page.md` to `NN-*.md` | The founding document, one section per file. This is the only source of truth. | Anyone, through a pull request |
| `formats/` | The document as a website, a PDF, and JSON, generated from the Markdown | No one. It is rebuilt automatically. |
| `tools/` | The code that builds the formats | Maintainers |

When the Markdown changes, every format is rebuilt to match, like a new printing of a book. A pull request shows the change to the Markdown and the matching change to each format, so reviewers can confirm they agree.

## Contribute

You only need a GitHub account. See [CONTRIBUTING.md](CONTRIBUTING.md). How changes are adopted is set out in [The Living Canon](11-living-canon.md).
