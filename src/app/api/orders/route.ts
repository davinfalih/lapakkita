import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const filter = searchParams.get('filter')

  const where: any = { userId: user.id }
  if (filter && filter !== 'all') where.status = filter

  const orders = await prisma.order.findMany({
    where,
    include: { product: { select: { nama: true, foto: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  try {
    const { productId, qty, pembeliNama, pembeliAlamat, pembeliNoHp } = await req.json()

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product || product.stok < qty) {
      return NextResponse.json({ error: 'Stok tidak mencukupi' }, { status: 400 })
    }

    const totalHarga = product.harga * qty
    const orderCode = `LK${Date.now()}${Math.floor(Math.random() * 900 + 100)}`

    // Kurangi stok
    await prisma.product.update({ where: { id: productId }, data: { stok: { decrement: qty } } })

    // Buat order
    const order = await prisma.order.create({
      data: {
        productId,
        userId: product.userId,
        pembeliNama,
        pembeliAlamat,
        pembeliNoHp,
        jumlah: qty,
        totalHarga,
        orderCode,
      },
    })

    // Midtrans Snap
    const payload = {
      transaction_details: { order_id: orderCode, gross_amount: totalHarga },
      item_details: [{ id: String(product.id), price: product.harga, quantity: qty, name: product.nama.slice(0, 50) }],
      customer_details: { first_name: pembeliNama, phone: pembeliNoHp },
      enabled_payments: ['qris', 'gopay', 'shopeepay', 'other_va', 'bank_transfer'],
    }

    const midtransRes = await fetch(process.env.MIDTRANS_IS_PRODUCTION === 'true'
      ? 'https://app.midtrans.com/snap/v1/transaction'
      : 'https://app.sandbox.midtrans.com/snap/v1/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64'),
      },
      body: JSON.stringify(payload),
    })

    if (midtransRes.ok) {
      const result = await midtransRes.json()
      await prisma.order.update({ where: { id: order.id }, data: { snapToken: result.token } })
      return NextResponse.json({ orderCode, snapToken: result.token })
    }

    // If Midtrans fails, restore stock
    await prisma.product.update({ where: { id: productId }, data: { stok: { increment: qty } } })
    await prisma.order.delete({ where: { id: order.id } })
    return NextResponse.json({ error: 'Gagal memproses pembayaran' }, { status: 500 })

  } catch (e) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
