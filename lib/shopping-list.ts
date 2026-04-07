import Fuse from 'fuse.js'
import type { WeekPlanEntry, PantryItem, GroupedIngredient, ShoppingListResult } from './types'

const CATEGORIES: Record<string, string[]> = {
  Produce: [
    'tomato',
    'tomatoes',
    'spinach',
    'onion',
    'broccoli',
    'bell pepper',
    'basil',
    'cherry tomato',
    'garlic',
    'lemon',
  ],
  'Dairy & Protein': ['paneer', 'cream', 'tofu', 'eggs', 'cheese', 'yogurt'],
  'Pantry Staples': [], // catch-all
}

function getCategory(ingredientName: string): string {
  const lower = ingredientName.toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (category === 'Pantry Staples') continue
    if (keywords.some((kw) => lower.includes(kw))) {
      return category
    }
  }
  return 'Pantry Staples'
}

export function computeShoppingList(
  weekPlan: WeekPlanEntry[],
  pantry: PantryItem[]
): ShoppingListResult {
  // Step 1: Aggregate all ingredients from the week plan
  const aggregated = new Map<string, GroupedIngredient>()

  for (const entry of weekPlan) {
    if (!entry.recipes) continue
    for (const ingredient of entry.recipes.ingredients) {
      const key = ingredient.name.toLowerCase()
      if (aggregated.has(key)) {
        aggregated.get(key)!.qty += ingredient.qty
      } else {
        aggregated.set(key, { name: ingredient.name, qty: ingredient.qty, unit: ingredient.unit })
      }
    }
  }

  if (aggregated.size === 0) {
    return { toBuy: {}, haveAlready: [] }
  }

  // Step 2: Build Fuse index on pantry
  const fuse = new Fuse(pantry, {
    keys: ['name'],
    threshold: 0.2,
    includeScore: true,
  })

  // Step 3: Match each ingredient against pantry
  const haveAlready: GroupedIngredient[] = []
  const toBuyFlat: GroupedIngredient[] = []

  for (const ingredient of aggregated.values()) {
    const results = fuse.search(ingredient.name)
    if (results.length > 0) {
      haveAlready.push(ingredient)
    } else {
      toBuyFlat.push(ingredient)
    }
  }

  // Step 4: Group toBuy by category
  const toBuy: Record<string, GroupedIngredient[]> = {}
  for (const ingredient of toBuyFlat) {
    const category = getCategory(ingredient.name)
    if (!toBuy[category]) {
      toBuy[category] = []
    }
    toBuy[category].push(ingredient)
  }

  return { toBuy, haveAlready }
}
