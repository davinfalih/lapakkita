import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const notification = await req.json()
  const { order_id, transaction_status, fraud_status } = notification

  if (!order_id) return NextResponse.json({ error: 'No order_id' }, { status: 400 })

  const order = await prisma.order.findUnique({ where: { orderCode: order_id } })
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  let paymentStatus = order.paymentStatus
  let status = order.status

  switch (transaction_status) {
    case 'capture':
      if (fraud_status === 'accept') { paymentStatus = 'paid'; status = 'paid' }
      break
    case 'settlement':
      paymentStatus = 'paid'; status = 'paid'
      break
    case 'deny':
    case 'cancel':
    case 'expire':
      paymentStatus = 'expired'; status = 'cancelled'
      await prisma.product.update({ where: { id: order.productId }, data: { stok: { increment: order.jumlah } } })
      break
  }

  await prisma.order.update({ where: { id: order.id }, data: { paymentStatus, status } })
  return NextResponse.json({ success: true })
}
