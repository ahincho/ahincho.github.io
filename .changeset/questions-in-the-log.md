---
'ahincho-portfolio': patch
---

The hero terminal now prints how many questions the assistant has answered,
under the visits and the CV downloads. The count was already being kept and was
readable only with a token and a `curl`.

`GET /stats` answers the totals to anyone now, cached five minutes at the edge
so the page asking on every visit never reaches the Durable Object. The
day-by-day breakdown still needs the token: it says more about the site than the
total does, and nothing on the page needs it.

Each line still appears only when its number is worth printing, and one endpoint
failing no longer hides the others.
