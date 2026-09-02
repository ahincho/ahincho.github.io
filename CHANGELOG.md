# ahincho-portfolio

## 0.5.1

### Patch Changes

- 6b187d9: Answer a repeated question from cache instead of asking the model again. A
  question that has been asked before now comes back in under a second rather
  than five, it spends none of the provider's free tier, and publishing the site
  invalidates every cached answer by itself.

## 0.5.0

### Minor Changes

- ab5b74b: Stream the assistant's answer instead of waiting for all of it. The text now
  lands in pieces as the model writes, and the output filter keeps its guarantee
  while it does: a link is only released once the word after it has begun, so
  nothing that would have been removed can reach the page half-drawn.
  
  The endpoint answers in either shape, so a page cached before this change still
  works.

## 0.4.0

### Minor Changes

- 573aaed: Connect the assistant to a live model. The chat endpoint runs on Cloudflare
  Workers, reads the corpus the site publishes at build time, and answers in the
  reader's language. It caps what one visitor and what everyone together may ask
  in an hour, keeps its answers inside the portfolio's own content, and strips any
  link or address that is not Angel's before the answer reaches the page.

### Patch Changes

- 5bf04e6: Tell readers what happens to what they type. The chat panel carries a privacy
  note: the conversation is logged and reviewed weekly, the model runs on Google's
  free tier where human reviewers may read it, and nobody should write personal
  data there. The header also shows whether the assistant is actually reachable,
  and says so when a turn fails.

## 0.3.4

### Patch Changes

- 92c6842: Mark the reader's messages with an avatar too, and give the conversation more of the panel. The header and the footnote were taking two fifths of the widget; trimming their copy and raising the panel to 34rem moves the conversation from 60% of the height to 65%, which is a quarter more room for answers.

## 0.3.3

### Patch Changes

- 32db60c: Give the assistant a face. It now carries an avatar in its header and beside every answer, stamps each message with the time it arrived, and the panel is wider — 27rem instead of 23 — so answers of a few sentences no longer read as a narrow column.

## 0.3.2

### Patch Changes

- 1b0acec: Tell the assistant's messages apart from the reader's. Every message after the greeting is created in JavaScript, so it never carried the attribute Astro's scoped styles match on and rendered as bare text: a question and its answer looked identical. Questions now sit right in an accent bubble and answers left in a dark one, each with a flat corner on the speaker's side.

## 0.3.1

### Patch Changes

- 1ed1ec0: Keep the assistant closed until it is opened. Its panel set `display: flex`, which silently overrode the `hidden` attribute, so it covered the hero on every page load and the close button appeared to do nothing. The launcher now pulses quietly until someone opens it for the first time, and remembers that they did.

## 0.3.0

### Minor Changes

- 6d9870c: Add a floating chat widget that answers questions about the portfolio. Its knowledge is generated at build time from the same dictionaries and data the pages render from, so a deploy is the only step that updates it and it cannot claim something the site no longer says. Like the visit counter, it is opt-in: with no `PUBLIC_CHAT_URL` configured the widget is not rendered and the site builds exactly as before.

### Patch Changes

- 576b9be: Record the ByteXByte engagement as freelance. It was inferred as staff when the timeline was modelled — the freelance and internship roles all carried the type in their title and this one did not — but it was a contractor engagement, billed by invoice.

## 0.2.0

### Minor Changes

- f034cf1: Say where each engagement happened, how it was held, and what it reached. The timeline used to compress all of that into one free-text line — `'Ene 2024 — Mar 2026 · Lima'` — which never named a country, gave a modality for only two of six roles, and left the reader to know that Lima is in Peru. Each position now states its country, its modality, whether it was staff, freelance or an internship, and the sector it was in. Claro and Falabella also name the markets they served, which until now were only a count: "4 countries".

## 0.1.1

### Patch Changes

- 9392afc: Start the Spark Match demo at the walkthrough. The recording is a 14:34 course presentation whose first nine minutes are slides, so anyone who pressed play landed on theory and left before the platform ever appeared. It now opens at 9:35, where the walkthrough begins.
- 37d0d19: Show the Java mark for JavaFX in the ByteXByte experience, where the tag was rendering with no icon at all. Neither icon set ships a JavaFX logo, and it is Java's UI toolkit, so it borrows the Java mark the same way Amazon Bedrock borrows the AWS one.
- 18f2ef0: Point the Spark Match demo at the copy on my own channel. The embed pulled from a teammate's account, so the demo could vanish without warning — and since `rel=0` limits suggestions to the video's own channel, the player ended by advertising someone else's videos from inside the portfolio.

## 0.1.0

### Minor Changes

