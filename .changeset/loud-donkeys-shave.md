---
'ahincho-portfolio': minor
---

Connect the assistant to a live model. The chat endpoint runs on Cloudflare
Workers, reads the corpus the site publishes at build time, and answers in the
reader's language. It caps what one visitor and what everyone together may ask
in an hour, keeps its answers inside the portfolio's own content, and strips any
link or address that is not Angel's before the answer reaches the page.
