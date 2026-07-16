const express = require('express');
const rateLimit = require('express-rate-limit');
const { generateAISummary } = require('../lib/anthropic');

const router = express.Router();

const summaryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Too many summary requests. Please try again later.' },
});

// POST /api/summary — generate AI summary for an audit
router.post('/', summaryLimiter, async (req, res) => {
  try {
    const { tools, currentSpend, savings, teamSize, useCase } = req.body;

    if (!tools || !currentSpend || savings === undefined || !teamSize || !useCase) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const result = await generateAISummary(tools, currentSpend, savings, teamSize, useCase);
    res.json(result);
  } catch (err) {
    console.error('Summary route error:', err);
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
});

module.exports = router;
