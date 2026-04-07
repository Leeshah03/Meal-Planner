'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import RecipeCard from './RecipeCard'
import AddRecipeForm from './AddRecipeForm'
import { createRecipeAction, deleteRecipeAction } from '@/app/actions'
import type { Recipe, Ingredient } from '@/lib/types'

interface RecipesClientProps {
  initialRecipes: Recipe[]
}

export default function RecipesClient({ initialRecipes }: RecipesClientProps) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSave = (data: { name: string; ingredients: Ingredient[]; prep_time: number | null }) => {
    setShowForm(false)
    startTransition(async () => {
      try {
        await createRecipeAction(data.name, data.ingredients, data.prep_time)
      } catch {
        toast.error('Failed to save recipe. Please try again.')
      }
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteRecipeAction(id)
      } catch {
        toast.error('Failed to delete recipe. Please try again.')
      }
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
          style={{ background: 'var(--color-green)' }}
          disabled={isPending}
        >
          + Add
        </button>
      </div>

      {showForm && (
        <AddRecipeForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}

      {initialRecipes.length === 0 && !showForm ? (
        <div className="text-center py-16" style={{ color: 'var(--color-muted)' }}>
          <div className="text-4xl mb-3">📖</div>
          <p>Add a recipe to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {initialRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
