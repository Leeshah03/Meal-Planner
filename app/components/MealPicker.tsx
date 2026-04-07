'use client'

import { useState } from 'react'
import type { Recipe } from '@/lib/types'

interface MealPickerProps {
  recipes: Recipe[]
  dayName: string
  onSelect: (recipeId: string) => void
  onClose: () => void
}

export default function MealPicker({ recipes, dayName, onSelect, onClose }: MealPickerProps) {
  const [query, setQuery] = useState('')

  const filtered = recipes.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-2xl p-6 pb-10 max-h-[80vh] overflow-y-auto"
        style={{ background: 'var(--color-card)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--color-border)' }} />
        <h2 className="text-lg font-bold mb-4">Pick dinner for {dayName}</h2>

        <input
          className="w-full px-3.5 py-2.5 border rounded-xl text-sm mb-4 outline-none"
          style={{ borderColor: 'var(--color-border)' }}
          placeholder="Search recipes…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />

        <div className="space-y-2">
          {filtered.length === 0 && (
            <p className="text-sm text-center py-6" style={{ color: 'var(--color-muted)' }}>
              No recipes found
            </p>
          )}
          {filtered.map(r => (
            <button
              key={r.id}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-colors"
              style={{ background: 'var(--color-bg)' }}
              onClick={() => onSelect(r.id)}
            >
              <span className="text-[15px] font-medium">{r.name}</span>
              {r.prep_time && (
                <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                  🕐 {r.prep_time} min
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
