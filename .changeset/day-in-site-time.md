---
'ahincho-portfolio': patch
---

Days now turn over at midnight in Arequipa rather than in UTC. A UTC day starts
at seven in the evening local time, which split an evening's visits and
questions across two rows and made the numbers awkward to read from the place
they are read.

Not the reader's own timezone, which would be the obvious next step and is the
one thing that must not happen: the visitor token is derived from the day, so a
reader who chose it could mint a fresh identity on every request and walk
straight through the rate limit. The day is the server's to decide.
