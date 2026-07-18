'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddProductPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [harga, setHarga] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess('')
    const form = new FormData(e.currentTarget)
    const res = await fetch('/api/products', { method: 'POST', body: form })
    const data = await res.json()
    if (!res.ok) return setError(data.error)
    setSuccess('Produk berhasil ditambahkan!')
    setTimeout(() => router.push('/dashboard/products'), 1000)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/dashboard" className="text-sm text-slate-500 hover:text-emerald-600 transition mb-6 inline-block">&larr; Kembali ke Dashboard</Link>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Tambah Produk Baru</h1>
        <p className="text-slate-500 text-sm mb-8">Cukup isi 4 hal penting. Simpel!</p>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-6 text-sm">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg p-3 mb-6 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Foto Produk <span className="text-red-500">*</span></label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-emerald-400 transition cursor-pointer"
              onClick={() => document.getElementById('foto-input')?.click()}>
              {preview ? (
                <img src={preview} className="w-48 h-48 object-cover rounded-lg mx-auto" alt="" />
              ) : (
                <><svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <p className="text-sm text-slate-500">Klik atau tarik foto produk di sini</p>
                <p className="text-xs text-slate-400 mt-1">Format: JPG, PNG, WebP</p></>
              )}
              <input id="foto-input" type="file" name="foto" accept="image/*" className="hidden" required
                onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setPreview(ev.target?.result as string); r.readAsDataURL(f) } }} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk <span className="text-red-500">*</span></label>
              <input type="text" name="nama" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-lg" placeholder="Contoh: Kerajinan Tangan Bambu" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Harga (Rp) <span className="text-red-500">*</span></label>
              <input type="text" name="harga" required value={harga} onChange={e => setHarga(e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-lg" placeholder="50.000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Stok <span className="text-red-500">*</span></label>
              <input type="number" name="stok" required min={0} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-lg" placeholder="10" />
            </div>
          </div>

          <details className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <summary className="text-sm font-medium text-slate-600 cursor-pointer hover:text-emerald-600 transition">
              <svg className="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Pengaturan Lanjutan (opsional)
            </summary>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Produk</label>
                <textarea name="deskripsi" rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" placeholder="Ceritakan tentang produk kamu..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                <select name="kategori" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
                  <option value="">Pilih kategori</option>
                  {['Makanan','Minuman','Kerajinan','Fashion','Aksesoris','Lainnya'].map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            </div>
          </details>

          <button type="submit" className="w-full bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            Simpan Produk
          </button>
        </form>
      </div>
    </div>
  )
}
