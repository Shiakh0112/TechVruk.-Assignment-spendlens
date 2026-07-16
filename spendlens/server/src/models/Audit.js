const mongoose = require('mongoose');

const toolInputSchema = new mongoose.Schema({
  toolId: { type: String, required: true },
  toolName: String,
  planId: { type: String, required: true },
  monthlySpend: { type: Number, required: true, min: 0 },
  seats: { type: Number, required: true, min: 1 },
});

const toolResultSchema = new mongoose.Schema({
  toolId: String,
  toolName: String,
  currentSpend: Number,
  monthlySavings: Number,
  recommendation: {
    type: String,
    enum: ['no_change', 'downgrade_plan', 'switch_tool', 'consolidate', 'use_credits'],
  },
  reason: String,
  suggestedPlan: String,
  suggestedTool: String,
});

const auditSchema = new mongoose.Schema(
  {
    tools: [toolInputSchema],
    results: [toolResultSchema],
    totalCurrentSpend: Number,
    totalMonthlySavings: Number,
    totalAnnualSavings: Number,
    teamSize: { type: Number, required: true, min: 1 },
    useCase: {
      type: String,
      enum: ['coding', 'writing', 'data', 'research', 'mixed'],
      required: true,
    },
    savingsCategory: { type: String, enum: ['high', 'medium', 'low'] },
    aiSummary: String,
    aiSummarySource: { type: String, enum: ['ai', 'fallback'] },
    benchmarkComparison: {
      yourSpendPerDev: Number,
      avgSpendPerDev: Number,
      p75SpendPerDev: Number,
      status: String,
    },
    // PII stripped from public view — stored separately in leads
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model('Audit', auditSchema);
