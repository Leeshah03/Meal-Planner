'use client'

import { useState } from 'react'
import type { GroupedIngredient } from '@/lib/types'

interface ShoppingListProps {
  grouped: Record<string, GroupedIngredient[]>
  haveAlready: GroupedIngredient[]
}

export default function ShoppingList({ grouped, haveAlready }: ShoppingListProps) {
  const [bought, setBought] = useState<Set<string>>(new Set())

  const toggleBought = (key: string) => {
    setBought(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const hasItems = Object.values(grouped).some(items => items.length > 0)

  if (!hasItems && haveAlready.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--color-muted)' }}>
        <div className="text-4xl mb-3">🥗</div>
        <p>Plan some dinners first to generate your list</p>
      </div>
    )
  }

  return (
    <div>
      {Object.entries(grouped).map(([category, items]) => {
        if (items.length === 0) return null
        return (
          <div key={category} className="mb-6">
            <h3
              className="text-xs font-bold uppercase tracking-wide mb-2.5"
              style={{ color: 'var(--color-muted)' }}
            >
              {category}
            </h3>
            <div className="space-y-1.5">
              {items.map(item => {
                const key = item.name.toLowerCase()
                const isBought = bought.has(key)
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-opacity"
                    style={{
                      background: 'var(--color-card)',
                      borderColor: 'var(--color-border)',
                      opacity: isBought ? 0.5 : 1,
                    }}
                  >
                    <button
                      role="checkbox"
                      aria-checked={isBought}
                      aria-label={item.name}
                      onClick={() => toggleBought(key)}
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-white text-xs transition-colors"
                      style={{
                        borderColor: isBought ? 'var(--color-green)' : 'var(--color-green-mid)',
                        background: isBought ? 'var(--color-green)' : 'transparent',
                      }}
                    >
                      {isBought ? '✓' : ''}
                    </button>
                    <span
                      className="flex-1 text-[15px]"
                      style={{ textDecoration: isBought ? 'line-through' : 'none' }}
                    >
                      {item.name}
                    </span>
                    {item.qty > 0 && (
                      <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
                        {item.qty}{item.unit ? ` ${item.unit}` : ''}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {haveAlready.length > 0 && (
        <div className="mt-6 rounded-xl p-4" style={{ background: 'var(--color-amber-light)' }}>
          <h3
            className="text-xs font-bold uppercase tracking-wide mb-2.5"
            style={{ color: 'var(--color-amber)' }}
          >
            ✓ Already in your pantry
          </h3>
          <div className="space-y-1">
            {haveAlready.map(item => (
              <div key={item.name} className="text-sm py-1" style={{ color: '#7a6020' }}>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
