import { useState } from 'react';
import { X, Mail, Building2, User, Loader2, Bell } from 'lucide-react';
import { captureLead } from '../lib/api';
import toast from 'react-hot-toast';

export default function LeadCapture({ auditId, savingsCategory, totalMonthlySavings, onClose, onSuccess }) {
  const [form, setForm] = useState({ email: '', companyName: '', role: '', teamSize: '', website: '' });
  const [loading, setLoading] = useState(false);
  const isHighSavings = savingsCategory === 'high';
  const isOptimal = savingsCategory === 'low' && totalMonthlySavings < 100;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await captureLead({ auditId, ...form });
      toast.success('Report sent! Check your inbox.');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-capture-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 id="lead-capture-title" className="text-xl font-bold text-slate-900">
              {isOptimal ? 'Stay Updated' : 'Get Your Full Report'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {isOptimal
                ? "We'll notify you when new optimizations apply to your stack."
                : `We'll email you the full audit${isHighSavings ? ' + connect you with a TechVruk expert' : ''}.`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* High savings CTA */}
        {isHighSavings && (
          <div className="mx-6 mb-4 bg-brand-50 border border-brand-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-brand-700">
              💡 You qualify for a free TechVruk consultation
            </p>
            <p className="text-xs text-brand-600 mt-1">
              With ${totalMonthlySavings}/mo in identified savings, our experts can help you implement these changes and find more.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Honeypot — hidden from humans, bots fill it */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            tabIndex={-1}
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
            autoComplete="off"
          />

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Work Email <span className="text-red-500" aria-label="required">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input-field pl-9"
                placeholder="you@company.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">
                Company <span className="text-slate-400 text-xs">(optional)</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={handleChange}
                  className="input-field pl-9"
                  placeholder="Acme Inc."
                  autoComplete="organization"
                />
              </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
                Role <span className="text-slate-400 text-xs">(optional)</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
                <input
                  id="role"
                  name="role"
                  type="text"
                  value={form.role}
                  onChange={handleChange}
                  className="input-field pl-9"
                  placeholder="CTO"
                  autoComplete="organization-title"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending...</>
            ) : isOptimal ? (
              <><Bell className="h-4 w-4" aria-hidden="true" /> Notify Me</>
            ) : (
              <><Mail className="h-4 w-4" aria-hidden="true" /> Send My Report</>
            )}
          </button>

          <p className="text-xs text-slate-400 text-center">
            No spam. Unsubscribe anytime. We never sell your data.
          </p>
        </form>
      </div>
    </div>
  );
}
