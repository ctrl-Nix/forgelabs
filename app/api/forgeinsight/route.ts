import { NextRequest, NextResponse } from 'next/server'
import { ForgeInsightSchema } from '@/app/lib/schemas'
import { supabase } from '@/app/lib/supabase'
import { checkCredits } from '@/app/lib/credits'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = ForgeInsightSchema.safeParse(body)
    
    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid input', details: validated.error.format() }, { status: 400 })
    }

    const { idea, audience, monetization, projectId } = validated.data

    // ─── CREDIT GATE ───────────────────────────────────────────
    // This is the freemium engine. It determines WHO pays for this call.
    const userKey = req.headers.get('x-user-key')
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id

    const credits = await checkCredits(userId, userKey)

    if (!credits.canProceed) {
      return NextResponse.json({ 
        error: credits.errorMessage,
        creditsUsed: credits.freeCreditsUsed,
        creditsTotal: credits.freeCreditsTotal,
        needsKey: !credits.hasOwnKey,
      }, { status: 429 })
    }

    // Determine which key to actually use for the Gemini call
    const apiKey = credits.hasOwnKey ? userKey! : process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 })
    }

    // ─── STEP 1: Market Research ──────────────────────────────
    const step1Prompt = `You are a senior SaaS product strategist. Return structured JSON only. No extra text. No markdown.

Analyze this SaaS idea: ${idea}
Target audience: ${audience}
Monetization: ${monetization}

Return exactly this JSON:
{
  "market_summary": "string",
  "competitors": [{"name": "string", "weakness": "string", "pricing": "string"}],
  "market_gap": "string",
  "target_personas": ["string"],
  "risks": [{"risk": "string", "severity": "High|Medium|Low"}]
}`

    const step1Res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: step1Prompt }] }],
          generationConfig: { 
            temperature: 0.3,
            responseMimeType: "application/json"
          }
        })
      }
    )

    if (!step1Res.ok) {
      const errData = await step1Res.json()
      throw new Error(`Gemini Step 1 failed: ${errData.error?.message || step1Res.statusText}`)
    }

    const step1Data = await step1Res.json()
    const step1Text = step1Data.candidates[0].content.parts[0].text
    const step1JSON = JSON.parse(step1Text)

    // ─── STEP 2: PRD Generation ──────────────────────────────
    const step2Prompt = `You are a senior product manager writing a concise PRD. Return JSON only. No extra text. No markdown.

Based on this market research: ${JSON.stringify(step1JSON)}

Return exactly this JSON:
{
  "moscow": {
    "must_have": ["string"],
    "should_have": ["string"],
    "could_have": ["string"],
    "wont_have": ["string"]
  },
  "mvp_scope": "string",
  "monetization_strategy": "string",
  "launch_plan_30_days": ["string"],
  "tech_complexity_score": 5
}`

    const step2Res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: step2Prompt }] }],
          generationConfig: { 
            temperature: 0.3,
            responseMimeType: "application/json"
          }
        })
      }
    )

    if (!step2Res.ok) {
      const errData = await step2Res.json()
      throw new Error(`Gemini Step 2 failed: ${errData.error?.message || step2Res.statusText}`)
    }

    const step2Data = await step2Res.json()
    const step2Text = step2Data.candidates[0].content.parts[0].text
    const step2JSON = JSON.parse(step2Text)

    // ─── LOG USAGE (with credit tracking) ─────────────────────
    try {
      await supabase.from('tool_usage').insert({
        user_id: userId || 'anonymous',
        tool_id: 'forgeinsight',
        project_id: projectId || null,
        key_source: credits.usingServerCredits ? 'server' : 'user',
        data: { 
          input: { idea, audience, monetization },
          output: { research: step1JSON, prd: step2JSON }
        },
        timestamp: new Date().toISOString()
      })
    } catch (e) {
      console.error('Logging failed silently:', e)
    }

    return NextResponse.json({ 
      research: step1JSON, 
      prd: step2JSON,
      _credits: {
        used: credits.freeCreditsUsed + (credits.usingServerCredits ? 1 : 0),
        total: credits.freeCreditsTotal,
        source: credits.usingServerCredits ? 'forge' : 'personal',
      }
    })

  } catch (err: any) {
    console.error('ForgeInsight error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}