- 779a6cc: Add a public visit counter to the hero terminal, backed by a Cloudflare Worker with a SQLite Durable Object. The counter is opt-in through the `PUBLIC_COUNTER_URL` environment variable: when it is unset the site builds exactly as before.
- 9d96973: Add a 404 page. A wrong address used to land on the GitHub Pages default, in English and with no way back. The new page names the path that was missed, offers the way home in the visitor's language, and is marked noindex with no canonical or alternates to claim.
- 6a44f9a: Add Nova, a meta-framework for enterprise microservices, as a second featured project. It gets its own case study at `/projects/nova/`, a layer diagram standing in for the demo a framework cannot have, and a spot beside Spark Match on the landing. A new index at `/projects/` lists both and has room for the smaller collaborations to come.
- 79203f0: Move the Spark Match case study onto its own page at `/projects/spark-match/`, leaving the landing with a summary, the video and a link through. Screenshots now render at full column width instead of quarter width, where their text was too small to read. Canonical and hreflang tags are derived from the current path, so the new pages point at the right alternates, and the language switcher keeps visitors on the page they were reading.
- 743e09a: Add a social sharing card. Links to the portfolio previewed as a blank box on LinkedIn, WhatsApp and Slack; they now carry an image, the page's own URL and a site name. The card is generated by `pnpm og` and committed, so a deploy never depends on which fonts the runner has installed.
- 4536d8c: Add a video demo and a screenshot gallery to the Spark Match case study. The video loads as a static poster and only pulls the YouTube player in on click, against youtube-nocookie.com, so the page makes no third-party request until a visitor asks for one. Screenshots go through `astro:assets`, which cuts them from ~200 kB to ~15 kB and reserves their space to avoid layout shift.
- 2846e6f: Give each technology a monochrome icon. Marks come from Simple Icons, with Devicon covering Java, AWS and Azure — Simple Icons dropped every Amazon, Microsoft and Oracle logo over trademark requests. They inherit the pill's text colour, so nothing new enters the palette. Practices such as Scrum, DDD and RAG stay text-only, as do the marks both sets only ship as a filled badge.

### Patch Changes

- 2196d37: Say "bachiller" in the hero terminal. It claimed the title of engineer while the About section, correctly, said bachelor's graduate — in Peru those are not the same standing.
- f6f7555: Move the deploy workflow onto current action majors (checkout v7, withastro/action v6, deploy-pages v5) and Node 24, clearing the deprecated Node 20 runtime warning. Dependabot now keeps actions and dependencies up to date weekly.
- 6d5765c: Add the ByteXByte FullStack role to the experience timeline: a retail POS platform migrated from JavaFX to .NET Framework 4.8 and then to a multi-tenant Spring Boot and React web application.
- 4d69da2: Put the Spark Match figures into the case study as text: 550+ degree programmes, 1,000+ institutions and 25 regions of Peru, credited to Ponte en Carrera (MINEDU). They were only legible inside the screenshots before, where neither a search engine nor a reader skimming the page could pick them up.
- 89db7f4: Run the Claro (Central America) engagement through March 2026, ending alongside the UTP one.
- 1e8eaa5: Adopt the Eclipse Public License 2.0 for the code, and replace the Astro starter README — which still described `Welcome.astro` and a folder layout this project does not have — with one describing what is actually here.
- 43164bb: Give the technology marks more weight in the light theme, where they washed out to 3.52:1 against 4.46:1 in the dark one.
- 13db203: Replace the overflowing mobile navigation with a menu button. Below 800px the five section links needed 490px in a 164px strip and the scrollbar was hidden, so Experience, Skills and Contact were unreachable without a swipe nothing hinted at. They now open in a panel that closes on selection or Escape.
- e2fc61f: Show `architecture-rules` in the Nova core layer. The stat band claimed seven framework-free core libraries while the diagram listed six, so anyone who counted the chips found the figure wrong.
- 31eb837: Pin every workflow action to a full commit SHA instead of a moving major tag, so a compromised or repointed tag cannot inject code into the deploy pipeline. Dependabot keeps the pins and their version comments current.
- 6a44f9a: Rename the landing anchor from `#project` to `#projects` and put the navigation label in the plural, now that the section holds more than one. The footer also stays at the bottom of short pages instead of floating mid-screen.
- 217d34d: Stop infinite animations from turning into a strobe under `prefers-reduced-motion`. The reset shortened animation durations to 0.01ms but left the iteration count untouched, so the hero terminal cursor blinked thousands of times per second for visitors who had asked for less motion. Pinning the iteration count to 1 lets those animations settle instead.
- 43164bb: Enrich the Person structured data with the canonical URL, the social card, contact details, languages and the technologies listed in the Skills section, so search engines get the same picture a reader does.
- 43164bb: Add a skip link. Keyboard and screen-reader users had to walk the whole header on every page before reaching the content; the first Tab now offers a jump straight to it.
- d2720dc: Slow down the hero terminal cursor blink (2.4s smooth fade instead of 1.7s hard steps)
- 2f24b63: Tighten the vertical rhythm. Sections kept their desktop padding on phones — the hero halved its own, so every pair of sections was separated by 176px, a fifth of the screen. Section and block spacing now come from two tokens, and the case study's blocks no longer sit at 29, 32 and 35px apart where all three meant the same gap.
- faeb056: Keep the numbers in a stat band on one line when the label under them wraps to two. On a 375px screen the hero's "microservicios serverless" wrapped and pushed its figure 23px above its neighbour.
- f5777f3: Raise the palette to WCAG AA contrast. In the light theme the accent green, the faintest grey and the label on the primary button all sat below the 4.5:1 minimum for body text; the faintest grey in the dark theme did too. The on-accent label is now a token so it can flip to white where the accent is dark.
