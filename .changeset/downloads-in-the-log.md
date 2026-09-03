---
'ahincho-portfolio': patch
---

The hero terminal now reads `metrics.log` rather than `visits.log`, and prints
the CV downloads under the unique visits. The download count was already being
kept and had nowhere to be seen.

Each line appears only when its number is worth printing, and the whole block
disappears when neither is — the newline belongs to the line rather than sitting
between the two, so a metric with nothing to say leaves no blank row behind it.

Both numbers are also finally counted in the right grammar: the label was fixed,
so a single visit read "1 visitas únicas".
