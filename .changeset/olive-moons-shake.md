---
'ahincho-portfolio': patch
---

Ask the second model alongside the first when the first is slow, instead of
waiting a whole deadline out before trying it. Both free-tier models stall often
enough that the wait was landing at eleven seconds; measured over eight fresh
questions the mean fell from 8.3s to 3.8s and the worst case from 13.0s to 5.8s.
