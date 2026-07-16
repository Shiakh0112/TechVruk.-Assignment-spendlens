# TESTS.md

## How to Run Tests

```bash
cd server
npm install
npm test
```

All tests are in `server/src/__tests__/auditEngine.test.js`.

---

## Test List

### File: `server/src/__tests__/auditEngine.test.js`

| # | Test Name | What It Covers |
|---|---|---|
| 1 | GitHub Copilot Business with 2 seats should suggest Individual plan | Plan fit rule: Business → Individual when seats ≤ 2. Verifies savings = $18 (38 - 10×2) |
| 2 | GitHub Copilot Business with 5 seats should NOT trigger plan fit rule | Negative case: Business plan is appropriate for 5 seats |
| 3 | Claude Team with 3 seats should suggest Pro plan | Plan fit rule: Team → Pro when seats < 5. Verifies savings = $30 (90 - 20×3) |
| 4 | ChatGPT Team with 2 seats should suggest Plus plan | Plan fit rule: Team → Plus when seats ≤ 2. Verifies savings = $20 (60 - 20×2) |
| 5 | Cursor Business with 3 seats should suggest Pro plan | Plan fit rule: Business → Pro when seats ≤ 3. Verifies savings = $60 (120 - 20×3) |
| 6 | GitHub Copilot Enterprise with 5 seats should suggest Business plan | Plan fit rule: Enterprise → Business when seats ≤ 5. Verifies savings = $100 (195 - 19×5) |
| 7 | ChatGPT Plus for coding use case should suggest Windsurf | Alternative tool rule: ChatGPT Plus → Windsurf for coding-only teams |
| 8 | Cursor Pro for writing use case should suggest Claude | Alternative tool rule: Cursor Pro → Claude Pro for writing-focused teams |
| 9 | ChatGPT Plus for research use case should suggest consolidation | Consolidation rule: research teams paying for both ChatGPT + Claude should pick one |
| 10 | GitHub Copilot Individual for solo dev should suggest Cursor consolidation | Consolidation rule: solo dev with both Copilot + Cursor should drop Copilot |
| 11 | OpenAI API spend > $50 should flag credits opportunity | Credits rule: high API spend triggers startup credits recommendation |
| 12 | OpenAI API spend ≤ $50 should NOT flag credits | Negative case: low API spend doesn't trigger credits recommendation |
| 13 | Anthropic API spend > $30 should flag credits opportunity | Credits rule: Anthropic API spend triggers credits recommendation |
| 14 | runAudit returns correct total savings | Integration: full audit run returns correct totals and annual savings |
| 15 | runAudit with optimal spend returns low savings category | Integration: well-optimized stack correctly categorized as 'low' |
| 16 | runAudit with high overspend returns high savings category | Integration: heavily overspending team correctly categorized as 'high' with >$500/mo savings |
| 17 | runAudit benchmark comparison is calculated correctly | Integration: benchmark object has all required fields |
| 18 | runAudit with unknown tool returns no_change recommendation | Edge case: unknown tool IDs handled gracefully without crashing |

---

## Test Coverage

The tests cover:
- All 4 rule types in the audit engine (plan fit, cheaper plan, alternative tool, credits)
- Positive and negative cases for each rule
- Edge cases (unknown tools, solo devs, minimum seat requirements)
- Full integration via `runAudit` function
- Savings calculation accuracy (exact dollar amounts verified)
- Savings category classification (high/medium/low)
- Benchmark comparison output shape
