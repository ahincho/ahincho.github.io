---
'ahincho-portfolio': patch
---

Pin every workflow action to a full commit SHA instead of a moving major tag, so a compromised or repointed tag cannot inject code into the deploy pipeline. Dependabot keeps the pins and their version comments current.
