'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Order {
  orderCode: string; totalHarga: number; paymentStatus: string; status: string
  snapToken: string | null; jumlah: number
  product: { nama: string; foto: string }
}

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderCode = searchParams.get('order')
  const [order, setOrder] = useState<Order | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    if (!orderCode) return
    fetch(`/api/orders/status?orderCode=${orderCode}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data)
        if (data.snapToken && data.paymentStatus === 'unpaid') {
          const script = document.createElement('script')
          script.src = `https://app.sandbox.midtrans.com/snap/snap.js`
          script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '')
          script.onload = () => setScriptLoaded(true)
          document.body.appendChild(script)
        }
      })
  }, [orderCode])

  function handlePay() {
    if (!order?.snapToken || !(window as any).snap) return
    ;(window as any).snap.pay(order.snapToken, {
      onSuccess: () => window.location.reload(),
      onPending: () => window.location.reload(),
    })
  }

  if (!order) return <div className="text-center py-20 text-slate-500">Memuat...</div>

  const statusConfig: Record<string, { icon: string; bg: string; title: string; color: string }> = {
    paid: { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', bg: 'bg-emerald-100', title: 'Pembayaran Berhasil!', color: 'text-emerald-600' },
    expired: { icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', bg: 'bg-red-100', title: 'Pembayaran Gagal / Kedaluwarsa', color: 'text-red-500' },
    unpaid: { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', bg: 'bg-amber-100', title: 'Menunggu Pembayaran', color: 'text-amber-600' },
  }
  const cfg = statusConfig[order.paymentStatus] || statusConfig.unpaid

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className={`w-20 h-20 ${cfg.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <svg className={`w-10 h-10 ${cfg.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cfg.icon} /></svg>
        </div>
        <h1 className={`text-2xl font-bold ${cfg.color} mb-2`}>{cfg.title}</h1>
        <p className="text-slate-500 mb-6">Kode: <strong>#{order.orderCode}</strong></p>

        {order.paymentStatus === 'unpaid' && order.snapToken && (
          <button onClick={handlePay} disabled={!scriptLoaded} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 transition disabled:opacity-50">
            {scriptLoaded ? 'Bayar Sekarang' : 'Memuat...'}
          </button>
        )}

        <div className="mt-8 p-6 bg-gray-50 rounded-xl text-left">
          <h3 className="font-semibold text-slate-800 mb-3">Detail Pesanan</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Produk</span><span className="font-medium">{order.product.nama} ({order.jumlah} pcs)</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Total</span><span className="font-bold text-emerald-600">Rp {order.totalHarga.toLocaleString('id-ID')}</span></div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-emerald-600' : order.paymentStatus === 'expired' ? 'text-red-500' : 'text-amber-600'}`}>
                {order.paymentStatus === 'paid' ? 'Lunas' : order.paymentStatus === 'expired' ? 'Kedaluwarsa' : 'Belum Dibayar'}
              </span>
            </div>
          </div>
        </div>
        <Link href="/store" className="inline-flex items-center px-6 py-2.5 border-2 border-emerald-500 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition mt-6">Belanja Lagi</Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return <Suspense fallback={<div className="text-center py-20">Memuat...</div>}><OrderSuccessContent /></Suspense>
}
