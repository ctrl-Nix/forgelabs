# ⚒ ForgeLabs — Modular AI Product Engineering Suite

> An agentic platform for product research, validation, and code intelligence. Each tool runs as an autonomous multi-step pipeline — no tab-switching, no manual chaining.

**GitHub:** [github.com/ctrl-Nix/forgelabs](https://github.com/ctrl-Nix/forgelabs)

---

## What is ForgeLabs?

ForgeLabs is a modular AI orchestration platform built for engineers and indie founders. It connects specialized AI agents into autonomous pipelines — you provide the input once, and each tool chains its outputs through multiple reasoning steps to deliver structured, actionable results.

Built with **Next.js 16**, **Vanilla CSS**, and **Framer Motion**. Uses **Gemini 2.5 Flash** with a BYOK (Bring Your Own Key) model for privacy and cost control.

---

## Active Modules

### 1. ForgeInsight — Product Research Pipeline
**3-step autonomous pipeline: Market Analysis → MoSCoW PRD → 30-Day Launch Plan**

Input a SaaS idea once. The pipeline runs all three steps automatically, passing output from each step as context into the next.

- **Step 1 — Market Analysis**: Competitive landscape, market gaps, target personas, and risk assessment.
- **Step 2 — MoSCoW PRD**: Feature prioritization derived directly from the market analysis. Must-have, Should-have, Could-have, Won't-have.
- **Step 3 — Launch Plan**: A 30-day go-to-market roadmap built from the PRD.

### 2. Challenge My Idea — Contrarian Validation Agent
**The honest critic no other AI tool is willing to be.**

Uses a system prompt specifically engineered to find holes — not to encourage. Returns fatal flaws (with severity), real competitor threats, pivot suggestions, and a blunt verdict: **Build it / Pivot first / Kill it**.

### 3. Zero-Day Explainer — Iterative Debug Pipeline
**3-step autonomous pipeline: Root Cause → Verify Fix → Edge Cases**

Paste broken code and an error message. The pipeline identifies the root cause and generates a fix (Step 1), re-analyzes the corrected code to confirm the fix is valid (Step 2), then performs edge-case analysis and issues a production-readiness verdict (Step 3).

---

## Architecture

Each tool follows the same pattern:

```
User Input
    │
    ▼
Step 1: Primary Analysis (Gemini 2.5 Flash)
    │  output passed as context
    ▼
Step 2: Secondary Reasoning
    │  output passed as context
    ▼
Step 3: Verification / Synthesis
    │
    ▼
Structured JSON → Rendered UI
```

All API routes validate input with **Zod**, authenticate via Supabase JWT (`getUser(token)` — not `getSession()`), and log usage to a `tool_usage` table for audit trails.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Vanilla CSS + Framer Motion |
| Database + Auth | Supabase (PostgreSQL + JWT) |
| AI Model | Google Gemini 2.5 Flash |
| Validation | Zod |
| Deployment | Vercel |

---

## Resource Management (BYOK)

- **Free tier**: 3 shared pipeline runs per user, tracked server-side.
- **Unlimited**: Add your own Gemini API key in the Config section. Keys are stored in `localStorage` — never sent to our servers except as a passthrough header to Google's API.

---

## Setup

1. **Clone & install**
```bash
git clone https://github.com/ctrl-Nix/forgelabs
cd forgelabs
npm install
```

2. **Environment**
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
GEMINI_API_KEY=your_shared_fallback_key
```

3. **Database**
Run the SQL in `lib/schema.sql` to initialize `projects` and `tool_usage` tables.

4. **Dev server**
```bash
npm run dev
```

---

*Built to be honest about what it does.*
