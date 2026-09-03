# portfolio-counter

Cloudflare Worker backing the public numbers on the portfolio: visits, the likes
on each project, and how often the CV is taken. State lives in a single
SQLite-backed Durable Object, which gives strongly consistent increments —
Workers KV would not, and its free tier caps at 1,000 writes per day.

## API

Two families, because the two kinds of number behave differently.

| Method | Path                 | Behaviour                                         |
| ------ | -------------------- | ------------------------------------------------- |
| `GET`  | `/v1/counters`       | Every counter and its value                       |
| `GET`  | `/v1/counters/:key`  | A single counter, without incrementing            |
| `POST` | `/v1/counters/:key`  | Counts once per visitor per key per 24 hours      |
| `GET`  | `/v1/reactions`      | Every reaction count, plus the ones _you_ gave    |
| `GET`  | `/v1/reactions/:key` | A single reaction count                           |
| `POST` | `/v1/reactions/:key` | Gives your reaction, or takes it back if you gave |

A counter only ever goes up. A reaction is one row per person, so it can be
taken back, and the count is a `COUNT(*)` over those rows rather than a running
total — undoing a like cannot leave the number and the rows disagreeing.

`GET /v1/reactions` answers with `mine` as well as `values`. The page needs
both: a button that does not know it is already pressed would take the like back
on the next click, which is the opposite of what the visitor asked for.

Keys are restricted to the `COUNTER_KEYS` and `REACTION_KEYS` lists in
`wrangler.jsonc`, so nobody can create arbitrary counters, and a key from one
family is not accepted by the other.

## Who a visitor is

A salted SHA-256 of the address and the user agent, truncated. The salt is what
makes it safe: without it anyone could hash an address and ask whether that
person had been here. Each part carries its own length before hashing, so an
IPv6 address — which is full of colons — cannot be split differently to land on
someone else's identity. Nothing personal is stored.

The two families hash different things on purpose:

- a **visit** carries the date, so the identity expires at midnight on its own
  and the number means _unique visitors that day_;
- a **reaction** does not, because its identity has to outlive the night —
  otherwise every visitor would like the same project again tomorrow.

That identity is as stable as an address and a browser are, which is to say
approximately. These are numbers on a portfolio, not an election.

Common bot user agents are served the current value without changing it.

## Local development

```
pnpm install
pnpm dev
```

`wrangler dev` runs the real Workers runtime locally and needs no Cloudflare
account. Local secrets come from `.dev.vars` (git-ignored). On Windows it binds
to IPv6 only unless told otherwise, so `--ip 127.0.0.1` is worth passing if the
site cannot reach it.

The decisions the endpoint makes before it touches storage live in
`src/counters.ts`, which imports nothing from the Workers runtime and is covered
by the site's own `pnpm test`.

## Deploying

```
pnpm exec wrangler login
pnpm exec wrangler secret put HASH_SALT
pnpm deploy
```

Then point the site at the deployed Worker by setting the `PUBLIC_COUNTER_URL`
repository variable in GitHub to the `*.workers.dev` URL. Leaving it unset
builds the site with no counters and no scripts for them at all.

## Which day a day is

Days turn over at midnight in Arequipa (`America/Lima`), not in UTC, so an
evening's visits stay in that evening. Never the visitor's own timezone: the
token is derived from the day, so a visitor who chose it could mint a fresh
identity on every request and be counted as many times as they liked.
