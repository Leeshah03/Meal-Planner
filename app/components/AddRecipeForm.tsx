'use client'

import { useState } from 'react'
import type { Ingredient } from '@/lib/types'

interface AddRecipeFormProps {
  onSave: (data: { name: string; ingredients: Ingredient[]; prep_time: number | null }) => void
  onCancel: () => void
}

const emptyIngredient = (): Ingredient => ({ name: '', qty: 0, unit: '' })

export default function AddRecipeForm({ onSave, onCancel }: AddRecipeFormProps) {
  const [name, setName] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([emptyIngredient()])

  const updateIngredient = (i: number, field: keyof Ingredient, value: string | number) => {
    setIngredients(prev => prev.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing))
  }

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      ingredients: ingredients.filter(i => i.name.trim()),
      prep_time: prepTime ? parseInt(prepTime) : null,
    })
  }

  return (
    <div
      className="rounded-xl border-2 border-dashed p-5 mb-4"
      style={{ borderColor: 'var(--color-green-mid)', background: 'var(--color-card)' }}
    >
      {/* Name */}
      <div className="mb-3.5">
        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-muted)' }}>
          Recipe Name
        </label>
        <input
          aria-label="Recipe name"
          className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
          style={{ borderColor: 'var(--color-border)' }}
          placeholder="e.g. Dal Tadka"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      {/* Prep time */}
      <div className="mb-3.5">
        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-muted)' }}>
          Prep Time (mins)
        </label>
        <input
          aria-label="Prep time"
          className="w-24 px-3 py-2 border rounded-lg text-sm outline-none"
          style={{ borderColor: 'var(--color-border)' }}
          type="number"
          placeholder="30"
          value={prepTime}
          onChange={e => setPrepTime(e.target.value)}
        />
      </div>

      {/* Ingredients */}
      <div className="mb-3.5">
        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-muted)' }}>
          Ingredients
        </label>
        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2">
              <input
                aria-label={`Ingredient ${i + 1} name`}
                className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none"
                style={{ borderColor: 'var(--color-border)' }}
                placeholder="Ingredient"
                value={ing.name}
                onChange={e => updateIngredient(i, 'name', e.target.value)}
              />
              <input
                aria-label={`Ingredient ${i + 1} quantity`}
                className="w-20 px-3 py-2 border rounded-lg text-sm outline-none"
                style={{ borderColor: 'var(--color-border)' }}
                type="number"
                placeholder="Qty"
                value={ing.qty || ''}
                onChange={e => updateIngredient(i, 'qty', parseFloat(e.target.value) || 0)}
              />
              <input
                aria-label={`Ingredient ${i + 1} unit`}
                className="w-16 px-3 py-2 border rounded-lg text-sm outline-none"
                style={{ borderColor: 'var(--color-border)' }}
                placeholder="Unit"
                value={ing.unit}
                onChange={e => updateIngredient(i, 'unit', e.target.value)}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIngredients(prev => [...prev, emptyIngredient()])}
          className="mt-2 text-sm font-semibold px-3 py-1.5 rounded-lg"
          style={{ background: 'var(--color-green-light)', color: 'var(--color-green)' }}
        >
          + Add ingredient
        </button>
      </div>

      <div className="flex gap-2.5 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm border"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'var(--color-green)' }}
        >
          Save Recipe
        </button>
      </div>
    </div>
  )
}
