const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    auditId: { type: mongoose.Schema.Types.ObjectId, ref: 'Audit', required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    companyName: { type: String, trim: true },
    role: { type: String, trim: true },
    teamSize: Number,
    totalMonthlySavings: Number,
    savingsCategory: { type: String, enum: ['high', 'medium', 'low'] },
    emailSent: { type: Boolean, default: false },
    notifiedForConsultation: { type: Boolean, default: false },
    // Abuse protection
    ipHash: String,
  },
  { timestamps: true }
);

// Prevent duplicate email per audit
leadSchema.index({ email: 1, auditId: 1 }, { unique: true });

module.exports = mongoose.model('Lead', leadSchema);
