# SpendLens — Complete Testing Guide

## Setup (pehle ye karo)

Backend server chal raha hona chahiye:
```
cd server
npm run dev
```
Server `http://localhost:5000` pe chalega.

Frontend bhi chala lo alag terminal mein:
```
cd client
npm run dev
```
Frontend `http://localhost:5173` pe chalega.

---

## PART 1 — Postman se Backend Test karo

### Postman Install
Download karo: https://www.postman.com/downloads/

---

### API 1 — Audit Create karo (POST /api/audit)

**Method:** POST  
**URL:** `http://localhost:5000/api/audit`  
**Headers:**
```
Content-Type: application/json
Origin: http://localhost:5173
```

**Body (raw → JSON):**
```json
{
  "tools": [
    {
      "toolId": "cursor",
      "toolName": "Cursor",
      "plan": "business",
      "monthlySpend": 80,
      "seats": 2
    },
    {
      "toolId": "github_copilot",
      "toolName": "GitHub Copilot",
      "plan": "business",
      "monthlySpend": 38,
      "seats": 2
    }
  ],
  "teamSize": 2,
  "useCase": "coding"
}
```

**Expected Response (201):**
```json
{
  "auditId": "some-mongodb-id",
  "totalCurrentSpend": 118,
  "totalMonthlySavings": ...,
  "totalAnnualSavings": ...,
  "savingsCategory": "medium",
  "toolResults": [...],
  "aiSummary": "...",
  "aiSummarySource": "claude" 
}
```

**Copy karo `auditId`** — aage kaam aayega.

---

### API 1B — Validation Test karo (galat data bhejo)

**Same URL, ye body bhejo:**
```json
{
  "tools": [],
  "teamSize": 2,
  "useCase": "coding"
}
```
**Expected:** `400` error — "At least one tool is required."

```json
{
  "tools": [{"toolId": "cursor", "plan": "pro", "monthlySpend": 20, "seats": 1}],
  "teamSize": 0,
  "useCase": "coding"
}
```
**Expected:** `400` error — "Team size must be between 1 and 100,000."

```json
{
  "tools": [{"toolId": "cursor", "plan": "pro", "monthlySpend": 20, "seats": 1}],
  "teamSize": 5,
  "useCase": "gaming"
}
```
**Expected:** `400` error — "Use case must be one of: coding, writing, data, research, mixed."

---

### API 2 — Audit Fetch karo (GET /api/audit/:id)

**Method:** GET  
**URL:** `http://localhost:5000/api/audit/YAHAN_AUDIT_ID_LAGAO`

**Expected Response (200):**
```json
{
  "auditId": "...",
  "tools": [...],
  "results": [...],
  "totalCurrentSpend": 118,
  "totalMonthlySavings": ...,
  "teamSize": 2,
  "useCase": "coding",
  "savingsCategory": "...",
  "aiSummary": "...",
  "createdAt": "..."
}
```

**Galat ID test:**  
URL: `http://localhost:5000/api/audit/000000000000000000000000`  
**Expected:** `404` — "Audit not found."

---

### API 3 — Lead Capture karo (POST /api/leads)

**Method:** POST  
**URL:** `http://localhost:5000/api/leads`  
**Headers:**
```
Content-Type: application/json
Origin: http://localhost:5173
```

**Body:**
```json
{
  "auditId": "YAHAN_AUDIT_ID_LAGAO",
  "email": "test@example.com",
  "companyName": "Test Company",
  "role": "CTO",
  "teamSize": 2
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "leadId": "..."
}
```

**Honeypot test (bot simulate karo):**
```json
{
  "auditId": "YAHAN_AUDIT_ID_LAGAO",
  "email": "bot@spam.com",
  "website": "http://spam.com"
}
```
**Expected:** `200` — `{ "success": true }` (silent reject — bot ko pata nahi chalta)

**Invalid email test:**
```json
{
  "auditId": "YAHAN_AUDIT_ID_LAGAO",
  "email": "not-an-email"
}
```
**Expected:** `400` — "Invalid email address."

**Duplicate lead test (same email + auditId dobara bhejo):**  
**Expected:** `200` — `{ "success": true, "message": "Already captured." }`

---

### API 4 — AI Summary Generate karo (POST /api/summary)

**Method:** POST  
**URL:** `http://localhost:5000/api/summary`  
**Headers:**
```
Content-Type: application/json
Origin: http://localhost:5173
```

**Body:**
```json
{
  "tools": ["Cursor", "GitHub Copilot"],
  "currentSpend": 118,
  "savings": 40,
  "teamSize": 2,
  "useCase": "coding"
}
```

**Expected Response (200):**
```json
{
  "summary": "Your 2-person coding team...",
  "source": "claude"
}
```
Note: Agar Anthropic API key kaam nahi kar rahi toh `"source": "template"` aayega — ye theek hai, fallback design mein hai.

---

### API 5 — OG Preview Route (GET /api/og/:id)

**Test 1 — Real user (redirect hona chahiye):**  
**Method:** GET  
**URL:** `http://localhost:5000/api/og/YAHAN_AUDIT_ID_LAGAO`  
**Expected:** `302` redirect to `http://localhost:5173/audit/ID`

**Test 2 — Bot crawler (HTML serve hona chahiye):**  
Headers mein add karo:
```
User-Agent: Twitterbot/1.0
```
**Expected:** `200` HTML response with OG meta tags visible in response body.

---

### API 6 — Health Check

**Method:** GET  
**URL:** `http://localhost:5000/health`  
**Expected:** `{ "status": "ok" }`

---

### API 7 — CSRF Protection Test

