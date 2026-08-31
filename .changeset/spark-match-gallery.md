---
'ahincho-portfolio': minor
---

Add a video demo and a screenshot gallery to the Spark Match case study. The video loads as a static poster and only pulls the YouTube player in on click, against youtube-nocookie.com, so the page makes no third-party request until a visitor asks for one. Screenshots go through `astro:assets`, which cuts them from ~200 kB to ~15 kB and reserves their space to avoid layout shift.
