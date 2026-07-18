import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const currentUser = user

  async function updateSettings(formData: FormData) {
    'use server'
    const namaToko = formData.get('namaToko') as string
    const noWhatsapp = formData.get('noWhatsapp') as string
    const alamat = formData.get('alamat') as string
    await prisma.user.update({ where: { id: currentUser.id }, data: { namaToko, noWhatsapp, alamat } })
    revalidatePath('/dashboard/settings')
  }

  return (
    <>
      <Link href="/dashboard" className="text-sm text-slate-500 hover:text-emerald-600 transition mb-6 inline-block">&larr; Kembali ke Dashboard</Link>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Pengaturan Toko</h1>
        <form action={updateSettings} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Toko</label>
            <input type="text" name="namaToko" defaultValue={user.namaToko} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" value={user.email} disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50" />
            <p className="text-xs text-slate-400 mt-1">Email tidak bisa diubah</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">No. WhatsApp</label>
            <input type="text" name="noWhatsapp" defaultValue={user.noWhatsapp || ''} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" placeholder="0812xxxxxxx" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Toko</label>
            <textarea name="alamat" rows={3} defaultValue={user.alamat || ''} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" placeholder="Alamat lengkap toko"></textarea>
          </div>
          <button type="submit" className="bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-600 transition">Simpan Pengaturan</button>
        </form>
      </div>
    </>
  )
}
