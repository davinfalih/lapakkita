import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json(null)
  return NextResponse.json({ id: user.id, namaToko: user.namaToko, email: user.email })
}
