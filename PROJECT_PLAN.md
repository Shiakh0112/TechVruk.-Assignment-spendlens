# PROJECT PLAN — AI Spend Audit Tool (TechVruk Round 1)

## Project Name Ideas
- **SpendLens** — "See where your AI budget is going"
- **AuditAI** — simple, direct
- **ClearStack** — clarity on your AI stack
> Recommended: **SpendLens** (memorable, shareable, product-hunt-ready)

---

## What We're Building
A free web app where a startup/team inputs their AI tool subscriptions and instantly gets:
- An audit showing overspending
- Cheaper alternatives or plan downgrades
- Total monthly + annual savings
- A shareable public URL of their audit
- Email capture (after showing value, never before)
- AI-generated personalized summary via Anthropic API

---

## Tech Stack Decision

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR for OG tags, file-based routing, API routes built-in, TypeScript native |
| Styling | Tailwind CSS + shadcn/ui | Fast, accessible, no pre-built admin templates |
| Backend/DB | Supabase | Free tier, Postgres, real-time, easy setup |
| Email | Resend | Free tier 3k emails/mo, simple API |
| AI Summary | Anthropic Claude API | As required by assignment |
| Deployment | Vercel | Zero-config Next.js deploy |
| Language | TypeScript | Strongly preferred per assignment |

---

## Folder Structure

```
spendlens/
├── app/
│   ├── page.tsx                  # Landing + input form
│   ├── audit/[id]/page.tsx       # Shareable audit result page
│   ├── api/
│   │   ├── audit/route.ts        # Create audit, run engine, store in DB
│   │   ├── summary/route.ts      # Anthropic API call for AI summary
│   │   └── leads/route.ts        # Email capture + Resend transactional email
├── components/
│   ├── SpendForm.tsx             # Multi-tool input form
│   ├── AuditResult.tsx           # Results display
│   ├── LeadCapture.tsx           # Email gate modal
│   ├── ShareButton.tsx           # Copy shareable URL
│   └── SavingsHero.tsx           # Big savings number display
├── lib/
│   ├── auditEngine.ts            # Core audit logic (hardcoded rules)
│   ├── pricingData.ts            # All tool pricing constants
│   ├── anthropic.ts              # AI summary + fallback
│   └── supabase.ts               # DB client
├── __tests__/
│   └── auditEngine.test.ts       # ≥5 tests for audit logic
├── .github/workflows/ci.yml      # Lint + test on push
├── PRICING_DATA.md
├── PROMPTS.md
├── ARCHITECTURE.md
├── DEVLOG.md
├── REFLECTION.md
├── TESTS.md
├── GTM.md
├── ECONOMICS.md
├── USER_INTERVIEWS.md
├── LANDING_COPY.md
├── METRICS.md
└── README.md
```

---

## MVP Features — Build Order

### Day 1–2: Foundation
- [ ] Init Next.js + TypeScript + Tailwind + shadcn/ui
- [ ] Set up Supabase project, create `audits` and `leads` tables
- [ ] Build `pricingData.ts` with all 8+ tools, all plans, current pricing
- [ ] Write `PRICING_DATA.md` with sources

### Day 2–3: Core Form (Feature 1)
- [ ] `SpendForm.tsx` — add/remove tools, select plan, enter seats + spend
- [ ] Form state persisted via `localStorage` (survives page reload)
- [ ] Fields: tool name, plan, monthly spend, seats, team size, use case

### Day 3–4: Audit Engine (Feature 2)
- [ ] `auditEngine.ts` — pure function, takes form data, returns audit object
- [ ] Logic per tool:
  - Wrong plan for team size?
  - Cheaper plan from same vendor?
  - Cheaper alternative for use case?
  - Retail vs credits opportunity?
- [ ] Write 5+ unit tests in `auditEngine.test.ts`

### Day 4–5: Results Page (Feature 3)
- [ ] `AuditResult.tsx` — per-tool breakdown table
- [ ] `SavingsHero.tsx` — big monthly + annual savings number
- [ ] Conditional: >$500/mo savings → show TechVruk consultation CTA
- [ ] Conditional: <$100/mo or optimal → "You're spending well" + notify signup
- [ ] Visual polish — this page gets screenshotted

### Day 5: AI Summary (Feature 4)
- [ ] `anthropic.ts` — call Claude API with audit data
- [ ] Prompt: generate ~100-word personalized paragraph
- [ ] Graceful fallback: if API fails → use templated summary
- [ ] Document prompt in `PROMPTS.md`

### Day 5–6: Lead Capture + Email (Feature 5)
- [ ] `LeadCapture.tsx` — modal after audit shown (email + optional company/role)
- [ ] `leads` API route — store in Supabase
- [ ] Resend integration — send confirmation email
- [ ] Abuse protection: honeypot field + rate limiting (document in README)

### Day 6: Shareable URL (Feature 6)
- [ ] Each audit saved to DB with UUID
- [ ] `/audit/[id]` page — strips PII, shows tools + savings
- [ ] Open Graph meta tags (title, description, image)
- [ ] Twitter Card tags
- [ ] Copy-to-clipboard share button

### Day 7: Polish + Docs
- [ ] Lighthouse audit → fix to ≥85 performance, ≥90 accessibility
- [ ] CI workflow green
- [ ] All markdown files complete
- [ ] Deploy to Vercel, test live URL

