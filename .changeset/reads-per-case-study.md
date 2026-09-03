---
'ahincho-portfolio': minor
---

Count how often each case study is read. Every project page now records a read
against its own counter — `spark-match-reads`, `nova-reads`, `assistant-reads` —
so which project people actually open stops being a guess. The Worker already
counts one visit per person per day, so a reload or a second look the same
afternoon does not inflate it, and switching language does not count twice.
Nothing is printed on the page: a case study nobody has opened yet should not
say so.
