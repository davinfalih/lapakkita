'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [form, setForm] = useState({ namaToko: '', email: '', password: '', noWhatsapp: '' })
  const [error, setError] = useState('')
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center"><span className="text-white font-bold">LK</span></div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Daftar Jadi Penjual</h1>
          <p className="text-slate-500 mt-1">Mulai jualan online dalam 1 menit!</p>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-6 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Nama Toko', name: 'namaToko', type: 'text', required: true, placeholder: 'Contoh: Toko Makmur Jaya' },
            { label: 'Email', name: 'email', type: 'email', required: true, placeholder: 'contoh@email.com' },
            { label: 'Password', name: 'password', type: 'password', required: true, placeholder: 'Minimal 6 karakter' },
            { label: 'No. WhatsApp', name: 'noWhatsapp', type: 'text', required: false, placeholder: '0812xxxxxxx (opsional)' },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}{f.required && <span className="text-red-500"> *</span>}</label>
              <input type={f.type} name={f.name} value={(form as any)[f.name]} onChange={handleChange} required={f.required} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" placeholder={f.placeholder} />
            </div>
          ))}
          <button type="submit" className="w-full bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-600 transition">Daftar Gratis</button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">Sudah punya akun?</p>
        <Link href="/login" className="w-full inline-flex items-center justify-center px-4 py-2.5 border-2 border-emerald-500 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition mt-3">Masuk</Link>
      </div>
    </div>
  )
}
