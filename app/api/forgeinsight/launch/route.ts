import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'
import { checkCredits } from '@/app/lib/credits'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prd } = body

    if (!prd) {
      return NextResponse.json({ error: 'PRD data is required' }, { status: 400 })
    }

    const userKey = req.headers.get('x-user-key')
    const openAiKeyHeader = req.headers.get('x-openai-key')
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

    const step3Prompt = `You are a growth hacker creating a go-to-market strategy. Return JSON only. No extra text. No markdown.

Based on this PRD: ${JSON.stringify(prd)}

Return exactly this JSON:
{
  "launch_plan_30_days": ["string"],
  "monetization_strategy": "string",
  "tech_complexity_score": 5
}`

    let step3JSON;
    const openAiKey = (openAiKeyHeader && openAiKeyHeader.length > 10) ? openAiKeyHeader : process.env.OPENAI_API_KEY;

    if (openAiKey) {
      // ─── OPENAI GPT-4O PATH (STRUCTURED SYNTHESIS) ───
      const step3Res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // or gpt-4o depending on preference, mini is faster/cheaper for this
          messages: [
            { role: 'system', content: "You are a growth hacker creating a go-to-market strategy. Return JSON only. No extra text. No markdown. Return exactly this JSON structure: {\"launch_plan_30_days\":[\"string\"],\"monetization_strategy\":\"string\",\"tech_complexity_score\":5}" },
            { role: 'user', content: `Based on this PRD: ${JSON.stringify(prd)}` }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!step3Res.ok) {
        const errData = await step3Res.json();
        console.error("OpenAI error:", errData);
        throw new Error(`OpenAI Step 3 failed: ${step3Res.statusText}`);
      }

      const step3Data = await step3Res.json();
      step3JSON = JSON.parse(step3Data.choices[0].message.content);

    } else {
      // ─── GEMINI FALLBACK PATH ───
      const step3Res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: step3Prompt }] }],
            generationConfig: { 
              temperature: 0.3,
              responseMimeType: "application/json"
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
      step3JSON = JSON.parse(step3Text)
    }

    return NextResponse.json({ 
      launch: step3JSON 
    })

  } catch (err: any) {
    console.error('ForgeInsight Launch error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
