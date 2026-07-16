# ASSIGNMENT DETAILS — TechVruk Web Development Intern (Round 1)

## Overview
7-day take-home build. AI-assisted review at first pass, human review for shortlisted submissions.

---

## Hiring Process
1. **Round 1** — 7-day take-home build (this assignment)
2. **Round 2** — Shorter focused build (~2 days), released within 3 working days of Round 1 deadline, only to shortlisted candidates
3. **Interviews** — 1–2 conversations with the team, including a code walkthrough

> Format of deliverable matters as much as the work itself. Submissions that don't follow format are filtered out before any human sees them.

---

## Timeline
- Released: Date on which shared
- Deadline: +7 days
- Late submissions are NOT reviewed. No exceptions.

---

## What They're Evaluating

| What | How They Measure It |
|---|---|
| Discipline | Did you start early? Are commits and devlog entries spread across the week? |
| Hard work | Depth, polish, and how much you actually shipped relative to scope |
| Consistency | Daily progress over multiple distinct calendar days, not weekend cramming |
| Programming skills | Idiomatic, readable, debuggable code |
| Thinking models | Quality of trade-offs, decisions, architecture writeups, and reflection |
| Engineering skills | Git hygiene, tests, CI, docs, accessibility, deployed and working |
| Entrepreneurial thinking | Do you understand the user, the economics, and how to ship something people will actually use? |

---

## The Project — AI Spend Audit Tool

### The Opportunity
Most startups don't know they're overspending on AI tools. They look at their monthly bill, sigh, and pay it. No benchmark, no alternatives surfaced, no second opinion. There's no "Mint for AI tool spend."

**This is not a coding exercise. Treat it as something TechVruk could plausibly launch on Product Hunt next month.**

### What to Build
A free web app (name it yourself — naming is part of the test) that does this end-to-end:
1. Cold visitor lands from a tweet, blog post, or Hacker News
2. They input AI tools they pay for, plan, monthly spend, team size, primary use case
3. They get an instant on-screen audit: where they're overspending, what to switch/downgrade, total potential monthly + annual savings
4. Option to capture the report (email gate) and — for high-savings cases — book a TechVruk expert consultation
5. Result is shareable via a unique public URL with proper Open Graph previews

> No login required. Email captured AFTER value is shown, NEVER before.

---

## MVP Features (All 6 Required)

### Feature 1: Spend Input Form
Support at minimum these tools:
- Cursor (Hobby / Pro / Business / Enterprise)
- GitHub Copilot (Individual / Business / Enterprise)
- Claude (Free / Pro / Max / Team / Enterprise / API direct)
- ChatGPT (Plus / Team / Enterprise / API direct)
- Anthropic API direct
- OpenAI API direct
- Gemini (Pro / Ultra / API)
- Windsurf OR v0 (pick one)

For each tool: plan, current monthly spend, number of seats.
Plus: team size and primary use case (coding / writing / data / research / mixed).

**Form state must persist across page reloads.**

---

### Feature 2: Audit Engine
For each tool, evaluate:
- Are they on the right plan for their usage? (e.g., Team for 2 users is overkill)
- Is there a cheaper plan from the same vendor that fits?
- Is there a substantially cheaper alternative tool with similar capability for their use case?
- Are they paying retail when they could get the same thing through credits?

**Logic must be defensible.** A finance person should read your reasoning and agree. Not "Cursor bad, Claude Code good" — actual usage-fit reasoning with numbers.

**Pricing data must be current as of submission week.** Sources cited in `PRICING_DATA.md` — every number must trace back to an official pricing page URL.

---

### Feature 3: Audit Results Page
- Per-tool breakdown: current spend → recommended action → savings + 1-sentence reason
- Hero: total monthly savings + total annual savings, big and clear
- For audits showing **>$500/mo savings**: surface TechVruk prominently as the way to capture more savings
- For audits showing **<$100/mo or already-optimal**: be honest. "You're spending well." Don't manufacture savings. Still capture the lead with "notify me when new optimizations apply to your stack" signup

