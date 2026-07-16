const { PRICING, BENCHMARKS } = require('./pricingData');

/**
 * Core audit engine — pure function, no side effects.
 * Takes user's tool inputs, returns per-tool recommendations + totals.
 */
function runAudit(tools, teamSize, useCase) {
  const results = tools.map((tool) => auditTool(tool, teamSize, useCase));
  const totalMonthlySavings = results.reduce((sum, r) => sum + r.monthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;
  const totalCurrentSpend = tools.reduce((sum, t) => sum + (t.monthlySpend || 0), 0);

  // Benchmark calculation
  const benchmark = BENCHMARKS[useCase] || BENCHMARKS.mixed;
  const spendPerDev = teamSize > 0 ? totalCurrentSpend / teamSize : totalCurrentSpend;
  const benchmarkComparison = {
    yourSpendPerDev: Math.round(spendPerDev),
    avgSpendPerDev: benchmark.avgPerDev,
    p75SpendPerDev: benchmark.p75PerDev,
    status:
      spendPerDev <= benchmark.avgPerDev
        ? 'below_average'
        : spendPerDev <= benchmark.p75PerDev
        ? 'above_average'
        : 'high',
  };

  return {
    toolResults: results,
    totalCurrentSpend,
    totalMonthlySavings: Math.round(totalMonthlySavings * 100) / 100,
    totalAnnualSavings: Math.round(totalAnnualSavings * 100) / 100,
    benchmarkComparison,
    savingsCategory:
      totalMonthlySavings > 500 ? 'high' : totalMonthlySavings < 100 ? 'low' : 'medium',
  };
}

function auditTool(tool, teamSize, useCase) {
  const { toolId, planId, monthlySpend, seats } = tool;
  const pricingInfo = PRICING[toolId];

  if (!pricingInfo) {
    return {
      toolId,
      toolName: tool.toolName || toolId,
      currentSpend: monthlySpend,
      monthlySavings: 0,
      recommendation: 'no_change',
      reason: 'Tool not found in pricing database.',
      suggestedPlan: null,
      suggestedTool: null,
    };
  }

  const currentPlan = pricingInfo.plans[planId];
  let monthlySavings = 0;
  let recommendation = 'no_change';
  let reason = 'Your current plan is well-suited for your usage.';
  let suggestedPlan = null;
  let suggestedTool = null;

  // --- Rule 1: Plan fit for team size ---
  const planFitResult = checkPlanFit(toolId, planId, seats, monthlySpend, pricingInfo);
  if (planFitResult) {
    return { toolId, toolName: pricingInfo.name, currentSpend: monthlySpend, ...planFitResult };
  }

  // --- Rule 2: Cheaper plan from same vendor ---
  const cheaperPlanResult = findCheaperPlan(toolId, planId, seats, monthlySpend, pricingInfo);
  if (cheaperPlanResult) {
    return { toolId, toolName: pricingInfo.name, currentSpend: monthlySpend, ...cheaperPlanResult };
  }

  // --- Rule 3: Alternative tool for use case ---
  const altResult = suggestAlternative(toolId, planId, monthlySpend, seats, useCase);
  if (altResult) {
    return { toolId, toolName: pricingInfo.name, currentSpend: monthlySpend, ...altResult };
  }

  // --- Rule 4: Credits opportunity ---
  const creditsResult = checkCreditsOpportunity(toolId, monthlySpend);
  if (creditsResult) {
    return { toolId, toolName: pricingInfo.name, currentSpend: monthlySpend, ...creditsResult };
  }

  return {
    toolId,
    toolName: pricingInfo.name,
    currentSpend: monthlySpend,
    monthlySavings: 0,
    recommendation: 'no_change',
    reason: 'Your current plan is well-suited for your team size and use case.',
    suggestedPlan: null,
    suggestedTool: null,
  };
}

function checkPlanFit(toolId, planId, seats, monthlySpend, pricingInfo) {
  // GitHub Copilot: Business plan for ≤2 users → Individual is enough
  if (toolId === 'github_copilot' && planId === 'business' && seats <= 2) {
    const individualCost = 10 * seats;
    const savings = monthlySpend - individualCost;
    if (savings > 0) {
      return {
        monthlySavings: savings,
        recommendation: 'downgrade_plan',
        reason: `GitHub Copilot Business ($19/seat) is designed for teams. With ${seats} seat(s), Individual plan ($10/seat) covers the same core features — saving you $${savings}/mo.`,
        suggestedPlan: 'individual',
        suggestedTool: null,
      };
    }
  }

  // Claude Team: min 5 seats required, but if paying for Team with <5 users, Pro is cheaper
  if (toolId === 'claude' && planId === 'team' && seats < 5) {
    const proCost = 20 * seats;
    const savings = monthlySpend - proCost;
    if (savings > 0) {
      return {
        monthlySavings: savings,
        recommendation: 'downgrade_plan',
        reason: `Claude Team ($30/seat) requires a minimum of 5 seats. With ${seats} user(s), Claude Pro ($20/seat) gives the same model access at $${savings}/mo less.`,
        suggestedPlan: 'pro',
        suggestedTool: null,
      };
    }
  }

  // ChatGPT Team: for ≤2 users, Plus is sufficient
  if (toolId === 'chatgpt' && planId === 'team' && seats <= 2) {
    const plusCost = 20 * seats;
    const savings = monthlySpend - plusCost;
    if (savings > 0) {
      return {
        monthlySavings: savings,
        recommendation: 'downgrade_plan',
        reason: `ChatGPT Team ($30/seat) adds admin controls and higher limits, but with ${seats} user(s) the Plus plan ($20/seat) covers all core capabilities — saving $${savings}/mo.`,
        suggestedPlan: 'plus',
        suggestedTool: null,
      };
    }
  }

  // Cursor Business: for ≤3 users, Pro is sufficient
  if (toolId === 'cursor' && planId === 'business' && seats <= 3) {
    const proCost = 20 * seats;
    const savings = monthlySpend - proCost;
    if (savings > 0) {
      return {
        monthlySavings: savings,
        recommendation: 'downgrade_plan',
        reason: `Cursor Business ($40/seat) adds SSO and admin features for larger teams. With ${seats} seat(s), Cursor Pro ($20/seat) provides the same AI capabilities — saving $${savings}/mo.`,
        suggestedPlan: 'pro',
        suggestedTool: null,
      };
    }
  }

  // GitHub Copilot Enterprise: for ≤5 users, Business is sufficient
  if (toolId === 'github_copilot' && planId === 'enterprise' && seats <= 5) {
    const businessCost = 19 * seats;
    const savings = monthlySpend - businessCost;
    if (savings > 0) {
      return {
        monthlySavings: savings,
        recommendation: 'downgrade_plan',
        reason: `GitHub Copilot Enterprise ($39/seat) is built for large orgs needing custom models and compliance. With ${seats} seat(s), Business ($19/seat) covers all coding features — saving $${savings}/mo.`,
        suggestedPlan: 'business',
        suggestedTool: null,
      };
    }
  }

  return null;
}

function findCheaperPlan(toolId, planId, seats, monthlySpend, pricingInfo) {
  const plans = pricingInfo.plans;
  const currentPlan = plans[planId];
  if (!currentPlan || currentPlan.usageBased || currentPlan.custom) return null;

  const currentCostPerSeat = currentPlan.pricePerSeat;
  let bestSavings = 0;
  let bestPlanId = null;

  for (const [pid, plan] of Object.entries(plans)) {
    if (pid === planId || plan.usageBased || plan.custom || plan.pricePerSeat === null) continue;
    if (plan.pricePerSeat >= currentCostPerSeat) continue;
    // Check min seats constraint
    if (plan.minSeats && seats < plan.minSeats) continue;

    const potentialCost = plan.pricePerSeat * seats;
    const currentCost = currentCostPerSeat * seats;
    const savings = currentCost - potentialCost;

    if (savings > bestSavings) {
      bestSavings = savings;
      bestPlanId = pid;
    }
  }

  if (bestPlanId && bestSavings > 0) {
    const suggestedPlanInfo = plans[bestPlanId];
    return {
      monthlySavings: bestSavings,
      recommendation: 'downgrade_plan',
      reason: `${pricingInfo.name} ${suggestedPlanInfo.label} ($${suggestedPlanInfo.pricePerSeat}/seat) covers your needs at a lower price point than ${plans[planId].label} ($${currentCostPerSeat}/seat) — saving $${bestSavings}/mo for ${seats} seat(s).`,
      suggestedPlan: bestPlanId,
      suggestedTool: null,
    };
  }

  return null;
}

function suggestAlternative(toolId, planId, monthlySpend, seats, useCase) {
  // Coding use case: ChatGPT Plus → Cursor Pro (more coding-focused, same price)
  if (toolId === 'chatgpt' && planId === 'plus' && useCase === 'coding') {
    return {
      monthlySavings: 5 * seats,
      recommendation: 'switch_tool',
      reason: `For coding-only use, Cursor Pro ($20/seat) provides deeper IDE integration, codebase context, and multi-file edits vs ChatGPT Plus ($20/seat). Windsurf Pro ($15/seat) is even cheaper — saving $5/seat/mo with equivalent coding AI.`,
      suggestedPlan: 'pro',
      suggestedTool: 'windsurf',
    };
  }

  // Writing use case: Cursor Pro → Claude Pro (Claude is better for writing)
  if (toolId === 'cursor' && planId === 'pro' && useCase === 'writing') {
    return {
      monthlySavings: 0,
      recommendation: 'switch_tool',
      reason: `For writing-focused work, Cursor Pro ($20/seat) is optimized for code, not prose. Claude Pro ($20/seat) offers superior long-form writing, summarization, and document analysis at the same price.`,
      suggestedPlan: 'pro',
      suggestedTool: 'claude',
    };
  }

  // Research use case: paying for both ChatGPT Plus AND Claude Pro → pick one
  if (
    (toolId === 'chatgpt' && planId === 'plus' && useCase === 'research') ||
    (toolId === 'claude' && planId === 'pro' && useCase === 'research')
  ) {
    return {
      monthlySavings: 20 * seats,
      recommendation: 'consolidate',
      reason: `For research, Claude Pro ($20/seat) and ChatGPT Plus ($20/seat) have significant capability overlap. Consolidating to Claude Pro (stronger at document analysis and long context) and using ChatGPT's free tier for quick queries saves $20/seat/mo.`,
      suggestedPlan: 'pro',
      suggestedTool: toolId === 'chatgpt' ? 'claude' : 'chatgpt',
    };
  }

  // GitHub Copilot Individual + Cursor Pro = redundant for solo devs
  if (toolId === 'github_copilot' && planId === 'individual' && seats === 1) {
    return {
      monthlySavings: 10,
      recommendation: 'consolidate',
      reason: `GitHub Copilot Individual ($10/mo) and Cursor Pro ($20/mo) serve the same purpose for a solo developer. Cursor Pro includes more powerful multi-file context and is a superset of Copilot's inline completions — dropping Copilot saves $10/mo.`,
      suggestedPlan: null,
      suggestedTool: 'cursor',
    };
  }

  // Gemini Advanced: for coding use case, Windsurf Free is better value
  if (toolId === 'gemini' && planId === 'advanced' && useCase === 'coding') {
    return {
      monthlySavings: 19.99 * seats,
      recommendation: 'switch_tool',
      reason: `Gemini Advanced ($19.99/seat) is a general-purpose AI. For coding specifically, Windsurf Free ($0) provides IDE-native code completion and generation — saving ~$20/seat/mo.`,
      suggestedPlan: 'free',
      suggestedTool: 'windsurf',
    };
  }

  return null;
}

function checkCreditsOpportunity(toolId, monthlySpend) {
  if (toolId === 'openai_api' && monthlySpend > 50) {
    return {
      monthlySavings: 0,
      recommendation: 'use_credits',
      reason: `You're spending $${monthlySpend}/mo on OpenAI API. OpenAI offers startup credits ($2,500–$25,000) via their Startup Program. Apply at platform.openai.com/startups — this could offset months of API costs.`,
      suggestedPlan: null,
      suggestedTool: null,
    };
  }

  if (toolId === 'anthropic_api' && monthlySpend > 30) {
    return {
      monthlySavings: 0,
      recommendation: 'use_credits',
      reason: `Anthropic offers API credits for startups and researchers. At $${monthlySpend}/mo, applying for credits at anthropic.com/api could significantly reduce your costs.`,
      suggestedPlan: null,
      suggestedTool: null,
    };
  }

  return null;
}

module.exports = { runAudit, auditTool, checkPlanFit, findCheaperPlan, suggestAlternative, checkCreditsOpportunity };
