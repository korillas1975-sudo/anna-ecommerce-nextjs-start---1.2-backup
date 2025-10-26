import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminTopBar from '@/components/admin/AdminTopBar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
    redirect('/auth/login?from=%2Fadmin')
  }
  return (
    <div className="admin-surface">
      <AdminTopBar />
      {children}
    </div>
  )
}