**Visual quality matters. This is the page that gets screenshotted and shared.**

---

### Feature 4: AI-Generated Personalized Summary
- Use Anthropic API (preferred) or any LLM
- Generate ~100-word personalized summary paragraph based on the audit
- Must handle API failures gracefully (fallback to a templated summary)
- Full prompt goes in `PROMPTS.md`

> This is the ONE feature where you must use AI. For the audit math itself, hardcoded rules are correct — knowing when NOT to use AI is part of the test.

---

### Feature 5: Lead Capture + Storage
- Email capture with optional fields: company name, role, team size
- Stored in a real backend: Supabase, Firebase, Cloudflare D1, or own Postgres on Render
- Sends a transactional email (Resend / Postmark / SES free tier) confirming the audit and noting TechVruk will reach out for high-savings cases
- Basic abuse protection: rate limit, honeypot, or hCaptcha — document your choice and why

---

### Feature 6: Shareable Result URL
- Each audit gets a unique public URL
- Identifying details (company name, email) stripped from the public version
- Tools and savings numbers shown
- Open Graph tags for clean link previews (Twitter card too)
- **This is the viral loop — design accordingly**

---

## Bonus Features (Only After MVP Works End-to-End)
- PDF export of the full report
- Embeddable widget version (`<script>` tag a blogger could drop in)
- Benchmark mode: "your AI spend per developer is $X — companies your size average $Y"
- Referral codes — share the tool, both parties get a perk
- A short blog post or Twitter thread draft pitching the tool, written as if you were launching it

---

## Constraints
- **Frontend framework**: React, Next.js, Vue, Svelte, SolidJS, or vanilla. Justify in `ARCHITECTURE.md`
- **TypeScript strongly preferred.** If plain JS, justify it.
- **No website builders.** No Wix, Webflow, Framer, Bubble. No admin dashboard templates where UI is pre-built. Tailwind, shadcn/ui, MUI, Mantine, headless primitives are all fine.
- **Lighthouse mobile scores on deployed URL**: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90
- **No secrets in the repo.** Use environment variables.

---

## Deliverables — Submit via Single Google Form Response

### 1. Public GitHub Repo URL
Public. Contains everything in section 3.

### 2. Live Deployed URL
Vercel, Netlify, Cloudflare Pages, Render, Fly.io, or equivalent.
**Localhost screenshots do not count. URL must be reachable when they open it.**

### 3. Required Files at Repo Root

#### Engineering Files

**README.md**
- 2–3 sentence summary of what you built and who it's for
- 3+ screenshots or a 30-second screen recording (YouTube/Loom link)
- Quick start: install, run locally, deploy
- A "Decisions" section listing 5 trade-offs you made and why
- Link to the deployed URL

**ARCHITECTURE.md**
- A system diagram in Mermaid (renders inline on GitHub) or ASCII
- Data flow: how a user's input becomes an audit result
- Why you chose your stack
- What you'd change if this had to handle 10k audits/day

**DEVLOG.md** — THE MOST IMPORTANT FILE THEY READ
One entry per day, for 7 days. Backdating is obvious in git history; they check.

Use this EXACT format:
```
## Day 1 — YYYY-MM-DD
**Hours worked:** X
**What I did:** ...
**What I learned:** ...
**Blockers / what I'm stuck on:** ...
**Plan for tomorrow:** ...
```

If you took a day off, write that entry too — `Hours worked: 0`, with a one-line reason.
**Honesty scores higher than fake entries. They can tell.**

