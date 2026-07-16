import { Zap, ArrowRight } from 'lucide-react';

export default function TechVrukCTA({ totalMonthlySavings }) {
  return (
    <div
      className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-2xl p-6 text-white"
      role="complementary"
      aria-label="TechVruk consultation offer"
    >
      <div className="flex items-start gap-4">
        <div className="bg-white/20 rounded-xl p-3 shrink-0">
          <Zap className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">
            Capture all ${totalMonthlySavings.toLocaleString()}/mo — with expert help
          </h3>
          <p className="text-brand-100 text-sm mb-4">
            TechVruk's AI infrastructure team can implement these optimizations for you, negotiate enterprise contracts, and find savings our audit engine doesn't surface. Free 30-minute consultation for audits over $500/mo.
          </p>
          <a
            href="https://techvruk.com/consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-50 transition-colors text-sm"
            aria-label="Book free TechVruk consultation (opens in new tab)"
          >
            Book Free Consultation
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
