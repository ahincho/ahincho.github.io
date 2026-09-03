---
'ahincho-portfolio': patch
---

The social sharing card still said "Full Stack & DevSecOps Engineer". The role
was written by hand into the image script, so renaming it everywhere else left
the card behind — the same drift that once stopped the assistant describing
itself.

The script now reads `hero.role` from the dictionary, which makes the
dictionary the only place the role exists, and the card is regenerated.
