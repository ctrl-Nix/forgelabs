import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/app/lib/supabase'
import { checkCredits } from '@/app/lib/credits'

const ChallengeSchema = z.object({
  idea: z.string().min(1, 'Idea is required'),
  audience: z.string().min(1, 'Audience is required'),
  monetization: z.string().min(1, 'Monetization is required'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = ChallengeSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid input', details: validated.error.format() }, { status: 400 })
    }

    const { idea, audience, monetization } = validated.data

    const userKey = req.headers.get('x-user-key')
    const authHeader = req.headers.get('Authorization')
    const accessToken = authHeader?.replace('Bearer ', '') ?? ''
    let userId: string | undefined
    if (accessToken) {
      const { data: { user } } = await supabase.auth.getUser(accessToken)
      userId = user?.id
    }

    const credits = await checkCredits(userId, userKey)

    if (!credits.canProceed) {
      return NextResponse.json({
        error: credits.errorMessage,
        creditsUsed: credits.freeCreditsUsed,
        creditsTotal: credits.freeCreditsTotal,
        needsKey: !credits.hasOwnKey,
      }, { status: 429 })
    }

    const apiKey = credits.hasOwnKey ? userKey! : process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 })
    }

    const prompt = `You are a brutally honest, world-class startup critic and venture analyst. Your job is NOT to encourage — it is to find every hole, risk, and fatal flaw in this idea before the founder wastes years building it. Be blunt, specific, and honest. Do not sugarcoat. Return JSON only. No extra text. No markdown.

Idea: ${idea}
Target audience: ${audience}
Monetization: ${monetization}

Return exactly this JSON:
{
  "fatal_flaws": [
    { "flaw": "string", "severity": "Critical|High|Medium", "reasoning": "string" }
  ],
  "competitor_threats": [
    { "name": "string", "url": "string", "why_dangerous": "string", "market_share": "string" }
  ],
  "steelman_case": "string",
  "pivot_suggestions": [
    { "pivot": "string", "why_better": "string" }
  ],
  "honest_verdict": "Build it|Pivot first|Kill it",
  "verdict_reasoning": "string",
  "survival_probability": "1-10 numeric score of this idea surviving 2 years",
  "biggest_assumption": "string"
}`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json'
          }
        })
      }
    )

    if (!res.ok) {
      const errData = await res.json()
      throw new Error(`Gemini failed: ${errData.error?.message || res.statusText}`)
    }

    const data = await res.json()
    const text = data.candidates[0].content.parts[0].text
    const result = JSON.parse(text)

    // Log usage
    try {
      await supabase.from('tool_usage').insert({
        user_id: userId || 'anonymous',
        tool_id: 'challengeidea',
        key_source: credits.usingServerCredits ? 'server' : 'user',
        data: {
          input: { idea, audience, monetization },
          output: result
        },
        timestamp: new Date().toISOString()
      })
    } catch (e) {
      console.error('Logging failed silently:', e)
    }

    return NextResponse.json({
      ...result,
      _credits: {
        used: credits.freeCreditsUsed + (credits.usingServerCredits ? 1 : 0),
        total: credits.freeCreditsTotal,
        source: credits.usingServerCredits ? 'forge' : 'personal',
      }
    })

  } catch (err: any) {
    console.error('ChallengeIdea error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
