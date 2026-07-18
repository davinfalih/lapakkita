'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [loggedIn, setLoggedIn] = useState(false)
  const isDashboard = pathname.startsWith('/dashboard')

  useEffect(() => {
    setLoggedIn(!!document.cookie.includes('token='))
  }, [pathname])

  if (isDashboard) return null

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LK</span>
            </div>
            <span className="text-xl font-bold text-slate-800">LapakKita</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-600 hover:text-emerald-600 font-medium transition">Beranda</Link>
            <Link href="/store" className="text-slate-600 hover:text-emerald-600 font-medium transition">Produk</Link>
          </div>
          <div className="flex items-center gap-3">
            {loggedIn ? (
              <>
                <Link href="/dashboard" className="btn-primary text-sm">Dashboard</Link>
                <Link href="/api/auth/logout" className="text-sm text-red-500 hover:text-red-600 transition">Keluar</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition">Masuk</Link>
                <Link href="/register" className="btn-primary text-sm">Daftar Jadi Penjual</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
