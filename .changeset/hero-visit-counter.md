---
'ahincho-portfolio': minor
---

Add a public visit counter to the hero terminal, backed by a Cloudflare Worker with a SQLite Durable Object. The counter is opt-in through the `PUBLIC_COUNTER_URL` environment variable: when it is unset the site builds exactly as before.
