---
'ahincho-portfolio': patch
---

Stop infinite animations from turning into a strobe under `prefers-reduced-motion`. The reset shortened animation durations to 0.01ms but left the iteration count untouched, so the hero terminal cursor blinked thousands of times per second for visitors who had asked for less motion. Pinning the iteration count to 1 lets those animations settle instead.
