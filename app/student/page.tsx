import { redirect } from 'next/navigation'
import StudentDashboard from '@/components/student/StudentDashboard'
import { getSession } from '@/lib/server/auth'

export default async function StudentPage() {
  const session = await getSession()

  if (!session.authenticated || !session.user) {
    redirect('/login')
  }

  if (session.user.role === 'vendor') {
    redirect('/vendor')
  }

  return <StudentDashboard sessionUser={session.user} />
}
