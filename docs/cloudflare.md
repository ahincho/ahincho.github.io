# What lives in Cloudflare

Two Workers, one Durable Object each, and an AI Gateway. Everything is on free
plans and no card is on file. This is the map: what exists, where each value is
set, and where the code reads it.

## The account

|                   |                                    |
| ----------------- | ---------------------------------- |
| Account ID        | `5d0285adb93b9e9e4d56d0a436ce1c33` |
| Workers subdomain | `ahincho.workers.dev`              |
| Dashboard         | https://dash.cloudflare.com        |

The account ID is not a secret — it appears in every dashboard URL and in
`chat/wrangler.jsonc` — but it is the one value that ties the rest together.

## The two Workers

|        | `portfolio-chat`                             | `portfolio-counter`                             |
| ------ | -------------------------------------------- | ----------------------------------------------- |
| Code   | `chat/`                                      | `worker/`                                       |
| URL    | `https://portfolio-chat.ahincho.workers.dev` | `https://portfolio-counter.ahincho.workers.dev` |
| Does   | answers questions about the portfolio        | keeps visits, likes and CV downloads            |
| Deploy | `pnpm --dir chat deploy`                     | `pnpm --dir worker deploy`                      |

Neither is deployed by CI. They go out by hand, which is why the site tolerates
their absence: with the repository variables unset the site builds without the
chat and without the counters, and without any script for either.

## Configuration, and the line between the two kinds

**Vars** live in `wrangler.jsonc`, are committed, and are public. Anything in
there is readable by anyone who opens the repository.

**Secrets** are set with `wrangler secret put` and never appear in the
repository, in a build log, or in a terminal. `wrangler secret list` shows their
names and never their values.

### `portfolio-chat`

Vars, in `chat/wrangler.jsonc`:

| Var               | Value                                        | Read by                                    |
| ----------------- | -------------------------------------------- | ------------------------------------------ |
| `ALLOWED_ORIGINS` | the site and `localhost:4321`                | `cors()` — anything else gets 403          |
| `CORPUS_URL`      | `https://ahincho.github.io/chat-corpus.json` | `corpus()`, cached ten minutes per isolate |
| `ACCOUNT_ID`      | the account ID above                         | the gateway URL                            |
| `GATEWAY_ID`      | `ahincho-portfolio`                          | the gateway URL                            |
| `MODEL`           | two Flash-Lite models, comma separated       | `hedged()`, tried left to right            |
| `REASONING`       | `low`                                        | `reasoning_effort` on the model call       |

Secrets:

| Secret           | What it is                           | Read by                                      |
| ---------------- | ------------------------------------ | -------------------------------------------- |
| `HASH_SALT`      | makes the visitor token irreversible | `visitorToken()`                             |
| `CF_AIG_TOKEN`   | authenticates to the AI Gateway      | `cf-aig-authorization` header                |
| `GEMINI_API_KEY` | the Google AI Studio key             | `Authorization` header                       |
| `STATS_TOKEN`    | guards `GET /stats`                  | `matches()`; without it there is no endpoint |

### `portfolio-counter`

Vars, in `worker/wrangler.jsonc`:

| Var               | Value                         | Read by                                      |
| ----------------- | ----------------------------- | -------------------------------------------- |
| `ALLOWED_ORIGINS` | the site and `localhost:4321` | `cors()`                                     |
| `COUNTER_KEYS`    | `site-visits,cv-downloads`    | the `counters` family; unlisted keys are 404 |
| `REACTION_KEYS`   | `spark-match,nova,assistant`  | the `reactions` family                       |

Secrets:

| Secret      | What it is                           | Read by         |
| ----------- | ------------------------------------ | --------------- |
| `HASH_SALT` | makes the visitor token irreversible | `fingerprint()` |

The two `HASH_SALT` values are **different secrets in different Workers**. They
have no reason to match, and keeping them apart means a token from one service
cannot be recognised by the other.

## The Durable Objects

Both Workers use a single Durable Object instance, addressed as
`idFromName('global')`. One instance means every count is strongly consistent —
Workers KV would not be, and its free tier caps at 1,000 writes a day. SQLite is
the only Durable Object storage on the free plan.

### `LIMITS` → class `Limits` (`chat/src/index.ts`)

