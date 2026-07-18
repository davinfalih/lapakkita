import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [totalProduk, totalPesanan, totalPendapatan, totalStok, pesananBaru] = await Promise.all([
    prisma.product.count({ where: { userId: user.id } }),
    prisma.order.count({ where: { userId: user.id } }),
    prisma.order.aggregate({ where: { userId: user.id, paymentStatus: 'paid' }, _sum: { totalHarga: true } }),
    prisma.product.aggregate({ where: { userId: user.id }, _sum: { stok: true } }),
    prisma.order.count({ where: { userId: user.id, status: 'pending', paymentStatus: 'unpaid' } }),
  ])

  const recentProducts = await prisma.product.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const tabs = [
    { href: '/dashboard', label: 'Beranda', active: true },
    { href: '/dashboard/products', label: 'Produk', active: false },
    { href: '/dashboard/orders', label: 'Pesanan', active: false, badge: pesananBaru },
    { href: '/dashboard/settings', label: 'Pengaturan', active: false },
  ]

  return (
    <>
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm mb-8 overflow-x-auto">
        {tabs.map(t => (
          <Link key={t.href} href={t.href}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition flex items-center gap-1 ${t.active ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-gray-50'}`}>
            {t.label}
            {t.badge ? <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{t.badge}</span> : null}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Produk', value: totalProduk, color: 'emerald' },
          { label: 'Total Pesanan', value: totalPesanan, color: 'blue' },
          { label: 'Pendapatan', value: `Rp ${(totalPendapatan._sum.totalHarga || 0).toLocaleString('id-ID')}`, color: 'amber' },
          { label: 'Total Stok', value: totalStok._sum.stok || 0, color: 'purple' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link href="/dashboard/products/add" className="bg-emerald-500 rounded-2xl p-8 text-white card-hover">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            </div>
            <div><h3 className="text-xl font-bold">Tambah Produk Baru</h3><p className="text-white/80 text-sm mt-1">Upload foto, nama, harga, dan stok. Simpel!</p></div>
          </div>
        </Link>
        <Link href="/dashboard/orders" className="bg-slate-800 rounded-2xl p-8 text-white card-hover">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <div><h3 className="text-xl font-bold">Lihat Pesanan</h3><p className="text-white/80 text-sm mt-1">Pantau dan proses pesanan masuk</p></div>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Produk Terbaru</h3>
          <Link href="/dashboard/products" className="text-sm text-emerald-600 hover:underline">Lihat Semua</Link>
        </div>
        {recentProducts.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {recentProducts.map(p => (
              <div key={p.id} className="px-6 py-4 flex items-center gap-4">
                <img src={`/uploads/${p.foto}`} className="w-14 h-14 rounded-lg object-cover bg-gray-100" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-800 truncate">{p.nama}</h4>
                  <p className="text-sm text-slate-500">Rp {p.harga.toLocaleString('id-ID')} • Stok: {p.stok}</p>
                </div>
                <span className={`text-xs ${p.status === 'active' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'} px-2.5 py-1 rounded-full font-medium`}>
                  {p.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </span>
                <Link href={`/dashboard/products/${p.id}/edit`} className="text-sm text-emerald-600 hover:underline">Edit</Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500">Belum ada produk. Yuk mulai jualan!</p>
            <Link href="/dashboard/products/add" className="bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-600 transition inline-flex items-center mt-3">Tambah Produk</Link>
          </div>
        )}
      </div>
    </>
  )
}
