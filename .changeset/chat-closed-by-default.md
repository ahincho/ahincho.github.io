---
'ahincho-portfolio': patch
---

Keep the assistant closed until it is opened. Its panel set `display: flex`, which silently overrode the `hidden` attribute, so it covered the hero on every page load and the close button appeared to do nothing. The launcher now pulses quietly until someone opens it for the first time, and remembers that they did.
