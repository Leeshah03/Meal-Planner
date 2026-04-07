'use client'

import type { WeekPlanEntry } from '@/lib/types'

interface WeekGridProps {
  weekPlan: WeekPlanEntry[]
  weekStart: string
  onEdit: (day: number) => void
  onClear: (day: number) => void
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function WeekGrid({ weekPlan, weekStart, onEdit, onClear }: WeekGridProps) {
  const start = new Date(weekStart + 'T00:00:00')
  const today = new Date().toDateString()

  const planByDay = Object.fromEntries(weekPlan.map(e => [e.day, e]))

  return (
    <div className="space-y-2.5">
      {DAY_NAMES.map((name, i) => {
        const d = new Date(start)
        d.setDate(d.getDate() + i)
        const entry = planByDay[i]
        const recipe = entry?.recipes ?? null
        const isToday = d.toDateString() === today

        return (
          <article
            key={i}
            className="flex items-center gap-3.5 bg-white rounded-xl border px-4 py-3.5 transition-shadow hover:shadow-md"
            style={{
              borderColor: recipe ? 'var(--color-green)' : 'var(--color-border)',
              borderLeftWidth: recipe ? '4px' : '1px',
            }}
          >
            {/* Day label */}
            <div className="min-w-[42px] text-center">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
                {name}
              </div>
              <div
                className="text-xl font-bold leading-tight"
                style={{ color: isToday ? 'var(--color-green)' : 'inherit' }}
              >
                {d.getDate()}
              </div>
            </div>

            {/* Meal info */}
            <div className="flex-1">
              {recipe ? (
                <>
                  <div className="text-[15px] font-medium">{recipe.name}</div>
                  {recipe.prep_time && (
                    <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                      🕐 {recipe.prep_time} min
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm italic" style={{ color: 'var(--color-muted)' }}>
                  Tap to add dinner
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-1.5">
              <button
                aria-label={`Edit ${name}`}
                onClick={() => onEdit(i)}
                className="p-1 rounded-md text-lg transition-colors hover:bg-[var(--color-green-light)]"
                style={{ color: 'var(--color-muted)' }}
              >
                ✏️
              </button>
              {recipe && (
                <button
                  aria-label={`Clear ${name}`}
                  onClick={() => onClear(i)}
                  className="p-1 rounded-md text-lg transition-colors"
                  style={{ color: 'var(--color-muted)' }}
                >
                  ✕
                </button>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
