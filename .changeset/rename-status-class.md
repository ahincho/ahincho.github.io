---
'ahincho-portfolio': patch
---

The chat widget's connection indicator was called `.status`, which is also what
two project badges call themselves. Astro scopes both, so nothing ever
collided — but a name that means two things is a trap left for later. It is
`.presence` now, which is what it actually shows.
