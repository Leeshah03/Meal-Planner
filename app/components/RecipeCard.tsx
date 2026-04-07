'use client'

import type { Recipe } from '@/lib/types'

interface RecipeCardProps {
  recipe: Recipe
  onDelete: (id: string) => void
}

export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  return (
    <div
      className="rounded-xl border p-4 transition-shadow hover:shadow-md"
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
    >
      <div className="flex items-start justify-between mb-2.5">
        <span className="text-base font-semibold">{recipe.name}</span>
        <div className="flex items-center gap-2">
          {recipe.prep_time && (
            <span
              className="text-xs px-2 py-1 rounded-md"
              style={{ background: 'var(--color-bg)', color: 'var(--color-muted)' }}
            >
              🕐 {recipe.prep_time} min
            </span>
          )}
          <button
            aria-label={`Delete ${recipe.name}`}
            onClick={() => onDelete(recipe.id)}
            className="text-sm p-1 rounded transition-colors"
            style={{ color: 'var(--color-muted)' }}
          >
            🗑
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {recipe.ingredients.map((ing, i) => (
          <span
            key={i}
            className="text-xs px-2 py-1 rounded-md"
            style={{ background: 'var(--color-green-light)', color: 'var(--color-green)' }}
          >
            {ing.name}{ing.qty ? ` · ${ing.qty}${ing.unit ? ' ' + ing.unit : ''}` : ''}
          </span>
        ))}
      </div>
    </div>
  )
}
