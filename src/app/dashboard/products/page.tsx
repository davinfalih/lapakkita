import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ProductsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const products = await prisma.product.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm mb-8 overflow-x-auto">
        <Link href="/dashboard" className="px-5 py-2.5 rounded-lg font-medium text-sm text-slate-500 hover:text-slate-700 hover:bg-gray-50 transition">Beranda</Link>
        <Link href="/dashboard/products" className="px-5 py-2.5 rounded-lg font-medium text-sm bg-emerald-500 text-white transition">Produk</Link>
        <Link href="/dashboard/orders" className="px-5 py-2.5 rounded-lg font-medium text-sm text-slate-500 hover:text-slate-700 hover:bg-gray-50 transition">Pesanan</Link>
        <Link href="/dashboard/settings" className="px-5 py-2.5 rounded-lg font-medium text-sm text-slate-500 hover:text-slate-700 hover:bg-gray-50 transition">Pengaturan</Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold text-slate-800">Produk Saya</h1><p className="text-slate-500 text-sm mt-1">Kelola semua produk kamu di sini</p></div>
        <Link href="/dashboard/products/add" className="bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-600 transition inline-flex items-center">Tambah Produk</Link>
      </div>

      {products.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Produk</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Harga</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Stok</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Aksi</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={`/uploads/${p.foto}`} className="w-12 h-12 rounded-lg object-cover bg-gray-100" alt="" /><span className="font-medium text-slate-800">{p.nama}</span></div></td>
                  <td className="px-6 py-4 text-slate-700">Rp {p.harga.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4"><span className={p.stok > 0 ? 'text-slate-700' : 'text-red-500'}>{p.stok}</span></td>
                  <td className="px-6 py-4"><span className={`text-xs ${p.status === 'active' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'} px-2.5 py-1 rounded-full font-medium`}>{p.status === 'active' ? 'Aktif' : 'Nonaktif'}</span></td>
                  <td className="px-6 py-4"><div className="flex gap-2">
                    <Link href={`/dashboard/products/${p.id}/edit`} className="text-sm text-emerald-600 hover:underline">Edit</Link>
                    <button onClick={async () => { if (confirm('Hapus produk ini?')) await fetch(`/api/products/${p.id}`, { method: 'DELETE' }).then(() => window.location.reload()) }} className="text-sm text-red-500 hover:underline">Hapus</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-slate-500">Belum ada produk</p>
          <Link href="/dashboard/products/add" className="bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-600 transition inline-flex items-center mt-4">Tambah Produk</Link>
        </div>
      )}
    </>
  )
}
