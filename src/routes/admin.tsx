import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboard } from '@/components/site/AdminDashboard'
import { AuthProvider } from '@/contexts/AuthContext'

function AdminPage() {
  return (
    <AuthProvider>
      <AdminDashboard />
    </AuthProvider>
  )
}

export const Route = createFileRoute('/admin')({
  component: AdminPage,
  head: () => ({
    meta: [{ title: 'Admin Dashboard — ShadesByMahiee' }],
  }),
})
