import { redirect } from 'next/navigation'
import VendorDashboard from '@/components/vendor/VendorDashboard'
import { getSession } from '@/lib/server/auth'

export default async function VendorPage() {
  const session = await getSession()

  if (!session.authenticated || !session.user) {
    redirect('/login')
  }

  if (session.user.role !== 'vendor') {
    redirect('/student')
  }

  return <VendorDashboard sessionUser={session.user} />
}
