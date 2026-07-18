import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const orderCode = searchParams.get('orderCode')
  if (!orderCode) return NextResponse.json({ error: 'No order code' }, { status: 400 })

  const order = await prisma.order.findUnique({
    where: { orderCode },
    include: { product: { select: { nama: true, foto: true } } },
  })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Check payment status from Midtrans
  if (order.paymentStatus === 'unpaid' && order.snapToken) {
    try {
      const midtransRes = await fetch(
        `${process.env.MIDTRANS_IS_PRODUCTION === 'true' ? 'https://api.midtrans.com/v2' : 'https://api.sandbox.midtrans.com/v2'}/${orderCode}/status`,
        { headers: { 'Authorization': 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64') } }
      )
      if (midtransRes.ok) {
        const status = await midtransRes.json()
        const txnStatus = status.transaction_status
        if (['capture', 'settlement'].includes(txnStatus)) {
          await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'paid', status: 'paid' } })
          order.paymentStatus = 'paid'
          order.status = 'paid'
        } else if (['deny', 'cancel', 'expire'].includes(txnStatus)) {
          await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'expired' } })
          order.paymentStatus = 'expired'
        }
      }
    } catch {}
  }

  return NextResponse.json(order)
}
