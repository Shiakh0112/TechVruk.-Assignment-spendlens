import { ArrowRight, CheckCircle, AlertCircle, RefreshCw, Layers, CreditCard } from 'lucide-react';
import { RECOMMENDATION_LABELS, TOOLS } from '../lib/constants';
import clsx from 'clsx';

const RECOMMENDATION_ICONS = {
  no_change: CheckCircle,
  downgrade_plan: ArrowRight,
  switch_tool: RefreshCw,
  consolidate: Layers,
  use_credits: CreditCard,
};

export default function AuditResult({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <section aria-label="Per-tool audit breakdown">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Tool-by-Tool Breakdown</h2>
      <div className="space-y-3">
        {results.map((result, i) => (
          <ToolResultCard key={i} result={result} />
        ))}
      </div>
    </section>
  );
}

function ToolResultCard({ result }) {
  const { toolName, currentSpend, monthlySavings, recommendation, reason, suggestedPlan, suggestedTool } = result;
  const recInfo = RECOMMENDATION_LABELS[recommendation] || RECOMMENDATION_LABELS.no_change;
  const Icon = RECOMMENDATION_ICONS[recommendation] || CheckCircle;
  const isOptimal = recommendation === 'no_change';
  const suggestedToolName = suggestedTool ? TOOLS.find((t) => t.id === suggestedTool)?.name : null;

  return (
    <div
      className={clsx(
        'card p-5 transition-shadow hover:shadow-md',
        !isOptimal && monthlySavings > 0 && 'border-l-4 border-l-brand-500'
      )}
      role="article"
      aria-label={`Audit result for ${toolName}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        {/* Left: tool info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={clsx('p-1.5 rounded-lg', isOptimal ? 'bg-success-50' : 'bg-brand-50')}>
              <Icon
                className={clsx('h-4 w-4', isOptimal ? 'text-success-600' : 'text-brand-600')}
                aria-hidden="true"
              />
            </div>
            <h3 className="font-semibold text-slate-900">{toolName}</h3>
            <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', recInfo.color)}>
              {recInfo.label}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{reason}</p>
          {suggestedToolName && (
            <p className="text-sm text-brand-600 font-medium mt-1">
              → Suggested: {suggestedToolName}
              {suggestedPlan && ` (${suggestedPlan} plan)`}
            </p>
          )}
          {!suggestedToolName && suggestedPlan && (
            <p className="text-sm text-brand-600 font-medium mt-1">
              → Switch to: {suggestedPlan} plan
            </p>
          )}
        </div>

        {/* Right: spend numbers */}
        <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-1 shrink-0">
          <div className="text-right">
            <p className="text-xs text-slate-400">Current</p>
            <p className="font-semibold text-slate-700">${currentSpend}/mo</p>
          </div>
          {monthlySavings > 0 && (
            <div className="text-right">
              <p className="text-xs text-slate-400">Savings</p>
              <p className="font-bold text-success-600 text-lg">
                -${monthlySavings.toLocaleString()}/mo
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
