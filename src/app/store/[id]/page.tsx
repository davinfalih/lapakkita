'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: number; nama: string; harga: number; stok: number; foto: string; deskripsi: string; kategori: string
  user: { namaToko: string; noWhatsapp: string | null; alamat: string | null }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    fetch(`/api/products/${params.id}`).then(res => res.json()).then(setProduct)
  }, [params.id])

  if (!product) return <div className="text-center py-20 text-slate-500">Memuat...</div>
  const currentProduct = product

  async function handleCheckout() {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: currentProduct.id,
        qty,
        pembeliNama: 'Pembeli',
        pembeliAlamat: 'Alamat',
        pembeliNoHp: '0812',
      }),
    })
    const data = await res.json()
    if (!res.ok) return alert(data.error)
    router.push(`/checkout?orderCode=${data.orderCode}&snapToken=${data.snapToken}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/store" className="text-sm text-slate-500 hover:text-emerald-600 transition mb-6 inline-block">&larr; Kembali ke Produk</Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          <img src={`/uploads/${product.foto}`} alt={product.nama} className="w-full aspect-square object-cover" />
        </div>
        <div>
          {product.kategori && <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-medium">{product.kategori}</span>}
          <h1 className="text-3xl font-bold text-slate-800 mt-3">{product.nama}</h1>
          <p className="text-slate-500 mt-1">{product.user.namaToko}</p>
          <div className="text-4xl font-bold text-emerald-600 mt-6">Rp {product.harga.toLocaleString('id-ID')}</div>
          <div className="mt-4"><span className="text-sm text-slate-500">Stok tersedia: <strong className="text-slate-800">{product.stok}</strong></span></div>
          {product.deskripsi && (
            <div className="mt-6">
              <h3 className="font-semibold text-slate-800 mb-2">Deskripsi</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{product.deskripsi}</p>
            </div>
          )}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 w-20">Jumlah:</label>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-slate-600 hover:bg-gray-50 transition">-</button>
                <input type="number" value={qty} readOnly className="w-16 text-center border-x border-gray-200 py-2" />
                <button type="button" onClick={() => setQty(Math.min(product.stok, qty + 1))} className="px-3 py-2 text-slate-600 hover:bg-gray-50 transition">+</button>
              </div>
            </div>
            <button onClick={handleCheckout} className="w-full bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-600 transition flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
