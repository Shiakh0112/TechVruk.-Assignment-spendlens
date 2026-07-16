import { TrendingDown, Calendar, Award } from 'lucide-react';
import clsx from 'clsx';

export default function SavingsHero({ totalMonthlySavings, totalAnnualSavings, savingsCategory, benchmarkComparison }) {
  const isOptimal = savingsCategory === 'low' && totalMonthlySavings < 100;
  const isHigh = savingsCategory === 'high';

  return (
    <div
      className={clsx(
        'rounded-2xl p-8 text-center',
        isOptimal
          ? 'bg-gradient-to-br from-success-50 to-emerald-50 border border-success-200'
          : isHigh
          ? 'bg-gradient-to-br from-brand-50 to-indigo-50 border border-brand-200'
          : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'
      )}
      role="region"
      aria-label="Savings summary"
    >
      {isOptimal ? (
        <>
          <div className="flex justify-center mb-4">
            <div className="bg-success-100 rounded-full p-3">
              <Award className="h-8 w-8 text-success-600" aria-hidden="true" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-success-700 mb-2">You're Spending Well 🎉</h2>
          <p className="text-success-600 text-lg">
            Your AI stack is well-optimized. We found less than $100/mo in potential savings.
          </p>
          <p className="text-slate-500 text-sm mt-3">
            Sign up below to get notified when new optimizations apply to your stack.
          </p>
        </>
      ) : (
        <>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wide mb-2">
            Potential Savings Identified
          </p>
          <div className="flex items-center justify-center gap-3 mb-2">
            <TrendingDown className="h-8 w-8 text-brand-600" aria-hidden="true" />
            <span className="text-6xl font-extrabold text-brand-600" aria-label={`$${totalMonthlySavings} per month`}>
              ${totalMonthlySavings.toLocaleString()}
            </span>
            <span className="text-2xl font-semibold text-slate-500">/mo</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <Calendar className="h-5 w-5" aria-hidden="true" />
            <span className="text-xl font-semibold">
              ${totalAnnualSavings.toLocaleString()} saved per year
            </span>
          </div>
        </>
      )}

      {/* Benchmark comparison */}
      {benchmarkComparison && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Benchmark: AI spend per developer</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="text-center">
              <p className="font-bold text-slate-800 text-lg">${benchmarkComparison.yourSpendPerDev}</p>
              <p className="text-slate-500">Your team</p>
            </div>
            <div className="text-slate-300 text-2xl">vs</div>
            <div className="text-center">
              <p className="font-bold text-slate-800 text-lg">${benchmarkComparison.avgSpendPerDev}</p>
              <p className="text-slate-500">Industry avg</p>
            </div>
          </div>
          <p className={clsx(
            'text-xs mt-2 font-medium',
            benchmarkComparison.status === 'below_average' ? 'text-success-600' :
            benchmarkComparison.status === 'above_average' ? 'text-amber-600' : 'text-red-600'
          )}>
            {benchmarkComparison.status === 'below_average' && '✓ Below industry average — great efficiency'}
            {benchmarkComparison.status === 'above_average' && '↑ Above industry average — room to optimize'}
            {benchmarkComparison.status === 'high' && '⚠ Significantly above average — action recommended'}
          </p>
        </div>
      )}
    </div>
  );
}
