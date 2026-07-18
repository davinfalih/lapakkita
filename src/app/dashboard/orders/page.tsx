import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { Order, Product } from '@prisma/client'

type OrderWithProduct = Order & { product: Pick<Product, 'nama' | 'foto'> }

export default async function OrdersPage(props: { searchParams: Promise<{ filter?: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const { filter } = await props.searchParams

  const where: Record<string, unknown> = { userId: user.id }
  if (filter && filter !== 'all') where.status = filter

  const orders: OrderWithProduct[] = await prisma.order.findMany({
    where,
    include: { product: { select: { nama: true, foto: true } } },
    orderBy: { createdAt: 'desc' },
  })

  async function updateStatus(formData: FormData) {
    'use server'
    const id = parseInt(formData.get('id') as string)
    const status = formData.get('status') as string
    await prisma.order.update({ where: { id }, data: { status } })
    revalidatePath('/dashboard/orders')
  }

  return (
    <>
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm mb-8 overflow-x-auto">
        <Link href="/dashboard" className="px-5 py-2.5 rounded-lg font-medium text-sm text-slate-500 hover:text-slate-700 hover:bg-gray-50 transition">Beranda</Link>
        <Link href="/dashboard/products" className="px-5 py-2.5 rounded-lg font-medium text-sm text-slate-500 hover:text-slate-700 hover:bg-gray-50 transition">Produk</Link>
        <Link href="/dashboard/orders" className="px-5 py-2.5 rounded-lg font-medium text-sm bg-emerald-500 text-white transition">Pesanan</Link>
        <Link href="/dashboard/settings" className="px-5 py-2.5 rounded-lg font-medium text-sm text-slate-500 hover:text-slate-700 hover:bg-gray-50 transition">Pengaturan</Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Pesanan Masuk</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/orders" className={`text-sm px-3 py-1.5 rounded-lg ${!filter || filter === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border'}`}>Semua</Link>
          <Link href="/dashboard/orders?filter=pending" className={`text-sm px-3 py-1.5 rounded-lg ${filter === 'pending' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 border'}`}>Baru</Link>
          <Link href="/dashboard/orders?filter=paid" className={`text-sm px-3 py-1.5 rounded-lg ${filter === 'paid' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 border'}`}>Dibayar</Link>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img src={`/uploads/${o.product.foto}`} className="w-16 h-16 rounded-lg object-cover bg-gray-100" alt="" />
                  <div>
                    <h3 className="font-semibold text-slate-800">{o.product.nama}</h3>
                    <p className="text-sm text-slate-500">{o.pembeliNama} • {o.jumlah} pcs</p>
                    <p className="text-sm font-medium text-emerald-600 mt-1">Rp {o.totalHarga.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {o.paymentStatus === 'paid' ? 'Sudah Dibayar' : 'Belum Dibayar'}
                  </span>
                  <p className="text-xs text-slate-400 mt-2">#{o.orderCode}</p>
                </div>
              </div>
              {o.paymentStatus === 'paid' && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <form action={updateStatus} className="flex gap-2">
                    <input type="hidden" name="id" value={o.id} />
                    {o.status === 'paid' && <button name="status" value="processed" className="text-sm px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Proses</button>}
                    {o.status === 'processed' && <button name="status" value="shipped" className="text-sm px-4 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">Kirim</button>}
                    {o.status === 'shipped' && <button name="status" value="completed" className="text-sm px-4 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">Selesai</button>}
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-slate-500">Belum ada pesanan masuk</p>
        </div>
      )}
    </>
  )
}
