import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/app/lib/supabase'
import { checkCredits } from '@/app/lib/credits'

const MarketSchema = z.object({
  idea: z.string().min(1, 'Idea is required'),
  audience: z.string().min(1, 'Audience is required'),
  monetization: z.string().min(1, 'Monetization is required'),
  projectId: z.string().optional().nullable(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = MarketSchema.safeParse(body)
    
    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid input', details: validated.error.format() }, { status: 400 })
    }

    const { idea, audience, monetization, projectId } = validated.data

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

    // Log usage only in the first step of the pipeline to count as 1 credit
    try {
      await supabase.from('tool_usage').insert({
        user_id: userId || 'anonymous',
        tool_id: 'forgeinsight',
        project_id: projectId || null,
        key_source: credits.usingServerCredits ? 'server' : 'user',
        data: { 
          input: { idea, audience, monetization },
          output: { research: step1JSON }
        },
        timestamp: new Date().toISOString()
      })
    } catch (e) {
      console.error('Logging failed silently:', e)
    }

    return NextResponse.json({ 
      research: step1JSON, 
      _credits: {
        used: credits.freeCreditsUsed + (credits.usingServerCredits ? 1 : 0),
        total: credits.freeCreditsTotal,
        source: credits.usingServerCredits ? 'forge' : 'personal',
      }
    })

  } catch (err: any) {
    console.error('ForgeInsight Market error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
