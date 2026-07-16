# ARCHITECTURE.md

## System Diagram

```mermaid
graph TD
    A[User Browser] -->|Fills spend form| B[React Frontend\nVite + Tailwind]
    B -->|POST /api/audit| C[Express API\nNode.js]
    C -->|runAudit| D[Audit Engine\nauditEngine.js]
    D -->|Returns results| C
    C -->|generateAISummary| E[Anthropic Claude API]
    E -->|100-word summary| C
    E -->|API failure| F[Fallback Template]
    F --> C
    C -->|Save audit| G[(MongoDB Atlas)]
    C -->|Returns auditId + results| B
    B -->|Navigate to| H[/audit/:id page]
    H -->|GET /api/audit/:id| C
    C -->|Fetch public audit| G
    G -->|Audit data no PII| C
    C --> H
    H -->|User submits email| I[POST /api/leads]
    I -->|Store lead| G
    I -->|Send email| J[Resend API]
    J -->|Confirmation email| K[User Inbox]
```

---

## Data Flow: Input → Audit Result

1. **User fills form** — tool name, plan, monthly spend, seats, team size, use case. State persisted in `localStorage`.

2. **POST /api/audit** — frontend sends JSON payload to Express.

3. **Audit Engine** (`auditEngine.js`) — pure function, no DB calls:
   - For each tool: runs 4 rule checks in order (plan fit → cheaper plan → alternative tool → credits)
   - Returns first matching recommendation per tool
   - Calculates totals and benchmark comparison

4. **Anthropic API call** — sends tool names, spend, savings, team size, use case to Claude. Falls back to template if API fails (429, 500, timeout).

5. **MongoDB save** — audit document stored with UUID. No PII at this stage.

6. **Response** — `auditId` + full results returned to frontend. Frontend navigates to `/audit/:id`.

7. **Shareable URL** — `/audit/:id` fetches audit from DB. PII (email, company) never stored in audit document — only in separate `leads` collection.

8. **Lead capture** — modal appears 3s after audit loads. Email stored in `leads` collection with reference to `auditId`. Resend sends confirmation email.

---

## Stack Choice

| Layer | Choice | Justification |
|---|---|---|
| Frontend | React 18 + Vite | Fast HMR, JSX, component model. Vite is faster than CRA. |
| Language | JavaScript (not TypeScript) | TypeScript is strongly preferred per assignment. Chose JS to move faster given time constraints. In production, typed interfaces for AuditResult and ToolInput would prevent bugs. |
| Styling | Tailwind CSS | Utility-first, no pre-built templates, accessible by default with proper HTML |
| Routing | React Router v6 | Client-side routing for SPA, clean `/audit/:id` URLs |
| Backend | Node.js + Express | Lightweight, fast to write, same language as frontend |
| Database | MongoDB Atlas | Flexible JSON schema matches audit result structure exactly |
| AI | Anthropic Claude | Required by assignment. claude-3-5-haiku is fast and cheap |
| Email | Resend | Simple API, 3k free emails/mo, reliable deliverability |
| Deployment | Render (backend) + Netlify (frontend) | Free tiers, easy setup, no cold start issues on paid tier |

---

## What I'd Change at 10k Audits/Day

1. **Add Redis caching** — Cache audit results by `auditId`. Most shareable URL views are reads, not writes. Redis TTL of 24h would cut DB reads by ~80%.

2. **Queue AI summary generation** — Move Anthropic API call to a background job (BullMQ + Redis). Return audit immediately, update summary async. Prevents slow API calls from blocking the response.

3. **MongoDB indexes** — Add index on `createdAt` for analytics queries. Add TTL index to auto-delete audits older than 90 days.

4. **Rate limiting with Redis** — Replace in-memory rate limiter with Redis-backed one (ioredis + rate-limit-redis) so limits work across multiple server instances.

5. **CDN for static assets** — Put Cloudflare in front of the frontend. OG image generation via Cloudflare Workers for dynamic per-audit preview images.

6. **Horizontal scaling** — Express is stateless, so adding more Render instances behind a load balancer is straightforward. MongoDB Atlas scales vertically first, then sharding if needed.
