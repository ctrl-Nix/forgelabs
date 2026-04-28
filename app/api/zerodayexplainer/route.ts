import { NextRequest, NextResponse } from 'next/server'
import { ZeroDaySchema } from '@/app/lib/schemas'
import { supabase } from '@/app/lib/supabase'
import { checkCredits } from '@/app/lib/credits'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = ZeroDaySchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid input', details: validated.error.format() }, { status: 400 })
    }

    const { code, error, language } = validated.data

    // ─── CREDIT GATE ───────────────────────────────────────────
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

    const apiKey = credits.hasOwnKey ? userKey! : process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 })
    }

    // ─── ANALYSIS ─────────────────────────────────────────────
    const prompt = `You are a senior software engineer doing code review. Be precise. Explain to a junior developer. Return JSON only. No extra text. No markdown.

Language: ${language}
Code: ${code}
Error: ${error || 'No error message provided'}

Return exactly this JSON:
{
  "root_cause": "string",
  "explanation": "string",
  "corrected_code": "string",
  "prevention_tip": "string",
  "severity": "Critical|High|Medium|Low",
  "confidence": "High|Medium|Low"
}`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      }
    )

    if (!res.ok) {
      const errData = await res.json()
      throw new Error(`Gemini analysis failed: ${errData.error?.message || res.statusText}`)
    }

    const data = await res.json()
    const text = data.candidates[0].content.parts[0].text
    const result = JSON.parse(text)

    // ─── LOG USAGE (with credit tracking) ─────────────────────
    try {
      await supabase.from('tool_usage').insert({
        user_id: userId || 'anonymous',
        tool_id: 'zerodayexplainer',
        key_source: credits.usingServerCredits ? 'server' : 'user',
        data: { 
          input: { code, error, language },
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
    console.error('ZeroDay error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}