**Method:** POST  
**URL:** `http://localhost:5000/api/audit`  
**Headers:**
```
Content-Type: application/json
Origin: http://evil-site.com
```
**Body:** (koi bhi valid body)  
**Expected:** `403` — "Forbidden: invalid origin."

---

### API 8 — Rate Limit Test

Audit route pe 11 baar POST karo jaldi jaldi (loop mein).  
**Expected:** 11th request pe `429` — "Too many audits created. Please try again in an hour."

---

## PART 2 — Browser se Frontend Test karo

Browser mein kholo: `http://localhost:5173`

---

### Test F1 — Home Page Load

- [ ] Page load hoti hai bina error ke
- [ ] Hero section dikh raha hai
- [ ] "Start Your Free Audit" ya similar CTA button hai
- [ ] SpendForm dikh raha hai

---

### Test F2 — Form Fill karo

1. Tool dropdown se **Cursor** select karo
2. Plan: **Business** select karo
3. Monthly Spend: `80` likho
4. Seats: `2` likho
5. Team Size: `2` likho
6. Use Case: **Coding** select karo
7. **"Add Another Tool"** click karo
8. Doosra tool: **GitHub Copilot**, Plan: **Business**, Spend: `38`, Seats: `2`

---

### Test F3 — Form Persistence (localStorage)

1. Form fill karo (Test F2 wala)
2. Page refresh karo (F5)
3. **Expected:** Form data wapas aa jaye — fields khali nahi honge

---

### Test F4 — Audit Submit karo

1. Form fill karo
2. Submit button click karo
3. **Expected:**
   - Loading state dikhe
   - URL change ho jaye `/audit/some-id` pe
   - Audit result page load ho

---

### Test F5 — Audit Result Page

Audit page pe check karo:

- [ ] **Total savings** bada aur clear dikh raha hai (SavingsHero component)
- [ ] **Per-tool breakdown** cards dikh rahe hain
- [ ] Har tool card mein: current spend, recommendation, savings amount
- [ ] **AI Summary** card dikh raha hai (Claude badge ya Template badge)
- [ ] **Share button** dikh raha hai

---

### Test F6 — Lead Capture Modal

1. Audit page load hone ke **3 seconds baad** modal automatically aana chahiye
2. Modal mein:
   - [ ] Email field hai
   - [ ] Company name field hai (optional)
   - [ ] Role field hai (optional)
   - [ ] Submit button hai
   - [ ] **Hidden honeypot field nahi dikhna chahiye** (inspect element se check karo — `name="website"` wala input `aria-hidden="true"` hona chahiye)
3. Email bharo aur submit karo
4. **Expected:** Success message aaye
5. Page refresh karo — modal **dobara nahi aana chahiye** (sessionStorage se block hota hai)

---

### Test F7 — Share Button

1. Audit page pe Share button click karo
2. **Expected:** URL clipboard mein copy ho jaye
3. Copied URL ko browser mein open karo
4. **Expected:** Same audit result page khule (shareable URL kaam kare)

---

### Test F8 — High Savings CTA

Ek aisa audit banao jisme savings > $500/month ho:

Form mein ye bharo:
- Cursor Business: $200/mo, 5 seats
- GitHub Copilot Business: $95/mo, 5 seats  
- ChatGPT Team: $150/mo, 5 seats
- Claude Team: $150/mo, 5 seats
- Team size: 5

**Expected:** TechVruk consultation CTA prominently dikhe audit page pe

---

### Test F9 — Already Optimal Stack

Ek aisa audit banao jisme savings near zero ho:

Form mein ye bharo:
- Cursor Pro: $20/mo, 1 seat
- Team size: 1, Use case: coding

**Expected:** "You're spending well" ya similar message dikhe — fake savings manufacture nahi honi chahiye

---

### Test F10 — 404 Page

Browser mein kholo: `http://localhost:5173/audit/000000000000000000000000`  
**Expected:** 404 / "Audit not found" page dikhe

Browser mein kholo: `http://localhost:5173/kuch-bhi-random`  
**Expected:** NotFound page dikhe

---

### Test F11 — Mobile Responsive

Browser mein DevTools kholo (F12) → Toggle Device Toolbar (Ctrl+Shift+M)  
iPhone 12 ya similar select karo

Check karo:
- [ ] Form mobile pe theek dikh raha hai
- [ ] Audit result page mobile pe readable hai
- [ ] Buttons tap karne layak hain (chhote nahi)
- [ ] Horizontal scroll nahi hai

---

## PART 3 — Automated Tests (Jest)

Server folder mein run karo:

```bash
cd server
npm test
```

**Expected output:**
```
PASS src/__tests__/auditEngine.test.js
  Audit Engine
    checkPlanFit
      ✓ flags team plan for solo user
      ✓ ...
    findCheaperPlan
      ✓ ...
    ...

Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
```

Agar koi test fail ho toh error message padho — usually pricing data ya logic mismatch hota hai.

---

## PART 4 — Common Errors aur Fix

| Error | Cause | Fix |
|-------|-------|-----|
| `MongoServerError: bad auth` | Wrong MongoDB password | `.env` mein sahi password lagao |
| `Cannot read properties of undefined ('api-key')` | Brevo SDK issue | Already fixed — lazy init hai |
| `Network Error` Postman mein | Server nahi chal raha | `npm run dev` server folder mein |
| `CORS error` browser mein | Origin mismatch | `CLIENT_URL` `.env` mein check karo |
| `403 Forbidden` Postman mein | Origin header missing | Header mein `Origin: http://localhost:5173` add karo |
| `429 Too Many Requests` | Rate limit hit | 1 ghante baad try karo ya server restart karo |
| AI Summary `source: "template"` | Anthropic API key invalid | Normal hai dev mein — fallback kaam kar raha hai |
