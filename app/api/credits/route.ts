import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'
import { FREEMIUM_CONFIG } from '@/app/lib/credits'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    const accessToken = authHeader?.replace('Bearer ', '') ?? ''
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { data: { user } } = await supabase.auth.getUser(accessToken)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    // Count lifetime server-funded runs
    const { count: serverRuns } = await supabase
      .from('tool_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('key_source', 'server')

    // Count total runs (all time)
    const { count: totalRuns } = await supabase
      .from('tool_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    const used = serverRuns ?? 0
    const total = totalRuns ?? 0

    return NextResponse.json({
      freeCredits: {
        used,
        total: FREEMIUM_CONFIG.FREE_CREDITS,
        remaining: Math.max(0, FREEMIUM_CONFIG.FREE_CREDITS - used),
      },
      totalRuns: total,
      tier: used >= FREEMIUM_CONFIG.FREE_CREDITS ? 'byok' : 'free',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
