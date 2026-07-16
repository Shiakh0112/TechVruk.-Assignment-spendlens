const {
  runAudit,
  auditTool,
  checkPlanFit,
  findCheaperPlan,
  suggestAlternative,
  checkCreditsOpportunity,
} = require('../lib/auditEngine');
const { PRICING } = require('../lib/pricingData');

describe('Audit Engine — Plan Fit Rules', () => {
  test('GitHub Copilot Business with 2 seats should suggest Individual plan', () => {
    const result = checkPlanFit('github_copilot', 'business', 2, 38, PRICING.github_copilot);
    expect(result).not.toBeNull();
    expect(result.recommendation).toBe('downgrade_plan');
    expect(result.suggestedPlan).toBe('individual');
    expect(result.monthlySavings).toBe(18); // 38 - (10*2)
  });

  test('GitHub Copilot Business with 5 seats should NOT trigger plan fit rule', () => {
    const result = checkPlanFit('github_copilot', 'business', 5, 95, PRICING.github_copilot);
    expect(result).toBeNull();
  });

  test('Claude Team with 3 seats should suggest Pro plan', () => {
    const result = checkPlanFit('claude', 'team', 3, 90, PRICING.claude);
    expect(result).not.toBeNull();
    expect(result.recommendation).toBe('downgrade_plan');
    expect(result.suggestedPlan).toBe('pro');
    expect(result.monthlySavings).toBe(30); // 90 - (20*3)
  });

  test('ChatGPT Team with 2 seats should suggest Plus plan', () => {
    const result = checkPlanFit('chatgpt', 'team', 2, 60, PRICING.chatgpt);
    expect(result).not.toBeNull();
    expect(result.recommendation).toBe('downgrade_plan');
    expect(result.suggestedPlan).toBe('plus');
    expect(result.monthlySavings).toBe(20); // 60 - (20*2)
  });

  test('Cursor Business with 3 seats should suggest Pro plan', () => {
    const result = checkPlanFit('cursor', 'business', 3, 120, PRICING.cursor);
    expect(result).not.toBeNull();
    expect(result.recommendation).toBe('downgrade_plan');
    expect(result.suggestedPlan).toBe('pro');
    expect(result.monthlySavings).toBe(60); // 120 - (20*3)
  });

  test('GitHub Copilot Enterprise with 5 seats should suggest Business plan', () => {
    const result = checkPlanFit('github_copilot', 'enterprise', 5, 195, PRICING.github_copilot);
    expect(result).not.toBeNull();
    expect(result.recommendation).toBe('downgrade_plan');
    expect(result.suggestedPlan).toBe('business');
    expect(result.monthlySavings).toBe(100); // 195 - (19*5)
  });
});

describe('Audit Engine — Alternative Tool Suggestions', () => {
  test('ChatGPT Plus for coding use case should suggest Windsurf', () => {
    const result = suggestAlternative('chatgpt', 'plus', 20, 1, 'coding');
    expect(result).not.toBeNull();
    expect(result.recommendation).toBe('switch_tool');
    expect(result.suggestedTool).toBe('windsurf');
  });

  test('Cursor Pro for writing use case should suggest Claude', () => {
    const result = suggestAlternative('cursor', 'pro', 20, 1, 'writing');
    expect(result).not.toBeNull();
    expect(result.recommendation).toBe('switch_tool');
    expect(result.suggestedTool).toBe('claude');
  });

  test('ChatGPT Plus for research use case should suggest consolidation', () => {
    const result = suggestAlternative('chatgpt', 'plus', 20, 1, 'research');
    expect(result).not.toBeNull();
    expect(result.recommendation).toBe('consolidate');
  });

  test('GitHub Copilot Individual for solo dev should suggest Cursor consolidation', () => {
    const result = suggestAlternative('github_copilot', 'individual', 10, 1, 'coding');
    expect(result).not.toBeNull();
    expect(result.recommendation).toBe('consolidate');
    expect(result.suggestedTool).toBe('cursor');
    expect(result.monthlySavings).toBe(10);
  });
});

describe('Audit Engine — Credits Opportunity', () => {
  test('OpenAI API spend > $50 should flag credits opportunity', () => {
    const result = checkCreditsOpportunity('openai_api', 75);
    expect(result).not.toBeNull();
    expect(result.recommendation).toBe('use_credits');
  });

  test('OpenAI API spend <= $50 should NOT flag credits', () => {
    const result = checkCreditsOpportunity('openai_api', 30);
    expect(result).toBeNull();
  });

  test('Anthropic API spend > $30 should flag credits opportunity', () => {
    const result = checkCreditsOpportunity('anthropic_api', 50);
    expect(result).not.toBeNull();
    expect(result.recommendation).toBe('use_credits');
  });
});

describe('Audit Engine — Full Audit Run', () => {
  test('runAudit returns correct total savings', () => {
    const tools = [
      { toolId: 'github_copilot', planId: 'business', monthlySpend: 38, seats: 2 },
      { toolId: 'cursor', planId: 'business', monthlySpend: 120, seats: 3 },
    ];
    const result = runAudit(tools, 3, 'coding');
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
    expect(result.toolResults).toHaveLength(2);
  });

  test('runAudit with optimal spend returns low savings category', () => {
    const tools = [
      { toolId: 'cursor', planId: 'pro', monthlySpend: 20, seats: 1 },
    ];
    const result = runAudit(tools, 1, 'coding');
    expect(result.savingsCategory).toBe('low');
  });

  test('runAudit with high overspend returns high savings category', () => {
    const tools = [
      { toolId: 'github_copilot', planId: 'enterprise', monthlySpend: 195, seats: 5 },
      { toolId: 'cursor', planId: 'business', monthlySpend: 200, seats: 5 },
      { toolId: 'claude', planId: 'team', monthlySpend: 150, seats: 5 },
    ];
    const result = runAudit(tools, 5, 'coding');
    expect(result.savingsCategory).toBe('high');
    expect(result.totalMonthlySavings).toBeGreaterThan(500);
  });

  test('runAudit benchmark comparison is calculated correctly', () => {
    const tools = [{ toolId: 'cursor', planId: 'pro', monthlySpend: 20, seats: 1 }];
    const result = runAudit(tools, 1, 'coding');
    expect(result.benchmarkComparison).toHaveProperty('yourSpendPerDev');
    expect(result.benchmarkComparison).toHaveProperty('avgSpendPerDev');
    expect(result.benchmarkComparison).toHaveProperty('status');
  });

  test('runAudit with unknown tool returns no_change recommendation', () => {
    const tools = [{ toolId: 'unknown_tool', planId: 'pro', monthlySpend: 50, seats: 1 }];
    const result = runAudit(tools, 1, 'mixed');
    expect(result.toolResults[0].recommendation).toBe('no_change');
    expect(result.toolResults[0].monthlySavings).toBe(0);
  });
});