---

## Database Schema (Supabase)

```sql
-- audits table
create table audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  tools jsonb not null,           -- array of tool inputs
  results jsonb not null,         -- audit engine output
  total_monthly_savings numeric,
  total_annual_savings numeric,
  use_case text,
  team_size int,
  ai_summary text
);

-- leads table
create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  audit_id uuid references audits(id),
  email text not null,
  company_name text,
  role text,
  team_size int,
  notified boolean default false
);
```

---

## Audit Engine Logic (Key Rules)

### Plan Fit Rules
| Tool | Rule |
|---|---|
| GitHub Copilot Business | If seats ≤ 2, suggest Individual plan |
| Claude Team | If seats ≤ 2, suggest Pro plan |
| ChatGPT Team | If seats ≤ 2, suggest Plus plan |
| Cursor Business | If seats ≤ 3, suggest Pro plan |

### Alternative Suggestions by Use Case
| Use Case | Overpaying On | Suggest |
|---|---|---|
| Coding only | ChatGPT Plus | Cursor Pro (more coding-focused) |
| Writing only | Cursor Pro | Claude Pro (better for writing) |
| Research | ChatGPT Plus + Claude Pro | Pick one, use the other's free tier |
| Mixed | Multiple premium plans | Consolidate to 1-2 tools |

### Credits Opportunity
- OpenAI API direct: if spend > $50/mo → check if startup credits available
- Anthropic API: if new account → $5 free credits available
- Google Gemini API: free tier generous for low usage

---

## AI Summary Prompt (Draft)

```
You are a financial advisor specializing in AI tool costs for startups.

Given this audit data:
- Tools used: {tools}
- Current monthly spend: ${currentSpend}
- Potential monthly savings: ${savings}
- Team size: {teamSize}
- Primary use case: {useCase}

Write a 100-word personalized summary that:
1. Acknowledges their current stack
2. Highlights the biggest saving opportunity
3. Gives one specific actionable recommendation
4. Ends with an encouraging note

Be direct, specific, and use actual numbers. Do not use generic advice.
```

---

## Pricing Data (Current — verify before submission)

| Tool | Plan | Price/user/mo | Source |
|---|---|---|---|
| Cursor | Hobby | $0 | cursor.com/pricing |
| Cursor | Pro | $20 | cursor.com/pricing |
| Cursor | Business | $40 | cursor.com/pricing |
| GitHub Copilot | Individual | $10 | github.com/features/copilot |
| GitHub Copilot | Business | $19 | github.com/features/copilot |
| GitHub Copilot | Enterprise | $39 | github.com/features/copilot |
| Claude | Free | $0 | anthropic.com/claude |
| Claude | Pro | $20 | anthropic.com/claude |
| Claude | Max | $100 | anthropic.com/claude |
| Claude | Team | $30/user | anthropic.com/claude |
| ChatGPT | Free | $0 | openai.com/chatgpt/pricing |
| ChatGPT | Plus | $20 | openai.com/chatgpt/pricing |
| ChatGPT | Team | $30/user | openai.com/chatgpt/pricing |
| Gemini | Free | $0 | one.google.com/about/plans |
| Gemini | Advanced | $19.99 | one.google.com/about/plans |
| Windsurf | Free | $0 | codeium.com/windsurf |
| Windsurf | Pro | $15 | codeium.com/windsurf |
| Windsurf | Teams | $35/user | codeium.com/windsurf |

> **IMPORTANT**: Verify ALL prices on official pages the week of submission. Prices change.

---

## Environment Variables Needed

```env
# .env.local (never commit this)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=https://spendlens.vercel.app
```

---

## Abuse Protection Plan
- **Honeypot field**: hidden `website` field in lead form — bots fill it, humans don't
- **Rate limiting**: Vercel Edge middleware, max 5 audits/IP/hour
- **No auth required**: audit is stateless, only lead capture hits DB

---

## Bonus Features (attempt after MVP)
- [ ] PDF export using `@react-pdf/renderer`
- [ ] Benchmark mode: "your spend per dev is $X, average is $Y"
- [ ] Blog post draft for Product Hunt launch

---

## Lighthouse Targets
- Performance: ≥ 85
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

Key actions:
- Use `next/image` for all images
- Add `aria-label` to all interactive elements
- Semantic HTML throughout
- No render-blocking resources

---

## Git Commit Convention
```
feat: add audit engine with plan-fit rules
feat: add shareable URL with OG tags
fix: handle Anthropic 429 with fallback summary
docs: add PRICING_DATA.md with verified sources
test: add 5 audit engine unit tests
chore: set up CI workflow
refactor: extract savings calculation to pure function
```

---

## Daily Build Plan

| Day | Date | Goal |
|---|---|---|
| Day 1 | D+0 | Project init, Supabase setup, pricing data |
| Day 2 | D+1 | Spend input form, localStorage persistence |
| Day 3 | D+2 | Audit engine + unit tests |
| Day 4 | D+3 | Results page UI, savings hero |
| Day 5 | D+4 | AI summary, lead capture, email |
| Day 6 | D+5 | Shareable URL, OG tags, deploy |
| Day 7 | D+6 | Polish, Lighthouse, all docs, CI green |
