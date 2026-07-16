import { Sparkles, AlertCircle } from 'lucide-react';

export default function AISummaryCard({ summary, source }) {
  return (
    <div className="card p-6" role="region" aria-label="AI-generated audit summary">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-brand-500" aria-hidden="true" />
        <h3 className="font-semibold text-slate-900">AI Summary</h3>
        {source === 'fallback' && (
          <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            Template
          </span>
        )}
        {source === 'ai' && (
          <span className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
            Claude AI
          </span>
        )}
      </div>
      <p className="text-slate-700 leading-relaxed text-sm">{summary}</p>
    </div>
  );
}
