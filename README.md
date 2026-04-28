# ⚒ ForgeOS — AI Engineering Platform

> **Advanced AI Tooling Suite** — A professional-grade engineering platform for modular AI agent orchestration and structured data analysis.

**GitHub:** [github.com/ctrl-Nix/forgelabs](https://github.com/ctrl-Nix/forgelabs)

---

## What is ForgeOS?

ForgeOS is an open-source **AI Agent Orchestration Platform**. It provides a structured environment for running domain-specific AI modules with typed outputs and schema-validated JSON.

The platform uses a **Project-Centric Architecture**, allowing users to group analyses, research, and debugging tasks under specific project headers for longitudinal tracking.

---

## 🛠 Modules

### 1. MarketMind — Research Agent
**Product Analysis Pipeline**  
Generate structured analysis reports and technical PRDs using a multi-step orchestration pipeline.
- **Thinking Intelligence**: Powered by Gemini 2.5 Flash with reasoning capabilities.
- **2-Step Orchestration**: Separates data extraction from document synthesis for maximum precision.

### 2. Zero-Day Explainer — Debugging Agent
**Code Analysis & Resolution Agent**  
Diagnose complex runtime errors and generate verified code fixes across 8+ languages.
- **Confidence Scoring**: Surfaces model uncertainty for responsible engineering.
- **Root Cause Analysis**: Provides technical breakdowns of memory leaks, syntax errors, and logic flaws.

---

## ⚙️ Resource Management (BYOK)

ForgeOS utilizes a **Personal API Key** model to ensure privacy and scalability:
- **Initial Access**: Every user receives **3 shared intelligence runs** to test the system's capabilities.
- **Personal Configuration**: For unlimited usage, users can provide their own **Gemini API Key** (available for free from Google AI Studio).
- **Security**: Personal keys are stored exclusively in the browser's `localStorage` and are never transmitted to the platform's database.

---

## 🏗 Architecture

```
forgelabs/
├── app/
│   ├── api/
│   │   ├── credits/        # Resource tracking
│   │   ├── marketmind/     # Multi-step AI pipeline
│   │   ├── projects/       # Project management logic
│   │   └── zerodayexplainer/
│   ├── dashboard/          # Central Control Center
│   ├── lib/
│   │   ├── credits.ts      # Resource management logic
│   │   └── schemas.ts      # Zod validation layer
```

---

## ⚙️ Setup

1. **Clone & Install**
```bash
git clone https://github.com/ctrl-Nix/forgelabs
cd forgelabs
npm install
```

2. **Database Setup**
Run the following in your Supabase SQL Editor:

```sql
create table projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  name text not null,
  description text,
  status text default 'active',
  created_at timestamptz default now()
);

create table tool_usage (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  tool_id text,
  project_id uuid references projects(id),
  key_source text default 'shared',
  data jsonb,
  timestamp timestamptz default now()
);
```

---

## 🧪 Strategic Roadmap
- [x] **Phase 1**: Project-Centric Architecture
- [x] **Phase 2**: Personal API Key (BYOK) Integration
- [x] **Phase 3**: Gemini 2.5 Flash Upgrade
- [ ] **Phase 4**: Automated Task Export (GitHub/Linear)
- [ ] **Phase 5**: Advanced RAG for localized knowledge bases

---
*Built for the next generation of engineers.*
