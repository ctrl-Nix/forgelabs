# ⚒ ForgeLabs

> **Modular AI Product Engineering Suite** — built for early-stage product teams who need structured, actionable intelligence fast.

**Live Demo:** [forgelabs-rosy.vercel.app](https://forgelabs-rosy.vercel.app)  
**GitHub:** [github.com/ctrl-Nix/forgelabs](https://github.com/ctrl-Nix/forgelabs)

---

## What is ForgeLabs?

ForgeLabs is a modular AI engineering suite with two live tools and one in development. Each module is an independent AI agent that takes structured input and returns structured, production-grade output — not vague summaries, but actual deliverables you can act on.

The core thesis: most "AI wrappers" are just chat interfaces around a model. ForgeLabs is different. Every tool uses a **multi-step pipeline** with typed outputs, domain-specific prompting, and schema-validated JSON — so the output is consistent, usable, and defensible.

---

## Modules

### 🧠 MarketMind — Product Research Agent
**Status: Live**

Input a SaaS idea, target audience, and monetization model. Get a full product research report in under 30 seconds.

**How it works (2-step pipeline):**
- **Step 1 — Market Research:** Gemini analyzes competitors, identifies the market gap, builds target personas, and surfaces risks with severity scores
- **Step 2 — PRD Generation:** A second Gemini call takes the Step 1 output and generates a full Product Requirements Document with MoSCoW prioritization, MVP scope, monetization strategy, 30-day launch plan, and tech complexity score

**Why two API calls?** Separating research from PRD generation keeps each prompt focused and domain-specific. A single prompt trying to do both produces shallow output. Two specialized prompts produce output you'd actually use in a team standup.

**Output tabs:** Overview · Competitors · MoSCoW Features · Launch Plan

---

### 🐛 Zero-Day Explainer — Bug Analysis Agent
**Status: Live**

Paste broken code and an error message. Get a structured engineering report instantly.

**Supports:** JavaScript · TypeScript · Python · Go · Rust · Java · C++ · CSS

**Output fields:**
- `root_cause` — exactly what went wrong and why
- `explanation` — plain-English breakdown for junior devs
- `corrected_code` — fixed, copy-ready code
- `prevention_tip` — how to avoid this class of bug in future
- `severity` — Critical / High / Medium / Low
- `confidence` — High / Medium / Low (AI surfaces its own uncertainty)

**Why confidence score?** AI isn't always right. Surfacing uncertainty is responsible engineering — it tells the developer when to double-check rather than blindly trust the output.

---

### 🚀 EngageOS — User Engagement Suite
**Status: Waitlist**

AI-powered user engagement and retention suite. Behavioral triggers, smart nudges, and lifecycle automation. Coming soon.

---

## Architecture

```
forgelabs/
├── app/
│   ├── api/
│   │   ├── marketmind/route.ts       # 2-step Gemini pipeline
│   │   └── zerodayexplainer/route.ts # Single-step analysis
│   ├── dashboard/page.tsx            # Auth-protected tool registry
│   ├── login/page.tsx                # Supabase email auth
│   ├── tools/
│   │   ├── marketmind/page.tsx
│   │   └── zerodayexplainer/page.tsx
│   ├── waitlist/page.tsx
│   └── page.tsx                      # Landing page
├── .env.local                        # API keys (gitignored)
└── package.json
```

**Stack:**
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Auth:** Supabase Auth (email/password)
- **Database:** Supabase PostgreSQL (usage logging, waitlist)
- **AI:** Google Gemini 2.5 Flash via REST API
- **Deployment:** Vercel (auto-deploy on push)

---

## Technical Decisions

| Decision | Why |
|---|---|
| Next.js API routes | API keys never exposed to client — all Gemini calls happen server-side |
| Two-step pipeline in MarketMind | Focused prompts outperform monolithic prompts for structured output |
| Temperature 0.3 for research | Balance between creativity and consistency |
| Temperature 0.2 for debugging | Precision matters more than creativity for code analysis |
| Zod-ready route structure | Schema validation ready to add without refactoring |
| Supabase over Firebase | Postgres gives structured querying for usage analytics |
| Tool Registry pattern | Demonstrates scalable architecture — adding a new tool is one object in an array |

---

## Key Engineering Patterns

**Tool Registry Pattern** — Dashboard renders from a typed `tools[]` array. Adding a new module requires zero UI changes — just add an entry to the registry. This is how real product teams scale internal tooling.

**Multi-step AI Pipeline** — MarketMind's two-stage approach mirrors how senior PMs actually work: research first, synthesis second. Each stage gets a focused, domain-specific prompt with explicit JSON schema instructions.

**Silent Failure Logging** — Usage tracking is wrapped in a try/catch that never surfaces errors to the user. Analytics should never break the product.

**Confidence Surfacing** — Zero-Day Explainer returns a `confidence` field with every analysis. This is intentional — responsible AI engineering means the tool should tell you when it's unsure.

---

## Local Setup

```bash
git clone https://github.com/ctrl-Nix/forgelabs
cd forgelabs
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
# Open http://localhost:3000
```

**Supabase setup** — run this in your Supabase SQL editor:
```sql
create table tool_usage (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  tool_id text,
  timestamp timestamptz default now()
);

create table waitlist (
  id uuid default gen_random_uuid() primary key,
  email text unique,
  tool_interest text,
  created_at timestamptz default now()
);

alter table tool_usage disable row level security;
alter table waitlist disable row level security;
```

---

## What's Next

- [ ] Rate limiting (10 uses/day per user)
- [ ] Save past researches to Supabase
- [ ] Export PRD as PDF
- [ ] EngageOS module
- [ ] Zod schema validation on all API routes
- [ ] Usage analytics dashboard

---



