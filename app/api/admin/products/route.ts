import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, price, category, image_url, in_stock } = body

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Name, price and category are required.' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({ name, description, price, category, image_url: image_url || null, in_stock })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
