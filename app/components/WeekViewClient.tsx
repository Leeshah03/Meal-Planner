'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import WeekGrid from './WeekGrid'
import MealPicker from './MealPicker'
import { assignRecipeAction, clearDayAction } from '@/app/actions'
import type { WeekPlanEntry, Recipe } from '@/lib/types'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function formatWeekLabel(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface WeekViewClientProps {
  weekPlan: WeekPlanEntry[]
  recipes: Recipe[]
  weekStart: string
}

export default function WeekViewClient({ weekPlan, recipes, weekStart }: WeekViewClientProps) {
  const router = useRouter()
  const [pickerDay, setPickerDay] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleEdit = (day: number) => setPickerDay(day)
  const handleClose = () => setPickerDay(null)

  const handleSelect = (recipeId: string) => {
    if (pickerDay === null) return
    setPickerDay(null)
    startTransition(async () => {
      try {
        await assignRecipeAction(weekStart, pickerDay, recipeId)
      } catch {
        toast.error('Failed to assign recipe. Please try again.')
      }
    })
  }

  const handleClear = (day: number) => {
    startTransition(async () => {
      try {
        await clearDayAction(weekStart, day)
      } catch {
        toast.error('Failed to clear day. Please try again.')
      }
    })
  }

  const goToWeek = (offset: number) => {
    const newWeek = addDays(weekStart, offset * 7)
    router.push(`/?week=${newWeek}`)
  }

  return (
    <div>
      {/* Week navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => goToWeek(-1)}
          className="w-9 h-9 rounded-xl border flex items-center justify-center text-lg transition-colors"
          style={{ borderColor: 'var(--color-border)' }}
          aria-label="Previous week"
        >
          ‹
        </button>
        <span className="text-base font-semibold">Week of {formatWeekLabel(weekStart)}</span>
        <button
          onClick={() => goToWeek(1)}
          className="w-9 h-9 rounded-xl border flex items-center justify-center text-lg transition-colors"
          style={{ borderColor: 'var(--color-border)' }}
          aria-label="Next week"
        >
          ›
        </button>
      </div>

      {isPending && (
        <div className="text-center text-sm mb-3" style={{ color: 'var(--color-muted)' }}>
          Saving…
        </div>
      )}

      <WeekGrid
        weekPlan={weekPlan}
        weekStart={weekStart}
        onEdit={handleEdit}
        onClear={handleClear}
      />

      {pickerDay !== null && (
        <MealPicker
          recipes={recipes}
          dayName={DAY_NAMES[pickerDay]}
          onSelect={handleSelect}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
