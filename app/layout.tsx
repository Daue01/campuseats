import type { Metadata } from 'next'
import { DM_Sans, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { getSession } from '@/lib/server/auth'

const bodyFont = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CampusEats',
  description: 'CampusEats helps campus vendors sell smarter and helps students discover trusted products through a polished campus marketplace.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="min-h-screen bg-[#fff8f0] font-sans text-stone-900 antialiased">
        <ToastProvider>
          <Header sessionUser={session.user} />
          <main className="min-h-[calc(100vh-160px)]">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}
