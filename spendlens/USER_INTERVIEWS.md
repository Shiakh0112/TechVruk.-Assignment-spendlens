# USER_INTERVIEWS.md

---

## Interview 1

**Name/Initials:** R.K.
**Role:** Co-founder & CTO
**Company Stage:** Seed, 9 employees (5 engineers)
**Date:** 2025-07-19
**Duration:** ~13 minutes

### Direct Quotes

1. "Honestly I have no idea what we're paying per month total. I know Cursor is on my card, GitHub Copilot is on someone else's card, and Claude — I think two people have personal Pro accounts we reimburse. It's a mess."
2. "The thing that would actually help me is if someone just told me — hey, you have three people paying for overlapping tools. I don't have time to go read four pricing pages."
3. "I'd share something like this with my team if it showed a number. Like, '$400/month wasted' — that gets attention in a standup."

### The Most Surprising Thing They Said

He didn't know his team was paying for both GitHub Copilot Business AND Cursor Pro for the same engineers. He assumed someone had cancelled one when they switched. The redundancy had been running for 4 months. That single insight — that the problem is often invisible, not just unoptimized — changed how I framed the audit results page. The hero number needed to be big and immediate, not buried.

### What It Changed About Your Design

I moved the total savings number to the very top of the results page (SavingsHero component) instead of showing it at the bottom after the per-tool breakdown. The "big number first" layout came directly from this conversation — he said "I need to see the number before I read the details."

---

## Interview 2

**Name/Initials:** Priya M.
**Role:** Founder / Solo operator
**Company Stage:** Pre-seed, 2 employees (just her and a part-time designer)
**Date:** 2025-07-19
**Duration:** ~10 minutes

### Direct Quotes

1. "I'm paying $20 for ChatGPT Plus and $20 for Claude Pro. I use Claude for writing and ChatGPT for... honestly I'm not sure anymore. Habit, I think."
2. "If a tool told me 'you can drop one of these and save $20/month' I would do it immediately. That's $240/year for basically nothing."
3. "I don't need a consultation. I need someone to just tell me what to cancel. Keep it simple."

### The Most Surprising Thing They Said

She said she'd be annoyed if the tool pushed a sales call on her when her savings were small. "If I'm only saving $20, don't try to sell me a $500 consulting package." This directly shaped the conditional CTA logic — for low-savings audits, I show "You're spending well" or a simple notify-me option instead of the TechVruk consultation CTA. The consultation CTA only appears for >$500/mo savings.

### What It Changed About Your Design

Added the honest "You're spending well" state for low-savings audits. Before this conversation, I was going to show the TechVruk CTA on every audit. That would have felt pushy and dishonest for users who are already optimized. The assignment actually required this too — but the interview made me understand *why* it matters, not just that it was required.

---

## Interview 3

**Name/Initials:** Arjun S.
**Role:** VP Engineering
**Company Stage:** Series A, 28 employees (14 engineers)
**Date:** 2025-07-20
**Duration:** ~14 minutes

### Direct Quotes

1. "We have a Notion doc where people are supposed to log their SaaS tools but nobody updates it. So I genuinely don't know our full AI spend. I'd estimate $2,000–$3,000/month but I've never verified that."
2. "The CFO asked me last quarter to justify our AI tool budget. I had to manually go through three months of credit card statements. That took two hours. A tool that does this in 30 seconds would have saved me that entire afternoon."
3. "What I'd actually want is a benchmark — are we spending more or less than other engineering teams our size? That context matters more than the raw number."

### The Most Surprising Thing They Said

He specifically asked for a benchmark comparison — "are we high or low compared to similar teams?" I hadn't planned to build this feature, but it was clearly valuable enough to add. The benchmarkComparison object in the audit engine and the benchmark display in SavingsHero came directly from this conversation. He also said the CFO use case was real — people need to *justify* AI spend upward, not just optimize it downward.

### What It Changed About Your Design

Added the benchmark comparison feature (spendPerDev vs avgPerDev for their use case). Also added the "your spend per developer" framing to the SavingsHero component — showing $X/dev/month makes it easier to compare across team sizes and is the number a VP Engineering would actually use in a board presentation.
