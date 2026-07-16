# METRICS.md

## North Star Metric

**Qualified leads generated per week** — defined as email captures from audits showing ≥$200/mo in savings.

### Why This Is the North Star

SpendLens is a B2B lead generation tool for TechVruk. The business outcome is consultation bookings and client conversions. "Qualified leads" (high-savings audits with email capture) is the metric that most directly predicts revenue. 

DAU is wrong — people use this tool once or twice, not daily. Total audits is wrong — a low-savings audit with no email capture has near-zero business value. Qualified leads is the metric that connects product usage to business outcome.

---

## 3 Input Metrics That Drive the North Star

### 1. Audit Completion Rate
**Definition:** % of visitors who complete an audit (submit the form)
**Target:** ≥25%
**Why it matters:** If people land on the page but don't complete the form, the tool isn't compelling enough or the form is too long. This is the top-of-funnel conversion.

### 2. High-Savings Audit Rate
**Definition:** % of completed audits that show ≥$200/mo in savings
**Target:** ≥40%
**Why it matters:** Only high-savings audits generate qualified leads. If this is low, either the audit engine is too conservative or the user base is already well-optimized (wrong audience).

### 3. Email Capture Rate (on high-savings audits)
**Definition:** % of high-savings audit viewers who submit their email
**Target:** ≥35%
**Why it matters:** This is the conversion from "saw value" to "gave us contact info." If this is low, the lead capture modal timing, copy, or offer is wrong.

---

## What to Instrument First

1. **Audit form submission** — track `audit_submitted` event with `tool_count`, `use_case`, `team_size`
2. **Audit result view** — track `audit_viewed` with `savings_category`, `total_monthly_savings`
3. **Lead capture modal shown** — track `lead_modal_shown` with `savings_category`
4. **Lead capture submitted** — track `lead_captured` with `savings_category`, `has_company_name`
5. **Share button clicked** — track `audit_shared` with `savings_category`
6. **Consultation CTA clicked** — track `consultation_cta_clicked` with `total_monthly_savings`

All events should include `audit_id` for funnel analysis.

---

## What Number Triggers a Pivot Decision

**If audit completion rate drops below 15% for 2 consecutive weeks:**
The form is too long or the value proposition isn't clear enough on the landing page. Pivot: shorten the form to 3 fields (tool, plan, spend) and add a "see sample audit" link before asking for input.

**If high-savings audit rate drops below 20%:**
Either the wrong audience is finding the tool (people already on optimal plans) or the audit engine is too conservative. Pivot: review the rule thresholds and check if the HN/Reddit audience skews toward more sophisticated buyers.

**If email capture rate on high-savings audits drops below 20%:**
The lead capture offer isn't compelling enough. Pivot: test different modal copy — "Get this report as a PDF" vs "Book a free consultation" vs "Email me this breakdown."

**The single number that triggers a full strategy review:**
If qualified leads per week stays below 5 for 4 consecutive weeks after launch, the tool is not finding product-market fit and the GTM strategy needs to change.