| Table    | Holds                                       | Kept for                       |
| -------- | ------------------------------------------- | ------------------------------ |
| `asks`   | `(token, at)` — one row per question        | one hour, pruned on every call |
| `daily`  | `(day, questions, people)`                  | forever; one row a day         |
| `askers` | `(day, token)` — one row per person per day | sixty days                     |

`asks` is the rate limiter: 12 per visitor and 90 in total, per hour. `daily`
and `askers` are the roll-up behind `GET /stats`.

### `COUNTERS` → class `Counters` (`worker/src/index.ts`)

| Table       | Holds                                                | Kept for         |
| ----------- | ---------------------------------------------------- | ---------------- |
| `counters`  | `(key, value)` — a running total that only goes up   | forever          |
| `visitors`  | `(token, key, expires)` — who has been counted today | 24 hours         |
| `reactions` | `(key, token)` — one row per like                    | until taken back |

A reaction count is a `COUNT(*)` over `reactions` rather than a stored total, so
undoing a like cannot leave the number and the rows disagreeing.

## The AI Gateway

|               |                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------- |
| Gateway ID    | `ahincho-portfolio`                                                                      |
| Endpoint      | `https://gateway.ai.cloudflare.com/v1/{ACCOUNT_ID}/{GATEWAY_ID}/compat/chat/completions` |
| Provider slug | `google-ai-studio/` — **not** `google/`                                                  |

Headers the Worker sets:

| Header                 | Why                                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `cf-aig-authorization` | authenticates the gateway itself, so the URL alone is not enough to spend the quota                                                    |
| `cf-aig-cache-ttl`     | a week; the cache key is a hash of the body, and the body carries the corpus, so publishing the site invalidates every entry by itself |

The response carries `cf-aig-cache-status`, which is how a cache hit is told from
a fresh answer in the logs.

Logs are on, with automatic deletion by age. They hold the prompt and the answer,
which makes them the only place the actual questions can be read. Reading them
needs an API token with `AI Gateway Read`; the token wrangler holds does not
have it, and the one issued for this Worker has `Run` only, on purpose.

## How the site learns the URLs

Nothing about Cloudflare is hardcoded in the site. Two GitHub **repository
variables** carry the URLs into the build:

| Variable             | Value                                           |
| -------------------- | ----------------------------------------------- |
| `PUBLIC_CHAT_URL`    | `https://portfolio-chat.ahincho.workers.dev`    |
| `PUBLIC_COUNTER_URL` | `https://portfolio-counter.ahincho.workers.dev` |

`.github/workflows/deploy.yml` passes them as environment variables, Astro
inlines them as `import.meta.env.PUBLIC_*`, and each component renders nothing
at all when its variable is unset. Locally the same names come from `.env`,
which is git-ignored.

Setting one is `gh variable set NAME --body "..."`, and it only takes effect on
the next build — `gh workflow run deploy.yml` is enough.

## Who sets what

| Value                | Set with                        | Who               |
| -------------------- | ------------------------------- | ----------------- |
| Vars                 | edit `wrangler.jsonc`, redeploy | either            |
| Secrets              | `wrangler secret put NAME`      | the owner, always |
| Repository variables | `gh variable set NAME`          | the owner         |
| `.env` (local)       | edit by hand                    | the owner         |

Secrets are typed into wrangler's own prompt, which hides them. They are never
pasted into a chat, a commit, or a workflow file.

## Reading the numbers

```
curl -s https://portfolio-counter.ahincho.workers.dev/v1/counters
curl -s https://portfolio-counter.ahincho.workers.dev/v1/reactions
curl -s -H "X-Stats-Token: ..." https://portfolio-chat.ahincho.workers.dev/stats
```

The first two are public, because the site shows those numbers anyway. The third
is not: question volume was never meant to be displayed, and a number that
starts at zero is easier to publish later than to withdraw.

Days turn over at **midnight in Arequipa** (`America/Lima`), not in UTC, so an
evening's activity stays in that evening's row. The visitor token derives its day
the same way — the two have to agree, or the same person would count twice.

It is deliberately not the reader's own timezone. The token is derived from the
day, so a reader who got to choose it could mint a fresh identity on every
request and walk straight through the rate limit.
