---
'ahincho-portfolio': patch
---

The footer read "Astro· GitHub· LinkedIn". The separator sat at the start of its
own line, so the compiler stripped the space before it; it now carries its own
spaces and cannot lose them again.

The theme and menu buttons are 38px, which clears what WCAG asks for and not
what a thumb wants. They still look 38px — an invisible box around each one
takes the target to 44, and there are 9px between them so nothing overlaps.
