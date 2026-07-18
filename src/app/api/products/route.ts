import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const kategori = searchParams.get('kategori')
  const search = searchParams.get('search')
  const userProducts = searchParams.get('user') === 'true'

  const where: any = { status: 'active' }

  if (userProducts) {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    where.userId = user.id
    delete where.status
  }
  if (kategori) where.kategori = kategori
  if (search) where.nama = { contains: search, mode: 'insensitive' }

  const products = await prisma.product.findMany({
    where,
    include: { user: { select: { namaToko: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const nama = formData.get('nama') as string
  const harga = parseFloat(formData.get('harga') as string)
  const stok = parseInt(formData.get('stok') as string)
  const deskripsi = (formData.get('deskripsi') as string) || ''
  const kategori = (formData.get('kategori') as string) || ''
  const foto = formData.get('foto') as File | null

  if (!nama || !harga || stok < 0 || !foto) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
  }

  const bytes = await foto.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = foto.name.split('.').pop()
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
  const fs = await import('fs/promises')
  const path = await import('path')
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadDir, { recursive: true })
  await fs.writeFile(path.join(uploadDir, filename), buffer)

  const product = await prisma.product.create({
    data: { userId: user.id, foto: filename, nama, harga, stok, deskripsi, kategori },
  })

  return NextResponse.json(product, { status: 201 })
}
