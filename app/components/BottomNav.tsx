'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'Week', icon: '📅' },
  { href: '/recipes', label: 'Recipes', icon: '📖' },
  { href: '/pantry', label: 'Pantry', icon: '🧺' },
  { href: '/shopping-list', label: 'Shopping', icon: '🛒' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex border-t z-50"
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
    >
      {tabs.map(tab => {
        const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[11px] font-medium transition-colors"
            style={{ color: active ? 'var(--color-green)' : 'var(--color-muted)' }}
          >
            <span className="text-[22px] leading-none">{tab.icon}</span>
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
