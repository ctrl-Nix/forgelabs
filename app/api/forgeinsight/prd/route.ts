import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'
import { checkCredits } from '@/app/lib/credits'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { research } = body

    if (!research) {
      return NextResponse.json({ error: 'Market research data is required' }, { status: 400 })
    }

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
        needsKey: !credits.hasOwnKey,
      }, { status: 429 })
    }

    const apiKey = credits.hasOwnKey ? userKey! : process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 })
    }

    const step2Prompt = `You are a senior product manager writing a concise PRD. Return JSON only. No extra text. No markdown.

Based on this market research: ${JSON.stringify(research)}

Return exactly this JSON:
{
  "moscow": {
    "must_have": ["string"],
    "should_have": ["string"],
    "could_have": ["string"],
    "wont_have": ["string"]
  },
  "mvp_scope": "string"
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

    return NextResponse.json({ 
      prd: step2JSON 
    })

  } catch (err: any) {
    console.error('ForgeInsight PRD error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
