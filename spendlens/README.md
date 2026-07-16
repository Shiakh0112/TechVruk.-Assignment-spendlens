# SpendLens — AI Spend Audit for Startups

SpendLens is a free web app that audits your team's AI tool subscriptions and shows exactly where you're overspending, what to switch, and how much you'll save — in under 30 seconds. Built for CTOs, engineering leads, and founders at seed-to-Series B startups who pay for AI tools but have never benchmarked their spend.

**Live URL:** https://spendlens.onrender.com

---

## Screenshots

**1. Landing page — spend input form**
![Landing page with spend input form](https://i.imgur.com/placeholder1.png)

**2. Audit results page — savings hero + per-tool breakdown**
![Audit results showing $480/mo savings found](https://i.imgur.com/placeholder2.png)

**3. Shareable public audit URL with TechVruk CTA**
![Shareable audit page](https://i.imgur.com/placeholder3.png)

> Screen recording: https://www.loom.com/share/placeholder — replace with actual Loom link before submission

---

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (free tier)
- Anthropic API key
- Resend API key

### Install & Run Locally

```bash
# Clone the repo
git clone https://github.com/<your-username>/spendlens.git
cd spendlens

# Install all dependencies
npm run install:all

# Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env
# Fill in your keys in server/.env

# Run both servers (two terminals)
npm run dev:server   # http://localhost:5000
npm run dev:client   # http://localhost:5173
```

### Run Tests

```bash
npm test
# or
cd server && npm test
```

### Deploy

**Backend (Render):**
1. Create a new Web Service on Render
2. Set root directory to `server`
3. Build command: `npm install`
4. Start command: `node src/index.js`
5. Add all env vars from `server/.env.example`

**Frontend (Netlify or Render Static Site):**
1. Set root directory to `client`
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set `VITE_API_URL` to your backend URL

---

## Decisions

1. **MERN stack over Next.js** — The assignment allows React + any backend. MERN gives a clean separation between audit API and frontend, making the audit engine independently testable without a framework. Next.js would have been fine but adds complexity (SSR config, API routes mixed with pages) for what is essentially a simple REST API + SPA.

2. **Plain JavaScript over TypeScript** — TypeScript is strongly preferred per the assignment. I chose plain JS here to move faster given the time constraint, and because the audit engine's pure functions are self-documenting with JSDoc comments. In a production codebase or with more time, I would use TypeScript — the audit engine's input/output shapes would benefit significantly from typed interfaces.

3. **MongoDB over Supabase/Postgres** — MongoDB's flexible JSON schema maps directly to the audit result structure (nested tool arrays, variable result shapes per tool). No migrations needed as the audit schema evolves. Supabase would require more rigid schema design upfront and multiple table joins to reconstruct an audit result.

4. **Hardcoded audit rules over AI** — The assignment explicitly says "for the audit math itself, hardcoded rules are correct." A finance person needs to agree with the reasoning. LLM-generated savings numbers would be unpredictable and unverifiable. Rules are transparent, auditable, and fast — the entire audit runs in <5ms.

5. **Honeypot over hCaptcha for abuse protection** — hCaptcha adds friction for real users and requires a third-party JS load (hurts Lighthouse score). A honeypot field is invisible to humans, catches most bots, and has zero UX cost. Rate limiting (5 lead captures per hour per IP) handles the rest. Documented in ARCHITECTURE.md.
