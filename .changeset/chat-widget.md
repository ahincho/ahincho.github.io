---
'ahincho-portfolio': minor
---

Add a floating chat widget that answers questions about the portfolio. Its knowledge is generated at build time from the same dictionaries and data the pages render from, so a deploy is the only step that updates it and it cannot claim something the site no longer says. Like the visit counter, it is opt-in: with no `PUBLIC_CHAT_URL` configured the widget is not rendered and the site builds exactly as before.
