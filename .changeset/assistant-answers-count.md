---
'ahincho-portfolio': patch
---

Print how many questions the assistant has answered in its own case study,
beside how fast it is and what it costs. The other three figures are what the
build already knew; this one is whether anyone actually asked, so it stays out
of the stat band until the endpoint answers and disappears if nobody has. The
count-up the terminal uses moved to `src/lib/climb.ts` so both read from one
implementation, with the frame-timing floor that stopped it painting a negative
first frame now covered by tests.
