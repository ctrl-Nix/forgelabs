import { NextRequest, NextResponse } from 'next/server'
import { ProjectSchema } from '@/app/lib/schemas'
import { supabase } from '@/app/lib/supabase'

async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  const accessToken = authHeader?.replace('Bearer ', '') ?? ''
  if (!accessToken) return null
  const { data: { user } } = await supabase.auth.getUser(accessToken)
  return user ?? null
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = ProjectSchema.safeParse(body)
    if (!validated.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: validated.data.name,
        description: validated.data.description,
        user_id: user.id,
        status: 'inception'
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
