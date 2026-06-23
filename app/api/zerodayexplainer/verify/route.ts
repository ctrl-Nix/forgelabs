import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/app/lib/supabase'
import { checkCredits } from '@/app/lib/credits'

const VerifySchema = z.object({
  correctedCode: z.string().min(1, 'Corrected code is required'),
  originalError: z.string().optional().default(''),
  language: z.string().min(1, 'Language is required'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = VerifySchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid input', details: validated.error.format() }, { status: 400 })
    }

    const { correctedCode, originalError, language } = validated.data

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

    // Step 2: Re-analyze the corrected code to verify it's clean
    const step2Prompt = `You are a senior code reviewer doing a second-pass verification. A junior dev has already fixed a bug. Verify the fix is correct, complete, and doesn't introduce new issues. Return JSON only. No extra text. No markdown.

Language: ${language}
Original error that was fixed: ${originalError || 'Not provided'}
Corrected code to verify:
${correctedCode}

Return exactly this JSON:
{
  "fix_confirmed": true or false,
  "remaining_issues": ["string"] or [],
  "new_issues_introduced": ["string"] or [],
  "code_quality_score": 1-10,
  "verification_summary": "string"
}`

    const step2Res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: step2Prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
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

    // Step 3: Edge case analysis on the verified code
    const step3Prompt = `You are a QA engineer doing final edge case analysis. The code has been fixed and verified. Now find edge cases that could still break it. Return JSON only. No extra text. No markdown.

Language: ${language}
Verified code:
${correctedCode}

Return exactly this JSON:
{
  "edge_cases": [
    { "case": "string", "risk": "High|Medium|Low", "suggestion": "string" }
  ],
  "production_ready": true or false,
  "final_recommendation": "string"
}`

    const step3Res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: step3Prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        })
      }
    )

    if (!step3Res.ok) {
      const errData = await step3Res.json()
      throw new Error(`Gemini Step 3 failed: ${errData.error?.message || step3Res.statusText}`)
    }

    const step3Data = await step3Res.json()
    const step3Text = step3Data.candidates[0].content.parts[0].text
    const step3JSON = JSON.parse(step3Text)

    return NextResponse.json({
      verification: step2JSON,
      edgeCases: step3JSON,
    })

  } catch (err: any) {
    console.error('ZeroDay Verify error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