**REFLECTION.md**
Answer all 5 questions, 150–400 words each:
1. The hardest bug you hit this week, and how you debugged it (be specific — what hypotheses did you form, what did you try, what worked?)
2. A decision you reversed mid-week, and what made you reverse it
3. What you would build in week 2 if you had it
4. How you used AI tools (which tool, for what tasks, what you didn't trust them with, and one specific time the AI was wrong and you caught it)
5. Self-rating on a 1–10 scale for each: discipline, code quality, design sense, problem-solving, entrepreneurial thinking — with a one-sentence reason for each

**TESTS.md**
- List every automated test you wrote: filename, what it covers, how to run it
- Minimum: 5 tests covering the audit engine specifically
- They must actually run. **They will run them.**

**.github/workflows/ci.yml**
- A GitHub Actions workflow that runs lint + tests on every push to main
- Must show green checks on your latest commit

**PRICING_DATA.md**
Sources for every tool's pricing. Every number must trace to a URL on the vendor's official pricing page, with the date you pulled it.

Format:
```
## Cursor
- Pro: $20/user/month — https://cursor.sh/pricing — verified YYYY-MM-DD
- Business: $40/user/month — ...
```

**PROMPTS.md**
- The full LLM prompts you used in the tool
- Why you wrote them this way
- What you tried that didn't work

---

#### Entrepreneurial Files
These are evaluated as carefully as the code. Half of strong applicants under-invest here.

**GTM.md** (300–700 words)
- Who is the exact target user — not "startups," but a specific job title at a specific company stage
- What they Google or scroll through right before they'd want this tool
- Where they hang out online (specific subreddits, Slack groups, Discord servers, X lists)
- How you'd get the first 100 users in 30 days with $0 paid budget — be specific, not "post on Twitter"
- The unfair distribution channel — what's the one thing only you could do
- What week-1 traction looks like if this works (specific numbers)

> What scores well: specific, weird, real channels. What scores poorly: "we'll do SEO and content marketing."

**ECONOMICS.md** (300–700 words)
If TechVruk deployed this tool tomorrow, run the unit economics:
- What's a converted lead worth to TechVruk (estimate; show your reasoning)
- What's CAC at each channel from your GTM plan
- What conversion rate from "audit completed" → "TechVruk consultation booked" → "credit purchase" makes this profitable
- What would have to be true for this tool to drive $1M ARR in 18 months
- Show the math even if your inputs are rough estimates. **Approximate numbers > no numbers.**

> What scores well: a realistic spreadsheet-style breakdown. What scores poorly: vague TAM hand-waving.

**USER_INTERVIEWS.md** (3 interviews, ~150–300 words each)
Notes from three real conversations with potential users. 10–15 minutes each.
Cold DM founders on X, ask in indie hacker Slacks, use your college network, talk to friends running side projects.

For each:
- Name (or initials if they preferred anonymity), role, company stage
- 3+ direct quotes
- The most surprising thing they said
- What it changed about your design

> **These conversations must have happened. Fabricated interviews are obvious — they're generic, lack specific contradictions, and have no surprising moments. Faking this is an INSTANT REJECT. Talking to three humans this week is non-negotiable.**

**LANDING_COPY.md**
Treat this as the actual landing page copy a marketer would ship:
- Hero headline (≤10 words)
- Subheadline (≤25 words)
- Primary CTA copy
- Social proof block (mocked is fine, indicate it's mocked)
- FAQ — 5 real Q&As

**METRICS.md** (200–500 words)
- Your single North Star metric — and why
- 3 input metrics that drive the North Star
- What you'd instrument first
- What number triggers a pivot decision

> What scores well: metrics that match a B2B lead-gen tool at this stage. What scores poorly: "DAU" as a metric for a tool people use once a quarter.

---

### 4. Git History Requirements
They read `git log`. These rules are checked programmatically:

- **Commits on at least 5 distinct calendar days** within the 7-day window.
  Verify yourself with:
  ```
  git log --pretty=format:"%ad" --date=short | sort -u | wc -l
  ```
  If fewer than 5, submission is rejected.
- **Conventional Commits format preferred**: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`
- **Meaningful commit messages.** "update", "fix", "wip", "asdf" are red flags.
  "fix: handle 429 from Anthropic API gracefully in summary fallback" is what they want.

---

## Evaluation Rubric (100 Points Total)

| Dimension | Weight | What Scores Well |
|---|---|---|
| Entrepreneurial thinking | 25 | GTM, economics, user interviews, landing copy, metrics — all show real founder mindset, not template-fill |
| Engineering skills | 15 | Git hygiene, CI green, ≥5 working tests, deploy works, accessibility considered |
| Thinking models | 15 | ARCHITECTURE depth, REFLECTION specificity, README "Decisions" section non-trivial |
| Programming skills | 15 | Code is readable, sensible abstractions, types used well, no obvious bugs in happy path |
| Hard work | 10 | All 6 MVP features work, polish in UI, bonus attempted |
| Discipline & consistency | 10 | DEVLOG has 7 dated entries with depth, commits across ≥5 days |
| Polish of the audit logic itself | 10 | A finance-literate person reads your reasoning and agrees with it |

---

## Ground Rules
- **AI tools are allowed and expected.** TechVruk is an AI infrastructure company. Disclose usage in REFLECTION.md honestly. A one-shot generated codebase auto-rejects — not because AI is bad, but because it tells them nothing about you.
- **User interviews are real.** Three actual humans. Quality of these conversations is one of the strongest signals they read.
- **Pricing data accuracy matters.** Every number must cite a vendor URL. They spot-check.
- **No private dependencies, no closed-source libraries, no hardcoded secrets.**
- **No communication during the week** beyond the provided email. Part of what they evaluate is how you handle ambiguity. Make a reasonable assumption, document it in DEVLOG.md, move on.
- By submitting, you grant TechVruk a non-exclusive license to learn from public elements of your submission. You retain full ownership of your code.

---

## What Happens Next
- Within 3 working days of the deadline: shortlisted (Round 2) or not
- Round 2: smaller, focused build (~2 days, more constrained scope), released to shortlisted candidates only
- Interviews: 1–2 conversations with the team, including a walkthrough of Round 1 + Round 2 code, and a discussion of one decision in your ECONOMICS.md or GTM.md

---

## Quick Checklist Before Submitting

### Code
- [ ] All 6 MVP features working on live URL
- [ ] Form state persists on page reload
- [ ] Shareable URL works and strips PII
- [ ] OG tags + Twitter card tags present
- [ ] AI summary works + fallback works
- [ ] Email capture stores to DB + sends confirmation email
- [ ] Abuse protection implemented and documented
- [ ] Lighthouse: Performance ≥85, Accessibility ≥90, Best Practices ≥90
- [ ] No secrets in repo
- [ ] CI workflow green on latest commit

### Files at Repo Root
- [ ] README.md (with screenshots/recording + 5 decisions)
- [ ] ARCHITECTURE.md (with Mermaid diagram)
- [ ] DEVLOG.md (7 entries, one per day)
- [ ] REFLECTION.md (5 questions, 150–400 words each)
- [ ] TESTS.md (≥5 audit engine tests listed)
- [ ] PRICING_DATA.md (every number with source URL + date)
- [ ] PROMPTS.md (full prompts + reasoning)
- [ ] GTM.md (300–700 words)
- [ ] ECONOMICS.md (300–700 words, with math)
- [ ] USER_INTERVIEWS.md (3 real interviews)
- [ ] LANDING_COPY.md (headline, subheadline, CTA, FAQ)
- [ ] METRICS.md (North Star + 3 input metrics)
- [ ] .github/workflows/ci.yml

### Git
- [ ] Commits on ≥5 distinct calendar days
- [ ] Conventional commit messages
- [ ] No "wip", "update", "fix" as full commit messages

### Submission
- [ ] Public GitHub repo URL
- [ ] Live deployed URL (not localhost)
- [ ] Both submitted via Google Form
