const express = require('express');
const rateLimit = require('express-rate-limit');
const Audit = require('../models/Audit');
const { runAudit } = require('../lib/auditEngine');
const { generateAISummary } = require('../lib/anthropic');

const router = express.Router();

// Strict rate limit for audit creation: 10 per hour per IP
const auditLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many audits created. Please try again in an hour.' },
});

// POST /api/audit — create new audit
router.post('/', auditLimiter, async (req, res) => {
  try {
    const { tools, teamSize, useCase } = req.body;

    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      return res.status(400).json({ error: 'At least one tool is required.' });
    }
    if (tools.length > 20) {
      return res.status(400).json({ error: 'Maximum 20 tools allowed per audit.' });
    }
    if (!teamSize || teamSize < 1 || teamSize > 100000) {
      return res.status(400).json({ error: 'Team size must be between 1 and 100,000.' });
    }
    const VALID_USE_CASES = ['coding', 'writing', 'data', 'research', 'mixed'];
    if (!useCase || !VALID_USE_CASES.includes(useCase)) {
      return res.status(400).json({ error: `Use case must be one of: ${VALID_USE_CASES.join(', ')}.` });
    }
    // Validate each tool entry
    for (const tool of tools) {
      if (!tool.toolId || typeof tool.toolId !== 'string') {
        return res.status(400).json({ error: 'Each tool must have a valid toolId.' });
      }
      if (tool.monthlySpend < 0 || tool.monthlySpend > 1000000) {
        return res.status(400).json({ error: 'Monthly spend must be between $0 and $1,000,000.' });
      }
      if (!tool.seats || tool.seats < 1 || tool.seats > 100000) {
        return res.status(400).json({ error: 'Seats must be between 1 and 100,000.' });
      }
    }

    // Run audit engine
    const auditResult = runAudit(tools, teamSize, useCase);

    // Generate AI summary
    const toolNames = tools.map((t) => t.toolName || t.toolId);
    const summaryResult = await generateAISummary(
      toolNames,
      auditResult.totalCurrentSpend,
      auditResult.totalMonthlySavings,
      teamSize,
      useCase
    );

    // Save to MongoDB
    const audit = await Audit.create({
      tools,
      results: auditResult.toolResults,
      totalCurrentSpend: auditResult.totalCurrentSpend,
      totalMonthlySavings: auditResult.totalMonthlySavings,
      totalAnnualSavings: auditResult.totalAnnualSavings,
      teamSize,
      useCase,
      savingsCategory: auditResult.savingsCategory,
      aiSummary: summaryResult.summary,
      aiSummarySource: summaryResult.source,
      benchmarkComparison: auditResult.benchmarkComparison,
    });

    res.status(201).json({
      auditId: audit._id.toString(),
      ...auditResult,
      aiSummary: summaryResult.summary,
      aiSummarySource: summaryResult.source,
    });
  } catch (err) {
    console.error('Audit creation error:', err);
    res.status(500).json({ error: 'Failed to create audit. Please try again.' });
  }
});

// GET /api/audit/:id — fetch public audit (PII stripped)
router.get('/:id', async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id).select(
      '-__v'
    );

    if (!audit) {
      return res.status(404).json({ error: 'Audit not found.' });
    }

    // Strip any PII — only return tools, results, savings, summary
    const publicAudit = {
      auditId: audit._id.toString(),
      tools: audit.tools,
      results: audit.results,
      totalCurrentSpend: audit.totalCurrentSpend,
      totalMonthlySavings: audit.totalMonthlySavings,
      totalAnnualSavings: audit.totalAnnualSavings,
      teamSize: audit.teamSize,
      useCase: audit.useCase,
      savingsCategory: audit.savingsCategory,
      aiSummary: audit.aiSummary,
      aiSummarySource: audit.aiSummarySource,
      benchmarkComparison: audit.benchmarkComparison,
      createdAt: audit.createdAt,
    };

    res.json(publicAudit);
  } catch (err) {
    console.error('Audit fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch audit.' });
  }
});

module.exports = router;
