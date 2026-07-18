import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function StorePage(props: { searchParams: Promise<{ kategori?: string; search?: string }> }) {
  const { kategori, search } = await props.searchParams

  const where: any = { status: 'active' }
  if (kategori) where.kategori = kategori
  if (search) where.nama = { contains: search, mode: 'insensitive' }

  const products = await prisma.product.findMany({
    where,
    include: { user: { select: { namaToko: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const categories = ['Makanan', 'Minuman', 'Kerajinan', 'Fashion', 'Aksesoris', 'Lainnya']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Produk UMKM</h1>
          <p className="text-slate-500 mt-1">Belanja langsung dari UMKM Indonesia</p>
        </div>
        <form method="GET" className="flex gap-2">
          <input type="text" name="search" defaultValue={search || ''} placeholder="Cari produk..." className="w-full md:w-48 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
          <button type="submit" className="bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-600 transition">Cari</button>
        </form>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <Link href="/store" className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${!kategori ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border hover:bg-gray-50'}`}>Semua</Link>
        {categories.map(k => (
          <Link key={k} href={`/store?kategori=${k}`} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${kategori === k ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border hover:bg-gray-50'}`}>{k}</Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map(p => (
          <Link key={p.id} href={`/store/${p.id}`} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm card-hover group">
            <div className="aspect-square bg-gray-100 overflow-hidden">
              <img src={`/uploads/${p.foto}`} alt={p.nama} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
            </div>
            <div className="p-4">
              {p.kategori && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">{p.kategori}</span>}
              <h3 className="font-semibold text-slate-800 mt-2 group-hover:text-emerald-600 transition truncate">{p.nama}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{p.user.namaToko}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-emerald-600">Rp {p.harga.toLocaleString('id-ID')}</span>
                <span className="text-xs text-slate-400">Stok: {p.stok}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
