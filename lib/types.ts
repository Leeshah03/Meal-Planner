export interface Ingredient {
  name: string
  qty: number
  unit: string
}

export interface Recipe {
  id: string
  name: string
  ingredients: Ingredient[]
  prep_time: number | null
}

export interface PantryItem {
  id: string
  name: string
  quantity: number
  unit: string
}

export interface WeekPlanEntry {
  id: string
  week_start: string
  day: number // 0 = Sun … 6 = Sat
  recipe_id: string | null
  recipes: Recipe | null
}

export interface GroupedIngredient {
  name: string
  qty: number
  unit: string
}

export interface ShoppingListResult {
  toBuy: Record<string, GroupedIngredient[]> // category → items
  haveAlready: GroupedIngredient[]
}
