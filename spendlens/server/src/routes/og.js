const express = require('express');
const Audit = require('../models/Audit');

const router = express.Router();

// Escape HTML special chars to prevent XSS in server-rendered OG page
function escHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

/**
 * GET /api/og/:id
 * Returns a minimal HTML page with correct OG/Twitter meta tags for the audit.
 * Used by social crawlers (Twitterbot, facebookexternalhit, LinkedInBot, Slackbot).
 * Real users are redirected to the React SPA.
 */
router.get('/:id', async (req, res) => {
  const BOT_AGENTS = /twitterbot|facebookexternalhit|linkedinbot|slackbot|whatsapp|telegrambot|discordbot|googlebot/i;
  const userAgent = req.headers['user-agent'] || '';
  const isCrawler = BOT_AGENTS.test(userAgent);

  try {
    const audit = await Audit.findById(req.params.id).select(
      'totalMonthlySavings totalAnnualSavings savingsCategory useCase teamSize'
    );

    if (!audit) {
      return res.status(404).send('Not found');
    }

    const savings = audit.totalMonthlySavings;
    const appUrl = process.env.CLIENT_URL || 'https://spendlens.app';
    const auditUrl = `${appUrl}/audit/${audit._id}`;

    const title = escHtml(
      savings > 0
        ? `AI Spend Audit — $${savings}/mo savings found | SpendLens`
        : 'AI Spend Audit — Optimized Stack | SpendLens'
    );

    const description = escHtml(
      savings > 0
        ? `This ${audit.teamSize}-person team could save $${savings}/month ($${audit.totalAnnualSavings}/year) on AI tools. See the full breakdown.`
        : `This ${audit.teamSize}-person team is already spending efficiently on AI tools. See the full audit.`
    );

    const safeAuditUrl = encodeURI(auditUrl);
    const ogImage = `${appUrl}/og-image.png`;

    if (isCrawler) {
      // Serve full HTML with OG tags for crawlers
      return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${safeAuditUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage}" />
  <meta http-equiv="refresh" content="0;url=${safeAuditUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${safeAuditUrl}">your audit</a>...</p>
</body>
</html>`);
    }

    // Real users: redirect to React SPA
    res.redirect(302, auditUrl);
  } catch (err) {
    console.error('OG route error:', err);
    res.status(500).send('Error');
  }
});

module.exports = router;
