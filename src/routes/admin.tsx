import { createFileRoute } from '@tanstack/react-router'
import { AuthProvider } from '@/contexts/AuthContext'
import { AdminDashboard } from '@/components/site/AdminDashboard'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  return (
    <AuthProvider>
      <AdminDashboard />
    </AuthProvider>
  )
}
