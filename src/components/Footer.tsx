import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LK</span>
              </div>
              <span className="text-xl font-bold">LapakKita</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Platform UMKM Indonesia. Membantu pelaku UMKM berjualan online dengan mudah.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Belanja</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/store" className="hover:text-emerald-400 transition">Semua Produk</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Jualan</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/register" className="hover:text-emerald-400 transition">Daftar Jadi Penjual</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 transition">Dashboard Penjual</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Bantuan</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-emerald-400 transition">Cara Berjualan</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition">Kebijakan Privasi</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} LapakKita. Platform UMKM Indonesia.
        </div>
      </div>
    </footer>
  )
}
