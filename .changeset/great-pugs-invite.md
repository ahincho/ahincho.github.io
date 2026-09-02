---
'ahincho-portfolio': minor
---

Stream the assistant's answer instead of waiting for all of it. The text now
lands in pieces as the model writes, and the output filter keeps its guarantee
while it does: a link is only released once the word after it has begun, so
nothing that would have been removed can reach the page half-drawn.

The endpoint answers in either shape, so a page cached before this change still
works.
