import { getPantryItems } from '@/lib/pantry'
import PantryClient from '../components/PantryClient'
import BottomNav from '../components/BottomNav'

export default async function PantryPage() {
  const items = await getPantryItems()

  return (
    <div>
      <main className="max-w-lg mx-auto px-4 pt-5">
        <PantryClient initialItems={items} />
      </main>
      <BottomNav />
    </div>
  )
}
