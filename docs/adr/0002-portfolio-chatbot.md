# 2. A grounded chatbot over the portfolio's own content

Status: accepted — 2026-09-02

## Context

The portfolio should answer questions about its own content — experience,
projects, stack — in either language, without a recruiter having to read every
section to find one fact.

Three constraints shape every choice below: the site is statically hosted on
GitHub Pages and has no backend, the budget is zero and no credit card is to be
handed over, and anything the bot says about a career is a claim a reader may
act on.

### The corpus is small

Measured, not estimated:

|                                          | characters |   ≈ tokens |
| ---------------------------------------- | ---------: | ---------: |
| Every visible string in `src/i18n/es.ts` |      9,066 |      2,590 |
| `src/data/experience.ts`                 |      2,718 |        776 |
| The CV, ~3 pages                         |     ~9,000 |     ~2,570 |
| **Total**                                |            | **~5,900** |

That is 4.6% of a 128k context window. Retrieval exists to choose what to send
when the corpus does not fit; here it always fits. There is no chunking, no
embedding model and no vector store in this design, and Spark Match remains the
place where retrieval is demonstrated over a corpus that actually needs it.

### What the free tiers really allow

Verified 2 September 2026. A turn is the whole corpus plus a question in, and an
answer out — roughly 6,600 tokens in, 300 out.

| Provider · model                  | Turns/day | Per-minute ceiling |
| --------------------------------- | --------: | ------------------ |
| Google AI Studio · Gemini 3 Flash |    ~1,500 | ~37/min            |
| Workers AI · granite-4.0-h-micro  |      ~757 | none               |
| Workers AI · qwen3-30b-a3b-fp8    |      ~252 | none               |
| Groq · gpt-oss-20b                |       ~29 | 1.2/min            |

Groq is out on its 8,000 tokens-per-minute ceiling: one turn nearly fills a
minute, so two simultaneous readers already queue. Its own table once showed
14,400 requests/day, which was real for `llama-3.1-8b-instant` until that model
left the free tier on 26 August 2026.

Also rejected: Mistral requires opting in to training on submitted data,
GitHub Models allows 50 requests/day on the larger models, OpenRouter rotates
which models are free without notice, and Railway has no free tier — $1/month
of credit, or $5 of trial that expires.

Hosting does not decide anything. Deno Deploy gives 1M requests/month, Workers
gives 100k/day, and Vercel's fair-use guidelines name a portfolio as permitted
on Hobby. All are an order of magnitude past what the model quota allows.

## Decision

**Gemini 3 Flash behind a small endpoint, with the whole corpus in the prompt.**

```
browser                     endpoint                    provider
  chat widget  ──POST──▶  rate-limit the visitor
                          assemble the prompt
                          call the model      ─────────▶  Gemini 3 Flash
               ◀──stream──                    ◀─────────
```

The corpus is generated during the Astro build from `src/i18n/` and
`src/data/`, published as a static JSON file, and fetched and cached by the
endpoint. Deploying the site is therefore the only step needed to update what
the bot knows, and it can never assert something the site no longer says.

The API key lives as an environment variable on the endpoint. It never reaches
the browser, which is the only reason an endpoint exists at all.

### Guardrails

The off-the-shelf options solve a different problem. Llama Guard and AI Gateway
Guardrails classify violence, hate and sexual content; the risk here is that the
model invents a job, a date or a technology, on the author's own site, where a
reader will believe it.

On the way in: a cap on message length, and a per-visitor rate limit reusing the
salted-hash visitor token already written for the visit counter.

On the way out: low temperature, an instruction to answer only from the corpus
and to say so plainly when a question falls outside it, and a deterministic
filter — an allowlist of URLs, no email address other than the author's, and a
length cap. That last filter is not a model, and it is what stops a successful
injection from publishing someone else's link on this site.

### Observability

**Cloudflare AI Gateway**, as a proxy in front of Gemini. Its free plan stores
100,000 logs per account and reports requests, tokens and cost, and it also
supplies caching, rate limiting and provider fallback as configuration.

LangSmith was considered and rejected _for this_. Its free tier is 5,000 traces
a month — about 167 a day, 11% of this design's capacity — after which it bills
pay-as-you-go with no ceiling, which is the wrong failure mode for a project
whose premise is zero cost. It stays the right tool for Spark Match, where there
are chains, evaluations and datasets to inspect. Here there is one call.

## Consequences

At three turns per conversation and one visitor in ten opening the chat, 1,500
turns a day covers roughly **5,000 visitors a day** — around twenty-five times
what an active job search generates. When the quota is spent the widget says so
and points at the contact section; it does not fail silently.

There is no traffic data yet: the visit counter in `worker/` is written and not
deployed. Deploying it alongside this gives a real number to design against,
rather than the estimate above.

The design is deliberately one moving part. If measured traffic ever justifies
it, the second path is additive and nothing here is discarded: AI Gateway's
cache absorbs repeated questions, and Workers AI is configured as a fallback
provider, taking the ceiling to roughly 2,900 turns a day. That is a change of
configuration, not of architecture.

Billing must not be enabled on the Google AI Studio project — doing so moves it
off the free tier. And reader questions do reach Google, though the material the
bot works from is a public CV.
