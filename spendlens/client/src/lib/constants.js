export const TOOLS = [
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'coding',
    plans: [
      { id: 'hobby', label: 'Hobby (Free)', price: 0 },
      { id: 'pro', label: 'Pro — $20/seat/mo', price: 20 },
      { id: 'business', label: 'Business — $40/seat/mo', price: 40 },
      { id: 'enterprise', label: 'Enterprise (Custom)', price: null },
    ],
  },
  {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    category: 'coding',
    plans: [
      { id: 'individual', label: 'Individual — $10/seat/mo', price: 10 },
      { id: 'business', label: 'Business — $19/seat/mo', price: 19 },
      { id: 'enterprise', label: 'Enterprise — $39/seat/mo', price: 39 },
    ],
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    category: 'mixed',
    plans: [
      { id: 'free', label: 'Free', price: 0 },
      { id: 'pro', label: 'Pro — $20/mo', price: 20 },
      { id: 'max', label: 'Max — $100/mo', price: 100 },
      { id: 'team', label: 'Team — $30/seat/mo', price: 30 },
      { id: 'enterprise', label: 'Enterprise (Custom)', price: null },
      { id: 'api', label: 'API Direct (Usage-based)', price: null },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT (OpenAI)',
    category: 'mixed',
    plans: [
      { id: 'free', label: 'Free', price: 0 },
      { id: 'plus', label: 'Plus — $20/mo', price: 20 },
      { id: 'team', label: 'Team — $30/seat/mo', price: 30 },
      { id: 'enterprise', label: 'Enterprise (Custom)', price: null },
      { id: 'api', label: 'API Direct (Usage-based)', price: null },
    ],
  },
  {
    id: 'anthropic_api',
    name: 'Anthropic API',
    category: 'mixed',
    plans: [{ id: 'api', label: 'API Direct (Pay-as-you-go)', price: null }],
  },
  {
    id: 'openai_api',
    name: 'OpenAI API',
    category: 'mixed',
    plans: [{ id: 'api', label: 'API Direct (Pay-as-you-go)', price: null }],
  },
  {
    id: 'gemini',
    name: 'Gemini (Google)',
    category: 'mixed',
    plans: [
      { id: 'free', label: 'Free', price: 0 },
      { id: 'advanced', label: 'Advanced — $19.99/mo', price: 19.99 },
      { id: 'business', label: 'Business (Workspace) — $30/seat/mo', price: 30 },
      { id: 'api', label: 'API Direct (Usage-based)', price: null },
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf (Codeium)',
    category: 'coding',
    plans: [
      { id: 'free', label: 'Free', price: 0 },
      { id: 'pro', label: 'Pro — $15/seat/mo', price: 15 },
      { id: 'teams', label: 'Teams — $35/seat/mo', price: 35 },
      { id: 'enterprise', label: 'Enterprise (Custom)', price: null },
    ],
  },
];

export const USE_CASES = [
  { id: 'coding', label: 'Coding / Engineering' },
  { id: 'writing', label: 'Writing / Content' },
  { id: 'data', label: 'Data Analysis' },
  { id: 'research', label: 'Research' },
  { id: 'mixed', label: 'Mixed / General' },
];

export const RECOMMENDATION_LABELS = {
  no_change: { label: 'Optimal ✓', color: 'text-success-600 bg-success-50' },
  downgrade_plan: { label: 'Downgrade Plan', color: 'text-amber-700 bg-amber-50' },
  switch_tool: { label: 'Switch Tool', color: 'text-blue-700 bg-blue-50' },
  consolidate: { label: 'Consolidate', color: 'text-purple-700 bg-purple-50' },
  use_credits: { label: 'Use Credits', color: 'text-orange-700 bg-orange-50' },
};
