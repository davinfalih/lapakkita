'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderCode = searchParams.get('orderCode')
  const snapToken = searchParams.get('snapToken')
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    if (!snapToken) return
    const script = document.createElement('script')
    script.src = `https://app.sandbox.midtrans.com/snap/snap.js`
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '')
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)
  }, [snapToken])

  function handlePay() {
    if (!snapToken || !(window as any).snap) return
    ;(window as any).snap.pay(snapToken, {
      onSuccess: () => router.push(`/order-success?order=${orderCode}`),
      onPending: () => router.push(`/order-success?order=${orderCode}`),
      onError: () => alert('Pembayaran gagal'),
    })
  }

  if (!orderCode) {
    return <div className="text-center py-20"><p className="text-slate-500">Tidak ada pesanan</p><Link href="/store" className="bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-600 transition inline-flex items-center mt-4">Lihat Produk</Link></div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Pesanan Dibuat!</h2>
      <p className="text-slate-500">Kode Pesanan: <strong className="text-slate-800">#{orderCode}</strong></p>
      <p className="text-slate-500 mb-6">Silakan selesaikan pembayaran</p>
      <button onClick={handlePay} disabled={!scriptLoaded} className="bg-emerald-500 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-600 transition text-lg disabled:opacity-50">
        {scriptLoaded ? 'Bayar Sekarang' : 'Memuat...'}
      </button>
      <p className="text-sm text-slate-400 mt-4">
        Atau nanti bayar lewat halaman <Link href={`/order-success?order=${orderCode}`} className="text-emerald-600 hover:underline">pesanan</Link>
      </p>
    </div>
  )
}

export default function CheckoutPage() {
  return <Suspense fallback={<div className="text-center py-20">Memuat...</div>}><CheckoutContent /></Suspense>
}
