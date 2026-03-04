import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { code, error, language } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

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
          generationConfig: { temperature: 0.2 }
        })
      }
    )

    const data = await res.json()
    const text = data.candidates[0].content.parts[0].text
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)

    // Log usage
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      await supabase.from('tool_usage').insert({
        tool_id: 'zerodayexplainer',
        timestamp: new Date().toISOString()
      })
    } catch (e) {
      console.log('Logging failed silently')
    }

    return NextResponse.json(result)

  } catch (err: any) {
    console.error('ZeroDay error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}