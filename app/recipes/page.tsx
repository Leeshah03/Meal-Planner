import { getRecipes } from '@/lib/recipes'
import RecipesClient from '../components/RecipesClient'
import BottomNav from '../components/BottomNav'

export default async function RecipesPage() {
  const recipes = await getRecipes()

  return (
    <div>
      <main className="max-w-lg mx-auto px-4 pt-5">
        <RecipesClient initialRecipes={recipes} />
      </main>
      <BottomNav />
    </div>
  )
}
