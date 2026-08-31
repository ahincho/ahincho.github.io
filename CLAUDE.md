## Conventions

- **Commits**: Conventional Commits, enforced by commitlint (husky `commit-msg` hook). Never add AI co-author trailers (`Co-Authored-By: Claude ...`) — commits are authored solely by the repo owner.
- **Versioning**: semver managed with changesets. Run `pnpm changeset` to record user-facing changes; `pnpm version` applies bumps and updates the changelog. Default to `patch` — fixes, copy tweaks, styling. Use `minor` only for a new feature or a genuinely notable addition. Do not release a `major`: it is reserved for when the owner considers the portfolio actually useful and to his liking.
- **Branching**: trunk-based development — commit to `main`; no long-lived branches.
- **Dependencies**: always target the latest stable version — GitHub Actions included; never leave an action on a deprecated major. Dependabot (`.github/dependabot.yml`) opens weekly PRs for actions, the site and `worker/`. Workflow actions are pinned to a full commit SHA with the version in a trailing comment — a moving tag like `@v7` can be repointed at other code by whoever controls the action; Dependabot keeps both the SHA and the comment current.
- **Language**: all code, routes, anchors/IDs, file names and identifiers in English. Visible content is bilingual via `src/i18n/` dictionaries (`es.ts` is the source of truth, `en.ts` is type-checked against it) — never hardcode visible strings in components.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
