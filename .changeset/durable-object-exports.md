---
'ahincho-portfolio': patch
---

Both Workers declare their Durable Object class through `exports` now instead of
the `migrations` array, which Cloudflare has marked as the legacy flow. The
namespaces were provisioned by that array and stay exactly where they were —
only the shape of the declaration changed, and every number survived the deploy.

The cost is worth stating: deploys must keep using `exports` from here, and a
rollback cannot cross the change.
