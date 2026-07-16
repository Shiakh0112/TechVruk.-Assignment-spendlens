import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TrendingDown, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { getAudit } from '../lib/api';
import SavingsHero from '../components/SavingsHero';
import AuditResult from '../components/AuditResult';
import AISummaryCard from '../components/AISummaryCard';
import TechVrukCTA from '../components/TechVrukCTA';
import LeadCapture from '../components/LeadCapture';
import ShareButton from '../components/ShareButton';

export default function AuditPage() {
  const { id } = useParams();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  useEffect(() => {
    fetchAudit();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Update page OG meta tags dynamically for shareable URL
  useEffect(() => {
    if (!audit) return;
    const savings = audit.totalMonthlySavings;
    const title = savings > 0
      ? `AI Spend Audit — $${savings}/mo savings found | SpendLens`
      : 'AI Spend Audit — Optimized Stack | SpendLens';
    const desc = savings > 0
      ? `This team could save $${savings}/month ($${audit.totalAnnualSavings}/year) on AI tools. See the full breakdown.`
      : 'This team is already spending efficiently on AI tools. See the full audit.';

    document.title = title;
    updateMeta('og:title', title);
    updateMeta('og:description', desc);
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', desc);
    updateMeta('og:url', window.location.href);
  }, [audit]);

  const fetchAudit = async () => {
    try {
      const { data } = await getAudit(id);
      setAudit(data);
      // Show lead capture after 3 seconds — only for first-time visitors
      const alreadyCaptured = sessionStorage.getItem(`lead_captured_${id}`);
      if (!alreadyCaptured) {
        setTimeout(() => setShowLeadCapture(true), 3000);
      }
    } catch (err) {
      setError(err.response?.status === 404 ? 'Audit not found.' : 'Failed to load audit.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Loading audit">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600 mx-auto mb-4" aria-hidden="true" />
          <p className="text-slate-500">Loading your audit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" role="alert">
        <div className="text-center max-w-sm">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Audit Not Found</h1>
          <p className="text-slate-500 mb-6">{error}</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Run a New Audit
          </Link>
        </div>
      </div>
    );
  }

  const isHighSavings = audit.savingsCategory === 'high';
  const isOptimal = audit.savingsCategory === 'low' && audit.totalMonthlySavings < 100;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40" role="navigation" aria-label="Main navigation">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" aria-label="SpendLens home">
            <div className="bg-brand-600 rounded-lg p-1.5">
              <TrendingDown className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-slate-900 text-lg">SpendLens</span>
          </Link>
          <Link to="/" className="btn-secondary text-sm py-2">
            Run New Audit
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Your AI Spend Audit</h1>
          <p className="text-slate-500 text-sm">
            {audit.useCase} · {audit.teamSize} person team ·{' '}
            {new Date(audit.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Savings hero — the big number */}
        <SavingsHero
          totalMonthlySavings={audit.totalMonthlySavings}
          totalAnnualSavings={audit.totalAnnualSavings}
          savingsCategory={audit.savingsCategory}
          benchmarkComparison={audit.benchmarkComparison}
        />

        {/* TechVruk CTA for high savings */}
        {isHighSavings && (
          <TechVrukCTA totalMonthlySavings={audit.totalMonthlySavings} />
        )}

        {/* AI Summary */}
        {audit.aiSummary && (
          <AISummaryCard summary={audit.aiSummary} source={audit.aiSummarySource} />
        )}

        {/* Per-tool breakdown */}
        <AuditResult results={audit.results} />

        {/* Optimal spend — notify CTA */}
        {isOptimal && !leadCaptured && (
          <div className="card p-6 text-center">
            <h3 className="font-semibold text-slate-900 mb-2">Stay ahead of AI pricing changes</h3>
            <p className="text-slate-500 text-sm mb-4">
              Your stack is well-optimized today. We'll notify you when new savings opportunities appear.
            </p>
            <button
              onClick={() => setShowLeadCapture(true)}
              className="btn-primary"
            >
              Notify Me of New Optimizations
            </button>
          </div>
        )}

        {/* Get report CTA */}
        {!isOptimal && !leadCaptured && (
          <div className="card p-6 text-center">
            <h3 className="font-semibold text-slate-900 mb-2">Get this report in your inbox</h3>
            <p className="text-slate-500 text-sm mb-4">
              We'll email you the full breakdown{isHighSavings ? ' and connect you with a TechVruk expert' : ''}.
            </p>
            <button
              onClick={() => setShowLeadCapture(true)}
              className="btn-primary"
            >
              {isHighSavings ? 'Get Report + Free Consultation' : 'Email Me This Report'}
            </button>
          </div>
        )}

        {leadCaptured && (
          <div className="bg-success-50 border border-success-200 rounded-xl p-4 text-center">
            <p className="text-success-700 font-medium">✓ Report sent! Check your inbox.</p>
          </div>
        )}

        {/* Share section */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-1">Share this audit</h3>
          <p className="text-slate-500 text-sm mb-4">
            Your email and company name are not included in the public link.
          </p>
          <ShareButton auditId={audit.auditId} />
        </div>

        {/* Run new audit */}
        <div className="text-center pb-8">
          <Link to="/" className="text-brand-600 hover:text-brand-700 text-sm font-medium">
            ← Run a new audit
          </Link>
        </div>
      </main>

      {/* Lead capture modal */}
      {showLeadCapture && !leadCaptured && (
        <LeadCapture
          auditId={audit.auditId}
          savingsCategory={audit.savingsCategory}
          totalMonthlySavings={audit.totalMonthlySavings}
          onClose={() => setShowLeadCapture(false)}
          onSuccess={() => {
            setLeadCaptured(true);
            setShowLeadCapture(false);
            sessionStorage.setItem(`lead_captured_${audit.auditId}`, '1');
          }}
        />
      )}
    </div>
  );
}

function updateMeta(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
