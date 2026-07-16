# REFLECTION.md

## 1. The Hardest Bug

The hardest bug was the audit engine's "consolidate" recommendation firing incorrectly for single-tool audits. When a user entered only GitHub Copilot Individual, the engine was suggesting they consolidate with Cursor — even though Cursor wasn't in their stack at all.

My first hypothesis was that the `suggestAlternative` function was checking the wrong condition. I added `console.log` statements to trace the input at each rule check. The logs showed the function was receiving the correct `toolId` and `planId`, but the consolidation rule for `github_copilot individual` was hardcoded to always fire when `seats === 1`, regardless of whether Cursor was also in the user's tool list.

I tried passing the full `tools` array into `suggestAlternative` so it could check for overlapping tools. This fixed the false positive but introduced a new bug: the function was now checking `tools.some(t => t.toolId === 'cursor')` but the array contained the raw form data, not the processed tool objects. The `toolId` field was sometimes `undefined` because the form allowed empty rows.

The fix was two-part: (1) filter out incomplete tool entries before passing to the engine, and (2) change the consolidation rule to only fire when the user has both tools in their stack. Added a regression test for the single-tool case. The lesson was that pure functions need clean, validated inputs — garbage in, garbage out, and the bug manifests far from the source.

---

## 2. A Decision I Reversed

I initially built the audit results as a modal overlay on the homepage — the form and results on the same page, with results appearing below the form after submission. This felt clean and fast. Single page, no navigation, instant feedback.

I reversed this on Day 4 after realizing it broke the shareable URL requirement. If results are on the homepage, there's no unique URL to share. The shareable URL is the viral loop — it's one of the 6 required features and arguably the most important for distribution. A CTO who finds $800/month in savings wants to share that with their CFO. That share only works if there's a URL.

Switching to a separate `/audit/:id` route required refactoring the form submission handler to navigate instead of setState, and building a full AuditPage component. It added about 3 hours of work. But it was the right call — the shareable URL is now a first-class feature, not an afterthought. The server-side `/api/og/:id` route that serves proper OG meta tags to crawlers also only became possible because of this architecture decision.

---

## 3. What I'd Build in Week 2

If I had a second week, I'd build three things in priority order:

**1. Dynamic OG image generation** — The biggest gap in the current MVP. When someone shares `/audit/:id` on Twitter or Slack, the preview shows a generic image. A Cloudflare Worker that generates a per-audit OG image (showing the savings number in big text against a clean background) would dramatically increase click-through rates on shared links. This is the difference between a link that gets ignored and one that gets clicked. Satori (Vercel's OG image library) makes this straightforward.

**2. PDF export** — Several user interview subjects mentioned they need to share the audit with their CFO or board. A PDF with the full breakdown, sourced pricing data, and TechVruk branding would make SpendLens a tool that gets forwarded internally, not just used once. This is the difference between a one-time visit and a tool that creates internal champions.

**3. Benchmark mode with real data** — Right now the benchmark comparison uses hardcoded averages. With 100+ audits in the DB, I could calculate real percentiles from actual user data. "Your team spends $45/dev/mo — top 25% of teams your size spend less than $38" is far more compelling than a made-up average. This also gives TechVruk a proprietary data asset that gets more valuable over time.

---

## 4. How I Used AI Tools

I used Claude (via claude.ai) and GitHub Copilot throughout the week.

**What I used Claude for:**
- Drafting the initial audit engine rule structure — I described the 4 rule types in plain English and asked Claude to suggest a function signature. The structure it suggested (pure function, returns first matching rule) was good and I kept it.
- Writing the Resend email HTML — I dislike writing HTML emails. Claude generated a clean template that I then customized with the correct savings logic and TechVruk branding.
- Drafting the GTM.md and ECONOMICS.md sections — I gave Claude my rough notes and asked it to structure them. I rewrote most of it but the structure was useful as a starting point.

**What I used Copilot for:**
- Autocompleting repetitive code (mongoose schema fields, Tailwind class strings)
- Suggesting test case names and Jest assertion patterns

**What I didn't trust AI with:**
- The audit engine logic itself — the rules need to be defensible to a finance person. I wrote every rule by hand, verified the math manually, and wrote tests before trusting any of it. An LLM-generated savings number would be unpredictable and unverifiable.
- Pricing data — AI confidently hallucinates prices. Every number was verified on the official vendor page.
- The DEVLOG — this needs to reflect what I actually did each day, not what an AI thinks sounds plausible.

**One time the AI was wrong:**
Claude suggested that GitHub Copilot Business costs $21/seat/month. The actual price is $19/seat/month. I caught this when cross-referencing with the official GitHub pricing page. This is exactly why pricing data must be verified from official sources, not AI-generated. A $2/seat difference sounds small but across 10 seats over a year is $240 — and it would make the audit engine's savings calculations wrong.

---

## 5. Self-Rating

| Dimension | Rating | Reason |
|---|---|---|
| Discipline | 7/10 | Started Day 1, committed every day, but Day 3 was shorter than planned due to a personal commitment. Consistent across the week but not perfect. |
| Code quality | 8/10 | Audit engine is clean, pure, and well-tested. Frontend components are readable with good accessibility. Could improve error handling in edge cases and add TypeScript. |
| Design sense | 7/10 | The results page looks good and is screenshot-worthy. The form is functional but not beautiful. Would invest more in micro-interactions and loading states with more time. |
| Problem-solving | 8/10 | Debugged the consolidation bug systematically with hypothesis-driven logging. Made the right call reversing the modal-vs-page decision quickly when I saw the shareable URL requirement. |
| Entrepreneurial thinking | 7/10 | GTM and ECONOMICS docs are specific and grounded in real numbers. User interviews were real and changed the product. Could have gone deeper on the viral loop mechanics and referral system. |
