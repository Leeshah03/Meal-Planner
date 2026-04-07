import { getWeekPlan } from '@/lib/week-plan'
import { getPantryItems } from '@/lib/pantry'
import { computeShoppingList } from '@/lib/shopping-list'
import ShoppingList from '../components/ShoppingList'
import BottomNav from '../components/BottomNav'

function getSundayOfWeek(date: Date): string {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  return d.toISOString().split('T')[0]
}

export default async function ShoppingListPage() {
  const weekStart = getSundayOfWeek(new Date())

  const [weekPlan, pantryItems] = await Promise.all([
    getWeekPlan(weekStart),
    getPantryItems(),
  ])

  const { toBuy, haveAlready } = computeShoppingList(weekPlan, pantryItems)

  return (
    <div>
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 h-14 border-b"
        style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
      >
        <h1 className="text-lg font-bold">Shopping List</h1>
        <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
          This week · pantry-aware
        </span>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5">
        <ShoppingList grouped={toBuy} haveAlready={haveAlready} />
      </main>

      <BottomNav />
    </div>
  )
}
