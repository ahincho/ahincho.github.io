# ahincho.github.io

The source of [ahincho.github.io](https://ahincho.github.io) — a portfolio
built with Astro, statically rendered, bilingual, and deployed to GitHub
Pages on every push to `main`.

No client-side framework and no runtime dependencies: the only JavaScript
that ships is a handful of inline handlers for the theme toggle, the
mobile menu and the click-to-load video.

## Stack

| | |
|---|---|
| Framework | Astro 7 (static output) |
| Styling | Plain CSS with custom properties, one stylesheet plus scoped component styles |
| i18n | Astro's native routing — Spanish at `/`, English at `/en/` |
| Images | `astro:assets`, AVIF and WebP at several widths |
| Icons | Simple Icons, with Devicon covering the marks Simple Icons dropped |
| Deploy | GitHub Actions → GitHub Pages |

## Structure

```text
src/
├── components/      one per section, plus the two case studies
├── i18n/            es.ts is the source of truth; en.ts is typed against it
├── layouts/         Layout.astro — head, metadata, hreflang, JSON-LD
├── lib/             tech-icons.ts resolves a technology name to a mark
├── pages/           index, 404, and /projects/ with a page per project
└── styles/          global.css — palette, spacing tokens, base elements
scripts/
└── og-image.mjs     renders the social card; run it, commit the PNG
worker/              Cloudflare Worker for the visit counter (not deployed yet)
```

## Develop

```sh
pnpm install
pnpm dev
```

| Command | Does |
|---|---|
| `pnpm dev` | Dev server on `localhost:4321` |
| `pnpm build` | Static build into `dist/` |
| `pnpm preview` | Serve the build locally |
| `pnpm og` | Regenerate `public/og.png` |
| `pnpm changeset` | Record a user-facing change |
| `pnpm run version` | Apply the pending changesets and write the changelog |

## Conventions

**Content is never hardcoded in a component.** Every visible string lives
in `src/i18n/es.ts`, and `en.ts` is declared as `Translations`, so a
missing key is a type error rather than a blank on the page. Code, routes,
anchors and identifiers are in English regardless of the language shown.

**Commits** follow Conventional Commits, enforced by commitlint through a
husky hook. **Versioning** is semver managed with changesets.

Everything the repository builds is public and reachable by URL, linked
or not — nothing goes in `public/` that should not be.

## License

The code in this repository is under the Eclipse Public License 2.0 — see
[LICENSE](LICENSE).

The written content, the images, and the CV are not: they are personal
material and stay under default copyright.

Copyright © 2026 Angel Hincho.
