# ⚒ ForgeOS — The Venture Suite

> **The Startup Operating System** — A professional-grade engineering platform for transforming ideas into venture-ready products.

**GitHub:** [github.com/ctrl-Nix/forgelabs](https://github.com/ctrl-Nix/forgelabs)

---

## What is ForgeOS?

ForgeOS is more than an AI tool; it is a **Project-Centric Startup OS**. It shifts the focus from standalone utilities to a longitudinal "Venture Sequence." 

Instead of running disconnected prompts, users initialize a **Venture**, which acts as a central hub for all market research, PRDs, bug analysis, and future engineering tasks.

---

## 🚀 The Launch Sequence

### 1. Inception — MarketMind
**Product Research Agent**  
Generate a full market research report and a professional MoSCoW PRD in under 30 seconds.
- **Thinking Intelligence**: Powered by Gemini 2.5 Flash with reasoning capabilities.
- **2-Step Pipeline**: Separates competitive research from product definition for maximum precision.
- **Project Context**: Automatically associates outputs with your active Venture.

### 2. Engineering — Zero-Day Explainer
**Bug Analysis & Resolution Agent**  
Instantly diagnose complex runtime errors and generate production-ready fixes.
- **Multi-Language Support**: JS, TS, Python, Go, Rust, Java, C++, CSS.
- **Confidence Scoring**: Surfaces AI uncertainty to ensure responsible engineering.
- **Root Cause Analysis**: Explains the *why* so your team learns while fixing.

### 3. Growth — EngageOS
**Lifecycle Automation (Waitlist)**  
AI-powered engagement suite for behavioral triggers and smart nudges.

---

## 💰 The Freemium Intelligence Model

ForgeOS implements a unique **"Bring Your Own Key" (BYOK)** economy to ensure zero-marginal-cost scaling:
- **The Hook**: Every user gets **3 FREE runs** on the house to experience the system's power.
- **The Bridge**: After the free tier, users plug in their own **Gemini API Key** (available for free from Google AI Studio).
- **Infinite Runway**: This model allows the platform to scale to millions of users with zero increase in AI computation costs for the owner.

---

## 🛠 Architecture

```
forgelabs/
├── app/
│   ├── api/
│   │   ├── credits/        # Live credit tracking
│   │   ├── marketmind/     # AI research pipeline
│   │   ├── projects/       # Venture management
│   │   └── zerodayexplainer/
│   ├── dashboard/          # Venture Control Center
│   ├── projects/           # Venture Profile pages
│   ├── tools/              # Module interfaces
│   ├── lib/
│   │   ├── credits.ts      # Freemium logic core
│   │   └── schemas.ts      # Zod validation layer
│   └── page.tsx            # Landing page
```

---

## ⚙️ Local Setup

1. **Clone & Install**
```bash
git clone https://github.com/ctrl-Nix/forgelabs
cd forgelabs
npm install
```

2. **Configure Environment**
Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
GEMINI_API_KEY=your_key
```

3. **Database Setup**
Run the following in your Supabase SQL Editor:

```sql
-- Venture Management
create table projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  name text not null,
  description text,
  status text default 'inception',
  created_at timestamptz default now()
);

-- Advanced Usage Tracking
create table tool_usage (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  tool_id text,
  project_id uuid references projects(id),
  key_source text default 'server',
  data jsonb,
  timestamp timestamptz default now()
);

alter table projects enable row level security;
alter table tool_usage enable row level security;
```

---

## 👔 Strategic Roadmap
- [x] **Phase 1**: Pivot to Project-Centric Architecture (Venture Suite)
- [x] **Phase 2**: Implement BYOK Freemium Model
- [x] **Phase 3**: Upgrade to Gemini 2.5 Flash (Thinking Intelligence)
- [ ] **Phase 4**: Linear/GitHub Integration for automated task creation
- [ ] **Phase 5**: BrandArchitect — Visual Identity generation for Ventures

---
*Built with precision for the next generation of founders.*
