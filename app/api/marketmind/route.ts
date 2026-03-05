import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { idea, audience, monetization } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

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
  "risks": [{"risk": "string", "severity": "High"}]
}`

    const step1Res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: step1Prompt }] }],
          generationConfig: { temperature: 0.3 }
        })
      }
    )

    const step1Data = await step1Res.json()
    console.log('Step 1 response:', JSON.stringify(step1Data))
    const step1Text = step1Data.candidates[0].content.parts[0].text
    const step1Clean = step1Text.replace(/```json|```/g, '').trim()
    const step1JSON = JSON.parse(step1Clean)

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
          generationConfig: { temperature: 0.3 }
        })
      }
    )

    const step2Data = await step2Res.json()
    console.log('Step 2 response:', JSON.stringify(step2Data))
    const step2Text = step2Data.candidates[0].content.parts[0].text
    const step2Clean = step2Text.replace(/```json|```/g, '').trim()
    const step2JSON = JSON.parse(step2Clean)

    // Log usage
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      await supabase.from('tool_usage').insert({
        tool_id: 'marketmind',
        timestamp: new Date().toISOString()
      })
    } catch (e) {
      console.log('Logging failed silently')
    }

    return NextResponse.json({ research: step1JSON, prd: step2JSON })

  } catch (err: any) {
    console.error('MarketMind error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}