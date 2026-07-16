import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, TrendingDown, Users } from 'lucide-react';
import SpendForm from '../components/SpendForm';

const SOCIAL_PROOF = [
  { stat: '2,400+', label: 'audits run' },
  { stat: '$180K+', label: 'savings identified' },
  { stat: '8 tools', label: 'supported' },
];

const HOW_IT_WORKS = [
  { icon: Users, title: 'Enter your tools', desc: 'Add each AI subscription — tool, plan, seats, and monthly spend.' },
  { icon: TrendingDown, title: 'Get instant audit', desc: 'Our engine checks every tool against current pricing and your team size.' },
  { icon: Zap, title: 'See your savings', desc: 'Get a per-tool breakdown with specific, defensible recommendations.' },
];

export default function HomePage() {
  const navigate = useNavigate();

  const handleAuditComplete = (data) => {
    // Navigate to the shareable audit page
    navigate(`/audit/${data.auditId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40" role="navigation" aria-label="Main navigation">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 rounded-lg p-1.5">
              <TrendingDown className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-slate-900 text-lg">SpendLens</span>
          </div>
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Free · No login required</span>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center" aria-labelledby="hero-heading">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-brand-100">
            <Zap className="h-4 w-4" aria-hidden="true" />
            Free AI spend audit — results in 30 seconds
          </div>
          <h1 id="hero-heading" className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Stop overpaying for<br />
            <span className="text-brand-600">AI tools</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8">
            Enter your AI subscriptions. Get an instant audit showing exactly where you're overspending, what to switch, and how much you'll save.
          </p>

          {/* Social proof — mocked */}
          <div className="flex items-center justify-center gap-8 mb-12" role="list" aria-label="Social proof statistics">
            {SOCIAL_PROOF.map((item) => (
              <div key={item.label} className="text-center" role="listitem">
                <p className="text-2xl font-bold text-slate-900">{item.stat}</p>
                <p className="text-sm text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white border-y border-slate-100 py-12 mb-12" aria-labelledby="how-it-works-heading">
          <div className="max-w-5xl mx-auto px-4">
            <h2 id="how-it-works-heading" className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
              How it works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="bg-brand-50 rounded-xl p-3">
                      <step.icon className="h-6 w-6 text-brand-600" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="max-w-3xl mx-auto px-4 pb-20" aria-labelledby="form-heading">
          <div className="text-center mb-8">
            <h2 id="form-heading" className="text-2xl font-bold text-slate-900 mb-2">
              Audit your AI spend — free
            </h2>
            <p className="text-slate-500">No login. No credit card. Results in seconds.</p>
          </div>
          <SpendForm onAuditComplete={handleAuditComplete} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center" role="contentinfo">
        <p className="text-sm text-slate-400">
          Built by{' '}
          <a href="https://techvruk.com" className="text-brand-600 hover:underline" target="_blank" rel="noopener noreferrer">
            TechVruk
          </a>
          {' '}· Pricing data verified weekly · No login required
        </p>
      </footer>
    </div>
  );
}
