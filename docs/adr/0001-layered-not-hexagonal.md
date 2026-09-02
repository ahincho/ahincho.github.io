# 1. Layered structure, not hexagonal or DDD

Status: accepted — 2026-09-01

## Context

This repository is public and doubles as a work sample, so the way it is
organised is part of what it shows. The obvious temptation is to apply the same
styles the Nova platform enforces — Layered, Clean and Hexagonal, checked with
ArchUnit in [nova-java-architecture-rules][rules] — on the grounds that the
portfolio should practise what it preaches.

What the site actually is, measured:

|                               | lines | share |
| ----------------------------- | ----: | ----: |
| CSS (scoped component styles) | 1,676 |   63% |
| Markup                        |   660 |   25% |
| Component frontmatter         |   253 |    9% |
| Client-side script            |    92 |    3% |

Most of that frontmatter is one statement pulling a dictionary into scope. The
only modules holding real logic are `src/lib/tech-icons.ts` and the hreflang and
JSON-LD derivation in `src/layouts/Layout.astro`.

The site is statically rendered. It reads files this repository owns and writes
HTML. It has no database, no queue, no third-party call at build time, and no
runtime of its own.

## Decision

Organise the site in layers, with dependencies pointing inwards:

```
domain/      contracts — types, no logic
data/        the facts, language-neutral, stated once
i18n/        only what is translated, keyed by id
lib/         pure functions
components/  presentation
pages/       routing
```

Do not introduce ports, adapters, repositories, aggregates, domain events or an
application service layer.

## Why not hexagonal

Hexagonal earns its keep when a domain core must stay independent of several
I/O adapters — the same logic backed by different storage, reachable through
different transports, replaceable by a double in tests. Its benefit scales with
the number of external boundaries.

This project has one input and one output. Every port would have exactly one
implementation, forever, and the indirection would buy nothing. More content
does not change that: ten times the pages is still one boundary.

## Why not DDD's tactical patterns

The test applied was to count the invariants worth protecting. The most
stateful feature contemplated — a per-project like, served by the counter Worker
in `worker/` — has exactly one: a visitor may count once per key per day. It is
already enforced, correctly, by a primary key on `(token, key)` in the Durable
Object's schema. An aggregate and a repository would be more code guarding the
same rule, in a place the storage engine already guarantees it.

Event-driven behaviour in the browser — a click updating a count optimistically,
posting, and reconciling on failure — is a presentation concern. It gets a small
emitter if it needs one, not a domain event.

## Consequences

Adding an experience or a project means filling in a type rather than editing
two dictionaries in step. Facts stop being duplicated across `es.ts` and `en.ts`,
which is what let the Claro end date drift between them. Dates and country names
are formatted with `Intl` rather than translated by hand.

If this ever reads content from a CMS or an API at build time, or if the Worker
grows rules of its own beyond counting, that boundary is where hexagonal would
be reconsidered — for that component, not for the site. The layered structure is
the substrate for it, so nothing here would be thrown away.

[rules]: https://github.com/ahincho/nova-java-architecture-rules
