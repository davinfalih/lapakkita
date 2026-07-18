import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { user: { select: { namaToko: true, noWhatsapp: true, alamat: true } } },
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const existing = await prisma.product.findFirst({ where: { id: parseInt(id), userId: user.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const formData = await req.formData()
  const data: any = {
    nama: formData.get('nama') as string,
    harga: parseFloat(formData.get('harga') as string),
    stok: parseInt(formData.get('stok') as string),
    deskripsi: (formData.get('deskripsi') as string) || '',
    kategori: (formData.get('kategori') as string) || '',
    status: (formData.get('status') as string) || 'active',
  }

  const foto = formData.get('foto') as File | null
  if (foto && foto.size > 0) {
    const bytes = await foto.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = foto.name.split('.').pop()
    data.foto = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
    const fs = await import('fs/promises')
    const path = await import('path')
    await fs.writeFile(path.join(process.cwd(), 'public', 'uploads', data.foto), buffer)
  }

  const product = await prisma.product.update({ where: { id: parseInt(id) }, data })
  return NextResponse.json(product)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const existing = await prisma.product.findFirst({ where: { id: parseInt(id), userId: user.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.product.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ success: true })
}
