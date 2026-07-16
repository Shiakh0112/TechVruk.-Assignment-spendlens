import { useState } from 'react';
import { Plus, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TOOLS, USE_CASES } from '../lib/constants';
import { createAudit } from '../lib/api';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const DEFAULT_TOOL_ENTRY = { toolId: '', planId: '', monthlySpend: '', seats: 1 };

export default function SpendForm({ onAuditComplete }) {
  const [toolEntries, setToolEntries] = useLocalStorage('spendlens_tools', [{ ...DEFAULT_TOOL_ENTRY }]);
  const [teamSize, setTeamSize] = useLocalStorage('spendlens_teamsize', 1);
  const [useCase, setUseCase] = useLocalStorage('spendlens_usecase', '');
  const [loading, setLoading] = useState(false);

  const addTool = () => setToolEntries([...toolEntries, { ...DEFAULT_TOOL_ENTRY }]);

  const removeTool = (index) => {
    if (toolEntries.length === 1) return;
    setToolEntries(toolEntries.filter((_, i) => i !== index));
  };

  const updateEntry = (index, field, value) => {
    const updated = toolEntries.map((entry, i) => {
      if (i !== index) return entry;
      const newEntry = { ...entry, [field]: value };
      // Reset plan when tool changes
      if (field === 'toolId') newEntry.planId = '';
      return newEntry;
    });
    setToolEntries(updated);
  };

  const getPlansForTool = (toolId) => TOOLS.find((t) => t.id === toolId)?.plans || [];

  const getToolName = (toolId) => TOOLS.find((t) => t.id === toolId)?.name || toolId;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const validEntries = toolEntries.filter((e) => e.toolId && e.planId);
    if (validEntries.length === 0) {
      toast.error('Please add at least one AI tool.');
      return;
    }
    if (!useCase) {
      toast.error('Please select your primary use case.');
      return;
    }
    for (const entry of validEntries) {
      if (entry.monthlySpend === '' || entry.monthlySpend < 0) {
        toast.error(`Please enter monthly spend for ${getToolName(entry.toolId)}.`);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        tools: validEntries.map((e) => ({
          toolId: e.toolId,
          toolName: getToolName(e.toolId),
          planId: e.planId,
          monthlySpend: parseFloat(e.monthlySpend) || 0,
          seats: parseInt(e.seats) || 1,
        })),
        teamSize: parseInt(teamSize) || 1,
        useCase,
      };

      const { data } = await createAudit(payload);
      onAuditComplete(data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to run audit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="AI spend audit form">
      {/* Team context */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="teamSize" className="block text-sm font-medium text-slate-700 mb-1">
              Team Size
            </label>
            <input
              id="teamSize"
              type="number"
              min="1"
              max="10000"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="input-field"
              placeholder="e.g. 5"
              required
              aria-describedby="teamSizeHelp"
            />
            <p id="teamSizeHelp" className="text-xs text-slate-500 mt-1">Total people on your team</p>
          </div>
          <div>
            <label htmlFor="useCase" className="block text-sm font-medium text-slate-700 mb-1">
              Primary Use Case
            </label>
            <div className="relative">
              <select
                id="useCase"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="input-field appearance-none pr-8"
                required
              >
                <option value="">Select use case...</option>
                {USE_CASES.map((uc) => (
                  <option key={uc.id} value={uc.id}>{uc.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* Tool entries */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Your AI Tools</h2>
        <div className="space-y-4">
          {toolEntries.map((entry, index) => (
            <ToolRow
              key={index}
              index={index}
              entry={entry}
              onUpdate={updateEntry}
              onRemove={removeTool}
              canRemove={toolEntries.length > 1}
              plans={getPlansForTool(entry.toolId)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addTool}
          className="mt-4 flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
          aria-label="Add another AI tool"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add another tool
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
        aria-busy={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Running your audit...
          </>
        ) : (
          'Run My Free Audit →'
        )}
      </button>
    </form>
  );
}

function ToolRow({ index, entry, onUpdate, onRemove, canRemove, plans }) {
  return (
    <div className="grid grid-cols-12 gap-3 items-start p-4 bg-slate-50 rounded-lg border border-slate-100">
      {/* Tool selector */}
      <div className="col-span-12 sm:col-span-4">
        <label htmlFor={`tool-${index}`} className="block text-xs font-medium text-slate-600 mb-1">
          Tool
        </label>
        <div className="relative">
          <select
            id={`tool-${index}`}
            value={entry.toolId}
            onChange={(e) => onUpdate(index, 'toolId', e.target.value)}
            className="input-field appearance-none pr-8"
            required
            aria-label={`Select AI tool ${index + 1}`}
          >
            <option value="">Select tool...</option>
            {TOOLS.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      {/* Plan selector */}
      <div className="col-span-12 sm:col-span-3">
        <label htmlFor={`plan-${index}`} className="block text-xs font-medium text-slate-600 mb-1">
          Plan
        </label>
        <div className="relative">
          <select
            id={`plan-${index}`}
            value={entry.planId}
            onChange={(e) => onUpdate(index, 'planId', e.target.value)}
            className="input-field appearance-none pr-8"
            required
            disabled={!entry.toolId}
            aria-label={`Select plan for tool ${index + 1}`}
          >
            <option value="">Select plan...</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      {/* Monthly spend */}
      <div className="col-span-6 sm:col-span-2">
        <label htmlFor={`spend-${index}`} className="block text-xs font-medium text-slate-600 mb-1">
          Monthly Spend ($)
        </label>
        <input
          id={`spend-${index}`}
          type="number"
          min="0"
          step="0.01"
          value={entry.monthlySpend}
          onChange={(e) => onUpdate(index, 'monthlySpend', e.target.value)}
          className="input-field"
          placeholder="0"
          required
          aria-label={`Monthly spend for tool ${index + 1}`}
        />
      </div>

      {/* Seats */}
      <div className="col-span-5 sm:col-span-2">
        <label htmlFor={`seats-${index}`} className="block text-xs font-medium text-slate-600 mb-1">
          Seats
        </label>
        <input
          id={`seats-${index}`}
          type="number"
          min="1"
          value={entry.seats}
          onChange={(e) => onUpdate(index, 'seats', e.target.value)}
          className="input-field"
          placeholder="1"
          required
          aria-label={`Number of seats for tool ${index + 1}`}
        />
      </div>

      {/* Remove button */}
      <div className="col-span-1 flex items-end pb-1">
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
          className={clsx(
            'p-2 rounded-lg transition-colors',
            canRemove
              ? 'text-slate-400 hover:text-red-500 hover:bg-red-50'
              : 'text-slate-200 cursor-not-allowed'
          )}
          aria-label={`Remove tool ${index + 1}`}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
