// Pricing data — verified from official vendor pages
// Last verified: 2025-07 (update before submission)

const PRICING = {
  cursor: {
    name: 'Cursor',
    plans: {
      hobby: { label: 'Hobby', pricePerSeat: 0, maxSeats: 1 },
      pro: { label: 'Pro', pricePerSeat: 20, maxSeats: null },
      business: { label: 'Business', pricePerSeat: 40, maxSeats: null },
      enterprise: { label: 'Enterprise', pricePerSeat: null, maxSeats: null, custom: true },
    },
    category: 'coding',
    source: 'https://cursor.com/pricing',
  },
  github_copilot: {
    name: 'GitHub Copilot',
    plans: {
      individual: { label: 'Individual', pricePerSeat: 10, maxSeats: 1 },
      business: { label: 'Business', pricePerSeat: 19, maxSeats: null },
      enterprise: { label: 'Enterprise', pricePerSeat: 39, maxSeats: null },
    },
    category: 'coding',
    source: 'https://github.com/features/copilot#pricing',
  },
  claude: {
    name: 'Claude (Anthropic)',
    plans: {
      free: { label: 'Free', pricePerSeat: 0, maxSeats: 1 },
      pro: { label: 'Pro', pricePerSeat: 20, maxSeats: 1 },
      max: { label: 'Max', pricePerSeat: 100, maxSeats: 1 },
      team: { label: 'Team', pricePerSeat: 30, maxSeats: null, minSeats: 5 },
      enterprise: { label: 'Enterprise', pricePerSeat: null, custom: true },
      api: { label: 'API Direct', pricePerSeat: null, usageBased: true },
    },
    category: 'mixed',
    source: 'https://www.anthropic.com/pricing',
  },
  chatgpt: {
    name: 'ChatGPT (OpenAI)',
    plans: {
      free: { label: 'Free', pricePerSeat: 0, maxSeats: 1 },
      plus: { label: 'Plus', pricePerSeat: 20, maxSeats: 1 },
      team: { label: 'Team', pricePerSeat: 30, maxSeats: null, minSeats: 2 },
      enterprise: { label: 'Enterprise', pricePerSeat: null, custom: true },
      api: { label: 'API Direct', pricePerSeat: null, usageBased: true },
    },
    category: 'mixed',
    source: 'https://openai.com/chatgpt/pricing',
  },
  anthropic_api: {
    name: 'Anthropic API',
    plans: {
      api: { label: 'API Direct (Pay-as-you-go)', pricePerSeat: null, usageBased: true },
    },
    category: 'mixed',
    source: 'https://www.anthropic.com/pricing',
  },
  openai_api: {
    name: 'OpenAI API',
    plans: {
      api: { label: 'API Direct (Pay-as-you-go)', pricePerSeat: null, usageBased: true },
    },
    category: 'mixed',
    source: 'https://openai.com/api/pricing',
  },
  gemini: {
    name: 'Gemini (Google)',
    plans: {
      free: { label: 'Free', pricePerSeat: 0, maxSeats: 1 },
      advanced: { label: 'Advanced (Google One AI)', pricePerSeat: 19.99, maxSeats: 1 },
      business: { label: 'Business (Workspace)', pricePerSeat: 30, maxSeats: null },
      api: { label: 'API Direct', pricePerSeat: null, usageBased: true },
    },
    category: 'mixed',
    source: 'https://one.google.com/about/plans',
  },
  windsurf: {
    name: 'Windsurf (Codeium)',
    plans: {
      free: { label: 'Free', pricePerSeat: 0, maxSeats: 1 },
      pro: { label: 'Pro', pricePerSeat: 15, maxSeats: 1 },
      teams: { label: 'Teams', pricePerSeat: 35, maxSeats: null },
      enterprise: { label: 'Enterprise', pricePerSeat: null, custom: true },
    },
    category: 'coding',
    source: 'https://codeium.com/windsurf',
  },
};

// Average spend benchmarks per developer by use case
const BENCHMARKS = {
  coding: { avgPerDev: 45, p75PerDev: 70 },
  writing: { avgPerDev: 25, p75PerDev: 40 },
  data: { avgPerDev: 35, p75PerDev: 55 },
  research: { avgPerDev: 30, p75PerDev: 50 },
  mixed: { avgPerDev: 55, p75PerDev: 85 },
};

module.exports = { PRICING, BENCHMARKS };
