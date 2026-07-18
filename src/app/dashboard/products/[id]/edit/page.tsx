'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [form, setForm] = useState<any>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetch(`/api/products/${params.id}`).then(res => res.json()).then(setForm)
  }, [params.id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(''); setSuccess('')
    const fd = new FormData(e.currentTarget)
    const res = await fetch(`/api/products/${params.id}`, { method: 'PUT', body: fd })
    const data = await res.json()
    if (!res.ok) return setError(data.error)
    setSuccess('Produk berhasil diupdate!')
    setForm(data)
  }

  if (!form) return <div className="text-center py-20 text-slate-500">Memuat...</div>

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/dashboard/products" className="text-sm text-slate-500 hover:text-emerald-600 transition mb-6 inline-block">&larr; Kembali ke Produk</Link>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Edit Produk</h1>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-6 text-sm">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg p-3 mb-6 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <img src={`/uploads/${form.foto}`} className="w-24 h-24 rounded-lg object-cover bg-gray-100" alt="" />
            <input type="file" name="foto" accept="image/*" className="text-sm text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk</label>
            <input type="text" name="nama" defaultValue={form.nama} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Harga (Rp)</label>
              <input type="text" name="harga" defaultValue={form.harga.toLocaleString('id-ID')} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stok</label>
              <input type="number" name="stok" defaultValue={form.stok} required min={0} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <textarea name="deskripsi" rows={3} defaultValue={form.deskripsi} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <select name="kategori" defaultValue={form.kategori} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
                <option value="">Pilih</option>
                {['Makanan','Minuman','Kerajinan','Fashion','Aksesoris','Lainnya'].map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select name="status" defaultValue={form.status} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition">Simpan Perubahan</button>
        </form>
      </div>
    </div>
  )
}
