# DEVLOG.md

## Day 1 — 2025-07-14
**Hours worked:** 4
**What I did:** Set up MERN project structure. Initialized Express server with MongoDB connection, rate limiting, and CORS. Created MongoDB schemas for Audit and Lead models. Started building pricingData.js — researched and verified all 8 tool pricing pages. Spent about 90 minutes just on pricing research — Gemini's pricing is split across Google One and Google Workspace which is confusing.
**What I learned:** MongoDB's flexible schema is genuinely better than Postgres for this use case — the audit result shape varies per tool and would require multiple joins in a relational DB. Also learned that Cursor's enterprise pricing is not publicly listed anywhere.
**Blockers / what I'm stuck on:** Anthropic API free credits application takes 24-48h. Will use a minimal test key for now and switch when credits arrive.
**Plan for tomorrow:** Build the audit engine core logic with all 4 rule types. Write unit tests alongside the code.

---

## Day 2 — 2025-07-15
**Hours worked:** 5
**What I did:** Built the complete audit engine in auditEngine.js — plan fit rules, cheaper plan detection, alternative tool suggestions, credits opportunity checks. Wrote 15 unit tests covering all rule branches. All tests passing. The consolidation rule was the trickiest — it needs to know what OTHER tools the user has, not just the current one.
**What I learned:** Writing pure functions first (no DB, no API calls) made testing trivial. The audit engine is completely isolated — I can run 1000 tests in milliseconds. Also learned that Jest's `toBeNull()` vs `toBeFalsy()` matters — null and undefined behave differently in my rule functions.
**Blockers / what I'm stuck on:** The consolidation recommendation was firing incorrectly for single-tool audits. Cursor was being suggested even when it wasn't in the user's stack. Fixed by filtering incomplete tool entries before passing to the engine.
**Plan for tomorrow:** Build the React frontend — SpendForm with localStorage persistence, all 8 tools and their plans.

---

## Day 3 — 2025-07-16
**Hours worked:** 6
**What I did:** Built SpendForm component with add/remove tool rows, all 8 tools with correct plans, localStorage persistence via custom useLocalStorage hook. Built SavingsHero, AuditResult, and AISummaryCard components. Set up Tailwind with custom brand colors. Spent extra time on accessibility — aria-labels on every interactive element, proper form labeling.
**What I learned:** The `useLocalStorage` hook pattern is cleaner than useEffect + useState for persistence. Also learned that Tailwind's `appearance-none` is needed for custom select styling across browsers — without it, Chrome and Firefox render selects completely differently.
**Blockers / what I'm stuck on:** Form validation UX — showing errors inline vs toast. Decided on toast for simplicity since inline errors would require restructuring the ToolRow component significantly.
**Plan for tomorrow:** Wire up the API routes, connect frontend to backend, test full flow end-to-end.

---

## Day 4 — 2025-07-17
**Hours worked:** 5
**What I did:** Built all three API routes (audit, leads, summary). Integrated Anthropic API with fallback. Built LeadCapture modal with honeypot field. Connected frontend to backend via axios. Tested full flow: form → audit → results → lead capture. Fixed a bug where the audit was saving before the AI summary was generated — moved the save to after both complete.
**What I learned:** Resend's API is genuinely simple — 10 lines to send a transactional email. The honeypot pattern works well; added `tabIndex={-1}` and `aria-hidden` to keep it accessible. Anthropic returns 529 (overloaded) occasionally — added retry logic with exponential backoff.
**Blockers / what I'm stuck on:** Anthropic API returning 529 occasionally. Added retry with 2 attempts before falling back to template. The fallback shows a "Template" badge so users know the difference.
**Plan for tomorrow:** Build the shareable URL page with OG tags, ShareButton component, TechVruk CTA.

---

## Day 5 — 2025-07-18
**Hours worked:** 4
**What I did:** Built AuditPage with dynamic OG meta tag updates. Built ShareButton with clipboard API + native share fallback. Built TechVrukCTA for high-savings audits. Added the 3-second delay before showing lead capture modal. Tested shareable URLs. Added the /api/og/:id route that serves proper OG HTML to crawlers and redirects real users to the SPA.
**What I learned:** Dynamic OG tags via JavaScript don't work for link previews — crawlers don't execute JS. Solved this with a server-side /api/og/:id route that detects bot user agents and serves static HTML with correct meta tags. Real users get a 302 redirect to the React app.
**Blockers / what I'm stuck on:** OG image generation for per-audit previews would require a separate image generation service (like Satori or a headless browser). Skipping for MVP, using static OG image. Documented as known limitation.
**Plan for tomorrow:** Deploy to Render + Netlify. Run Lighthouse audit. Fix any accessibility issues.

---

## Day 6 — 2025-07-19
**Hours worked:** 5
**What I did:** Deployed backend to Render, frontend to Netlify. Set all environment variables. Fixed CORS for production URL. Ran Lighthouse — Performance 91, Accessibility 94, Best Practices 92. Fixed two accessibility issues: missing aria-labels on icon buttons, insufficient color contrast on one savings badge. Conducted 2 user interviews (R.K. and Priya M.) — notes in USER_INTERVIEWS.md. Their feedback changed the results page layout significantly.
**What I learned:** Render's free tier has cold starts (~30s on first request after inactivity). Added a health check endpoint. For production, the $7/mo paid tier eliminates cold starts. MongoDB Atlas free tier has 500 connection limit — added mongoose connection pooling config.
**Blockers / what I'm stuck on:** Cold start on Render free tier is noticeable. Documented this. Not blocking for MVP but would need paid tier for production.
**Plan for tomorrow:** Third user interview, write all required markdown files, final review of all 6 MVP features, verify pricing data is current.

---

## Day 7 — 2025-07-20
**Hours worked:** 4
**What I did:** Conducted third user interview (Arjun S., VP Engineering) — his benchmark request led me to add the spendPerDev comparison feature. Wrote/finalized all required markdown files: ARCHITECTURE, REFLECTION, TESTS, PRICING_DATA, PROMPTS, GTM, ECONOMICS, USER_INTERVIEWS, LANDING_COPY, METRICS. Verified all pricing data against official pages. Final end-to-end test of all 6 MVP features on live URL. CI workflow showing green on latest commit.
**What I learned:** Writing the GTM and ECONOMICS docs forced me to think about the product more seriously than the code did. The user interview insights changed how I framed the results page copy — specifically the benchmark comparison and the honest "you're spending well" state.
**Blockers / what I'm stuck on:** Nothing blocking. Submission ready.
**Plan for tomorrow:** Submit via Google Form before deadline.
