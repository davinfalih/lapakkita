import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">LK</span></div>
              </Link>
              <span className="text-slate-300">|</span>
              <span className="font-semibold text-slate-800">{user.namaToko}</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/store" className="text-sm text-slate-500 hover:text-emerald-600 transition" target="_blank">Lihat Toko</Link>
              <Link href="/api/auth/logout" className="text-sm text-red-500 hover:text-red-600 transition">Keluar</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  )
}
