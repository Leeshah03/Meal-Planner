import { createClient } from '@/lib/supabase/server'
import { getWeekPlan } from '@/lib/week-plan'
import { getRecipes } from '@/lib/recipes'
import WeekViewClient from './components/WeekViewClient'
import BottomNav from './components/BottomNav'

function getSundayOfWeek(date: Date): string {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  return d.toISOString().split('T')[0]
}

interface PageProps {
  searchParams: Promise<{ week?: string }>
}

export default async function WeekPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const params = await searchParams
  const weekStart = params.week ?? getSundayOfWeek(new Date())

  const [weekPlan, recipes] = await Promise.all([
    getWeekPlan(weekStart),
    getRecipes(),
  ])

  return (
    <div>
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 h-14 border-b"
        style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2 font-bold text-lg" style={{ color: 'var(--color-green)' }}>
          🥗 Meal Planner
        </div>
        {user && (
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{user.email}</span>
        )}
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5">
        <WeekViewClient weekPlan={weekPlan} recipes={recipes} weekStart={weekStart} />
      </main>

      <BottomNav />
    </div>
  )
}
