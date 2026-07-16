const express = require('express');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const Brevo = require('@getbrevo/brevo');
const Lead = require('../models/Lead');
const Audit = require('../models/Audit');

const router = express.Router();

// Brevo client — lazy init so missing key doesn't crash on startup
function getBrevoClient() {
  const apiClient = Brevo.ApiClient.instance;
  apiClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY || '';
  return new Brevo.TransactionalEmailsApi();
}

// Strict rate limit for lead capture: 5 per hour per IP
const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many requests. Please try again later.' },
});

// POST /api/leads — capture lead after audit shown
router.post('/', leadLimiter, async (req, res) => {
  try {
    const { auditId, email, companyName, role, teamSize, website } = req.body;

    // Honeypot: if 'website' field is filled, it's a bot
    if (website) {
      return res.status(200).json({ success: true }); // Silent reject
    }

    if (!auditId || !email) {
      return res.status(400).json({ error: 'Audit ID and email are required.' });
    }

    // Basic email validation — literal regex to prevent ReDoS
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    const audit = await Audit.findById(auditId);
    if (!audit) {
      return res.status(404).json({ error: 'Audit not found.' });
    }

    // Hash IP for abuse tracking (never store raw IP)
    // Operator precedence fix: wrap concatenation before || fallback
    const ipHash = crypto
      .createHash('sha256')
      .update((req.ip || '') + (process.env.IP_SALT || 'default-salt'))
      .digest('hex');

    // Upsert lead (prevent duplicate email per audit)
    const lead = await Lead.findOneAndUpdate(
      { email: email.toLowerCase(), auditId },
      {
        auditId,
        email: email.toLowerCase(),
        companyName,
        role,
        teamSize,
        totalMonthlySavings: audit.totalMonthlySavings,
        savingsCategory: audit.savingsCategory,
        ipHash,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send confirmation email via Resend
    if (!lead.emailSent) {
      await sendConfirmationEmail(email, audit, companyName);
      await Lead.findByIdAndUpdate(lead._id, { emailSent: true });
    }

    res.status(201).json({ success: true, leadId: lead._id });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key — already captured
      return res.status(200).json({ success: true, message: 'Already captured.' });
    }
    console.error('Lead capture error:', err);
    res.status(500).json({ error: 'Failed to save. Please try again.' });
  }
});

async function sendConfirmationEmail(email, audit, companyName) {
  const savings = audit.totalMonthlySavings;
  const isHighSavings = audit.savingsCategory === 'high';

  const escHtml = (str) =>
    String(str || '').replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  const safeCompany = escHtml(companyName);

  const subject = isHighSavings
    ? `Your AI Spend Audit — $${savings}/mo in savings identified`
    : `Your AI Spend Audit from SpendLens`;

  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h1 style="color: #1a1a2e; font-size: 24px;">Your AI Spend Audit is Ready</h1>
      ${safeCompany ? `<p>Hi ${safeCompany} team,</p>` : '<p>Hi there,</p>'}
      <p>We've completed your AI tool spend audit. Here's what we found:</p>
      <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin: 16px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 20px; font-weight: bold; color: #15803d;">
          Potential savings: $${savings}/month ($${savings * 12}/year)
        </p>
      </div>
      <p>View your full audit report: <a href="${process.env.CLIENT_URL}/audit/${audit._id}" style="color: #6366f1;">View Report →</a></p>
      ${
        isHighSavings
          ? `<div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0; font-weight: bold; color: #1d4ed8;">💡 You qualify for a free TechVruk consultation</p>
          <p style="margin: 8px 0 0;">With $${savings}/mo in identified savings, our team can help you implement these changes and find even more optimization opportunities.</p>
          <a href="https://techvruk.com/consultation" style="display: inline-block; margin-top: 12px; background: #6366f1; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Book Free Consultation →</a>
        </div>`
          : ''
      }
      <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
        You're receiving this because you used SpendLens to audit your AI tool spend.<br>
        <a href="#" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;

  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlBody;
    sendSmtpEmail.sender = { name: 'SpendLens', email: 'audit@spendlens.app' };
    sendSmtpEmail.to = [{ email }];

    await getBrevoClient().sendTransacEmail(sendSmtpEmail);
  } catch (err) {
    console.error('Email send error:', err.message);
    // Don't throw — email failure shouldn't break lead capture
  }
}

module.exports = router;
