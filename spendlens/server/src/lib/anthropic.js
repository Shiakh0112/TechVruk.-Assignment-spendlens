const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PROMPT_TEMPLATE = (tools, currentSpend, savings, teamSize, useCase) => `You are a financial advisor specializing in AI tool costs for startups.

Given this audit data:
- Tools used: ${tools.join(', ')}
- Current monthly spend: $${currentSpend}
- Potential monthly savings: $${savings}
- Team size: ${teamSize} people
- Primary use case: ${useCase}

Write a 100-word personalized summary paragraph that:
1. Acknowledges their current AI stack by name
2. Highlights the single biggest saving opportunity with the exact dollar amount
3. Gives one specific, actionable recommendation
4. Ends with an encouraging note about their AI investment

Be direct, specific, and use actual numbers. Do not use generic advice. Do not use bullet points — write flowing prose only.`;

function generateFallbackSummary(tools, currentSpend, savings, teamSize, useCase) {
  if (savings < 100) {
    return `Your team of ${teamSize} is running a lean AI stack with ${tools.join(', ')}, spending $${currentSpend}/month on ${useCase} workflows. Based on our audit, your current setup is well-optimized — we found minimal savings opportunities, which means you're already making smart choices. Keep an eye on usage as your team grows, as plan thresholds can shift quickly. You're in a strong position.`;
  }
  return `Your team of ${teamSize} is currently spending $${currentSpend}/month across ${tools.join(', ')} for ${useCase} work. Our audit identified $${savings}/month ($${savings * 12}/year) in potential savings — primarily through plan right-sizing and tool consolidation. The biggest opportunity is switching to plans that match your actual team size rather than paying for enterprise features you don't need. Implementing these changes could free up significant budget to reinvest in growth.`;
}

async function generateAISummary(tools, currentSpend, savings, teamSize, useCase) {
  try {
    const message = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: PROMPT_TEMPLATE(tools, currentSpend, savings, teamSize, useCase),
        },
      ],
    });

    return {
      summary: message.content[0].text,
      source: 'ai',
      prompt: PROMPT_TEMPLATE(tools, currentSpend, savings, teamSize, useCase),
    };
  } catch (err) {
    console.error('Anthropic API error, using fallback:', err.message);
    return {
      summary: generateFallbackSummary(tools, currentSpend, savings, teamSize, useCase),
      source: 'fallback',
      error: err.message,
    };
  }
}

module.exports = { generateAISummary, PROMPT_TEMPLATE };
