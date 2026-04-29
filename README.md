# ⚒ ForgeLabs — Premium AI Intelligence Platform

> **The Professional AI Engineering Suite** — A high-performance platform for modular AI research, automated documentation, and code intelligence.

**GitHub:** [github.com/ctrl-Nix/forgelabs](https://github.com/ctrl-Nix/forgelabs)

---

## What is ForgeLabs?

ForgeLabs is a sophisticated **AI Intelligence & Orchestration Platform** designed for the modern engineer. It transforms raw AI power into structured, actionable insights through specialized modules, validated schemas, and a "Project-First" workflow.

Built with **Next.js 16**, **Tailwind CSS 4**, and **Framer Motion**, ForgeLabs offers a premium, gamified experience that feels fluid and professional.

---

## ✨ Key Features

### 🌗 Premium Light & Dark Mode
Experience a highly polished "Ultra-Clean" design. ForgeLabs defaults to a sophisticated **Slate-tinted Light Theme** for daytime productivity and offers a deep, high-contrast **Dark Mode** for nighttime engineering.

### 🎮 Gamified Experience
Intelligence shouldn't be boring. ForgeLabs includes:
- **Smooth Transitions**: Staggered card entrances and layout shifts powered by Framer Motion.
- **Success Feedback**: Professional confetti bursts upon completing research or analysis.
- **Progress Tracking**: Real-time animated progress bars for AI intelligence processing.

### 📂 Project-Centric Workflow
Organize your work logically. Group all research reports, code fixes, and system logs under specific **Projects** to maintain a clean audit trail.

---

## 🛠 Active Modules

### 1. ForgeInsight — Product Research Pipeline
**Advanced Market Analysis & Documentation**
Input a SaaS idea and get a full-spectrum research report in seconds.
- **Market Summary**: AI-generated competitive landscape analysis.
- **MoSCoW PRD**: Automated feature prioritization (Must-haves, Should-haves, etc.).
- **30-Day Launch Plan**: A step-by-step roadmap to go from idea to MVP.
- **Export Ready**: Download beautiful PDF reports instantly.

### 2. Zero-Day Explainer — Code Intelligence
**Technical Root Cause Analysis**
Paste broken code and error logs to receive an engineering-grade breakdown.
- **Fixed Code**: Immediate, validated resolutions across 8+ languages.
- **Severity Scoring**: Dynamic 1-10 scoring based on security and performance impact.
- **Prevention Tips**: Structured advice to ensure the same bug never returns.

---

## ⚙️ Resource Management (BYOK)

ForgeLabs follows a **Bring Your Own Key (BYOK)** model for privacy and scalability:
- **Free Trial**: Every user receives **shared intelligence runs** to experience the platform.
- **Unlimited Usage**: Connect your own **Gemini API Key** (Free from Google AI Studio) in the `Config AI` section for unlimited power.
- **Privacy First**: Your API keys are stored only in your browser's local storage—never on our servers.

---

## 🏗 Tech Stack
- **Framework**: Next.js 16 (App Router + Turbopack)
- **Styling**: Tailwind CSS 4 + Framer Motion
- **Database**: Supabase (PostgreSQL + Auth)
- **AI Models**: Google Gemini 2.0 Flash / Pro

---

## 🚀 Setup & Installation

1. **Clone & Install**
```bash
git clone https://github.com/ctrl-Nix/forgelabs
cd forgelabs
npm install
```

2. **Environment Configuration**
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
GEMINI_API_KEY=your_shared_fallback_key
```

3. **Database Migration**
Run the SQL found in `lib/schema.sql` (or see manual setup in wiki) to initialize the `projects` and `tool_usage` tables.

4. **Launch**
```bash
npm run dev
```

---

*Engineered for those who build the future.*
