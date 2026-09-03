---
'ahincho-portfolio': patch
---

The chat Worker now keeps a daily roll-up of how many questions it was asked and
how many people asked them, read back through a token-guarded `GET /stats`. The
rate limiter already held exactly this data and threw it away every hour, which
is right for a limit and useless for anyone asking later whether the assistant
was used at all.

Nothing about the site changes. The count is no more identifying than the
visitor token it counts, per-person rows are dropped after sixty days, and the
endpoint answers 404 without its token — including when no token is configured.
