import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { status: 'active' },
    include: { user: { select: { namaToko: true } } },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient min-h-[600px] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-sm rounded-full font-medium mb-6">🇮🇩 Platform UMKM Indonesia</span>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                Mudah Jualan Online untuk <span className="text-yellow-300">UMKM</span>
              </h1>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                LapakKita membantu pelaku UMKM menjual produk dengan mudah. Cukup upload foto, nama, harga, dan stok — langsung jadi toko online!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="inline-flex items-center px-8 py-3.5 bg-white text-emerald-600 rounded-xl font-bold hover:bg-yellow-300 hover:text-slate-800 transition-all shadow-lg text-lg">
                  Mulai Jualan Gratis
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </Link>
                <Link href="/store" className="inline-flex items-center px-8 py-3.5 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all text-lg">Lihat Produk</Link>
              </div>
              <div className="flex gap-8 mt-10 text-white">
                <div><div className="text-3xl font-bold">100+</div><div className="text-white/70 text-sm">UMKM Aktif</div></div>
                <div><div className="text-3xl font-bold">500+</div><div className="text-white/70 text-sm">Produk Tersedia</div></div>
                <div><div className="text-3xl font-bold">1000+</div><div className="text-white/70 text-sm">Pembeli Puas</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Kenapa LapakKita?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">Semudah Itu Berjualan Online</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">Dibuat khusus untuk UMKM, tanpa ribet, tanpa pusing</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', title: 'Upload Simpel', desc: 'Cuma butuh foto, nama, harga, dan stok. Formulir super sederhana, nggak pake pusing!' },
              { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', title: 'Pembayaran QRIS', desc: 'Pembeli tinggal scan QRIS, pembayaran otomatis terdeteksi. Gampang dan cepat!' },
              { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Dashboard Lengkap', desc: 'Pantau produk, pesanan, dan pendapatan dari dashboard yang mudah dipahami.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm card-hover">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produk Terbaru */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Produk UMKM</span>
              <h2 className="text-3xl font-bold text-slate-800 mt-2">Produk Terbaru</h2>
            </div>
            <Link href="/store" className="btn-outline text-sm">Lihat Semua</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map(p => (
              <Link key={p.id} href={`/store/${p.id}`} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm card-hover group">
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img src={`/uploads/${p.foto}`} alt={p.nama} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition truncate">{p.nama}</h3>
                  <p className="text-sm text-slate-500 mt-1">{p.user.namaToko}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-emerald-600">Rp {p.harga.toLocaleString('id-ID')}</span>
                    <span className="text-xs text-slate-400">Stok: {p.stok}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Mulai Sekarang</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2 mb-4">Siap Kembangkan Usaha UMKM-mu?</h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">Daftar gratis, upload produk, dan mulai terima pesanan. Semua tanpa ribet!</p>
          <Link href="/register" className="btn-primary inline-flex items-center text-lg px-10 py-4">
            Daftar Gratis Sekarang
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </Link>
        </div>
      </section>
    </>
  )
}
