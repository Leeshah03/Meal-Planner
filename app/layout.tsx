import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meal Planner',
  description: 'Weekly dinner planner with smart shopping list',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen pb-20">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
