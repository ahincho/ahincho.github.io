# portfolio-counter

Cloudflare Worker backing the public counters shown on the portfolio (visits,
project reactions, CV downloads). State lives in a single SQLite-backed Durable
Object, which gives strongly consistent increments — Workers KV would not, and
its free tier caps at 1,000 writes per day.

## API

| Method | Path                  | Behaviour                                       |
| ------ | --------------------- | ----------------------------------------------- |
| `GET`  | `/v1/counters`        | Every allowed counter and its value              |
| `GET`  | `/v1/counters/:key`   | A single counter, without incrementing           |
| `POST` | `/v1/counters/:key`   | Increments once per visitor per key per 24 hours |

Keys are restricted to the `COUNTER_KEYS` list in `wrangler.jsonc`, so nobody
can create arbitrary counters. Visitors are identified by a salted SHA-256 hash
of IP, user agent and date: the salt makes the hash impossible to reverse or
probe, so no personal data is stored. Common bot user agents are served the
current value without incrementing.

## Local development

```
pnpm install
pnpm dev
```

`wrangler dev` runs the real Workers runtime locally and needs no Cloudflare
account. Local secrets come from `.dev.vars` (git-ignored).

## Deploying

```
pnpm exec wrangler login
pnpm exec wrangler secret put HASH_SALT
pnpm deploy
```

Then point the site at the deployed Worker by setting the `PUBLIC_COUNTER_URL`
repository variable in GitHub to the `*.workers.dev` URL. Leaving it unset
builds the site without any counter.
