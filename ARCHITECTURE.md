# Architecture & Design

This document outlines the architectural decisions, pipeline designs, and data flow of ForgeLabs.

## System Architecture Overview

ForgeLabs uses a modern Next.js App Router architecture, focusing on server-side validation and autonomous AI pipelines.

### Core Stack
- **Frontend/Backend:** Next.js 16 (App Router)
- **Styling:** Vanilla CSS + Tailwind CSS utilities + Framer Motion
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, JWTs)
- **AI Models:** Google Gemini 2.5 Flash (via `@google/genai` or direct REST fetch)
- **Schema Validation:** Zod

## Authentication & Security

All API routes use a secure token-based authentication approach.

**Crucial Security Decision:**
We explicitly avoid `supabase.auth.getSession()` on the server because it relies on potentially spoofable cookies. Instead, the client sends the `access_token` in the `Authorization: Bearer <token>` header, and the server validates it using `supabase.auth.getUser(accessToken)`. This guarantees cryptographic verification of the user making the request.

## The BYOK (Bring Your Own Key) Engine

To balance a freemium model with unlimited scaling, we use a hybrid credit system:
1. **Free Tier:** Users get 3 free pipeline runs (tracked in the `tool_usage` table). We use the server's `GEMINI_API_KEY`.
2. **BYOK Mode:** Users enter their own Gemini API key in the Setup page. It is stored securely in `localStorage` and sent via the `x-user-key` header. If present, the server bypasses the credit check and uses the user's key directly against Google's API.

## Autonomous AI Pipelines

ForgeLabs is built around the concept of autonomous multi-step pipelines. Instead of a single massive prompt (which degrades reasoning quality), we chain smaller, focused prompts together. The output of Step 1 is passed directly as context to Step 2, and so on.

### 1. ForgeInsight Pipeline (Product Research)
A 3-step pipeline to generate a comprehensive product plan.

```mermaid
graph TD
    Input[User Input: Idea, Audience, Monetization] --> API1
    
    subgraph Step 1
    API1(POST /api/forgeinsight/market) --> LLM1[Gemini: Market Analysis]
    LLM1 --> JSON1[Market JSON]
    end
    
    JSON1 --> API2
    
    subgraph Step 2
    API2(POST /api/forgeinsight/prd) --> LLM2[Gemini: MoSCoW PRD]
    LLM2 --> JSON2[PRD JSON]
    end
    
    JSON2 --> API3
    
    subgraph Step 3
    API3(POST /api/forgeinsight/launch) --> LLM3[Gemini: Launch Plan]
    LLM3 --> JSON3[Launch JSON]
    end
    
    JSON1 --> UI[Rendered UI]
    JSON2 --> UI
    JSON3 --> UI
```

### 2. Zero-Day Explainer Pipeline (Iterative Debugging)
A self-healing 3-step pipeline that generates a fix, then critically verifies its own fix.

```mermaid
graph TD
    Input[Code + Error] --> API1
    
    subgraph Step 1: Root Cause & Fix
    API1(POST /api/zerodayexplainer) --> LLM1[Gemini: Analyze & Fix]
    LLM1 --> JSON1[Root Cause & Fixed Code JSON]
    end
    
    JSON1 --> API2
    
    subgraph Step 2 & 3: Verification Sub-Route
    API2(POST /api/zerodayexplainer/verify)
    API2 --> LLM2[Gemini: Verify Fix]
    LLM2 --> LLM3[Gemini: Edge Case Analysis]
    LLM3 --> JSON2[Verification + Edge Cases JSON]
    end
    
    JSON1 --> UI[Rendered UI]
    JSON2 --> UI
```

### 3. Challenge My Idea (Contrarian Agent)
A single-step, high-density reasoning pipeline. The system prompt is heavily engineered to bypass standard AI sycophancy (agreeableness) and forcefully critique the input.

```mermaid
graph TD
    Input[Idea + Audience] --> API1(POST /api/challengeidea)
    API1 --> LLM1[Gemini: Brutally Honest Critique]
    LLM1 --> JSON[Fatal Flaws, Competitors, Verdict JSON]
    JSON --> UI
```

## Database Schema

- `projects`: Organizes all runs. Has `id`, `user_id`, `name`, `description`, `status`.
- `tool_usage`: Audit log for the credit system. Has `id`, `user_id`, `tool_id`, `key_source` (server vs user), `data` (JSONB of the inputs/outputs).

## Future Considerations
- Transitioning to a multi-model architecture to use Gemini for speed (Step 1) and Claude 3.5 Sonnet or GPT-4o for complex reasoning (Step 2/3).
- Adding background web search (e.g., Tavily API) to Step 1 of ForgeInsight for real-time competitor data.
