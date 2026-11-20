# Contributing

Indagorism belongs to its members together, and anyone may propose a change to its founding document. You do not need to install anything or know how to code.

## Propose a change on GitHub

1. Open the section you want to change, for example [04-tenets.md](04-tenets.md).
2. Select the pencil icon (**Edit this file**). GitHub makes your own copy if you need one.
3. Make your change. Keep to the conventions below.
4. Select **Commit changes**, describe the change in one short line, and choose **Propose changes**.
5. Open the pull request. Explain your reasoning and the evidence for the change, as The Living Canon asks.

That's all. The website, PDF, and JSON are rebuilt from your change automatically. You never edit anything in `formats/`.

## What happens next

- **The formats are rebuilt.** If your pull request comes from a branch of this repository, the rebuilt formats are added to it, so reviewers can see exactly how your change appears in each one. If it comes from your own copy (a fork), the run summary lists what will change, and the formats are rebuilt when it is merged.
- **Members discuss it.** Under [The Living Canon](11-living-canon.md), a change is adopted when members reach common ground on it. The Council of Review facilitates that discussion and publishes the outcome.
- **A version may be chosen.** People decide whether a change becomes a new version and which part of the number changes. See [Versions](#versions).

## Conventions

The formats are built directly from the Markdown, so each file follows a few rules. If one is broken, the check on your pull request fails with a message saying what to fix.

- **One section per file**, named `NN-name.md`: a two-digit number, then lowercase words joined by hyphens. The number sets the order. The name becomes the page address, so `04-tenets.md` is published at `/tenets/`.
- **The first line** is the section title, written `# Title`.
- **The first paragraph** after the title is used as the section's summary.
- **Subsections** are written `## Subsection`.
- **To add a section**, add a new numbered file. To put it between two others, renumber the files after it.
- **The title page** (`00-title-page.md`) holds the name, the definition, and the motto in *italics*. The lines between the `---` marks at the top hold the document name, version, and date.

## Versions

The version on the title page uses three numbers, `MAJOR.MINOR.PATCH`, for example `1.4.2`:

- **MAJOR** changes when what members commit to changes: the creed, or an existing tenet, ethical commitment, right, or rule of governance.
- **MINOR** changes when something is added and existing commitments stay as they were, such as a new section or observance.
- **PATCH** changes when nothing changes in meaning, such as a typo or clearer wording.

Anyone may suggest a version. People decide it. When a change with a new version reaches `main`, it is tagged and released automatically, with the PDF and JSON attached.
