# PROMPTS.md

## Prompt 1: Audit Summary Generation

### Full Prompt

```
You are a financial advisor specializing in AI tool costs for startups.

Given this audit data:
- Tools used: {tools}
- Current monthly spend: ${currentSpend}
- Potential monthly savings: ${savings}
- Team size: {teamSize} people
- Primary use case: {useCase}

Write a 100-word personalized summary paragraph that:
1. Acknowledges their current AI stack by name
2. Highlights the single biggest saving opportunity with the exact dollar amount
3. Gives one specific, actionable recommendation
4. Ends with an encouraging note about their AI investment

Be direct, specific, and use actual numbers. Do not use generic advice. Do not use bullet points — write flowing prose only.
```

### Why I Wrote It This Way

- **Persona framing ("financial advisor")** — Without this, Claude tends to write like a tech blogger. The financial advisor persona produces more precise, number-forward language that a CFO would trust.
- **Explicit word count** — "100-word" keeps the output tight. Without it, Claude writes 300+ words that overwhelm the UI.
- **"Flowing prose only"** — Early versions returned bullet points, which broke the card layout and felt robotic.
- **"Use actual numbers"** — Without this instruction, Claude would write "significant savings" instead of "$240/month."
- **4-part structure** — Gives Claude a clear scaffold so every summary hits the same beats regardless of input variation.

### What I Tried That Didn't Work

1. **"Write a summary of this AI audit"** — Too vague. Produced generic output like "Your team uses several AI tools and could save money by optimizing your subscriptions." Useless.

2. **Asking for bullet points** — Looked bad in the UI and felt like a report, not a personalized insight.

3. **Including the full audit JSON in the prompt** — Claude would summarize the JSON structure instead of the business insight. Switching to natural language inputs fixed this.

4. **"Be encouraging"** without the financial advisor persona — Produced overly cheerful, non-specific output. The persona grounds the tone.

### Model Choice

Using `claude-3-5-haiku-20241022` — fastest and cheapest Claude model, sufficient for a 100-word summary. Sonnet would be overkill and 5x more expensive per token.

### Fallback Behavior

If the Anthropic API fails (429, 500, timeout, or missing API key), the server falls back to a template-based summary in `anthropic.js`. The fallback uses the same data points but fills a pre-written template. The UI shows a "Template" badge instead of "Claude AI" so users know the difference.
