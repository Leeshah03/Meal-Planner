import { describe, it, expect } from 'vitest'
import { computeShoppingList } from '@/lib/shopping-list'
import type { WeekPlanEntry, PantryItem } from '@/lib/types'

function makeEntry(day: number, recipeName: string, ingredients: { name: string; qty: number; unit: string }[]): WeekPlanEntry {
  return {
    id: `wp-${day}`,
    week_start: '2026-03-29',
    day,
    recipe_id: `r${day}`,
    recipes: {
      id: `r${day}`,
      name: recipeName,
      ingredients,
      prep_time: 20,
    },
  }
}

function makePantry(name: string, quantity: number, unit: string): PantryItem {
  return { id: `p-${name}`, name, quantity, unit }
}

describe('computeShoppingList', () => {
  it('1. case-insensitive exact match: pantry "spinach" matches recipe "Spinach" → haveAlready', () => {
    const weekPlan = [makeEntry(1, 'Salad', [{ name: 'Spinach', qty: 1, unit: 'cups' }])]
    const pantry = [makePantry('spinach', 2, 'cups')]
    const { haveAlready, toBuy } = computeShoppingList(weekPlan, pantry)
    expect(haveAlready).toHaveLength(1)
    expect(haveAlready[0].name).toBe('Spinach')
    expect(Object.values(toBuy).flat()).toHaveLength(0)
  })

  it('2. fuzzy match: pantry "Tomatoes" matches recipe "Tomatoe" (typo) → haveAlready', () => {
    const weekPlan = [makeEntry(1, 'Sauce', [{ name: 'Tomatoe', qty: 2, unit: 'cups' }])]
    const pantry = [makePantry('Tomatoes', 4, 'cups')]
    const { haveAlready, toBuy } = computeShoppingList(weekPlan, pantry)
    expect(haveAlready).toHaveLength(1)
    expect(haveAlready[0].name).toBe('Tomatoe')
    expect(Object.values(toBuy).flat()).toHaveLength(0)
  })

  it('3. no false match: pantry "Spinach" does NOT match recipe "Broccoli" → toBuy', () => {
    const weekPlan = [makeEntry(1, 'Stir Fry', [{ name: 'Broccoli', qty: 1, unit: 'head' }])]
    const pantry = [makePantry('Spinach', 2, 'cups')]
    const { haveAlready, toBuy } = computeShoppingList(weekPlan, pantry)
    expect(haveAlready).toHaveLength(0)
    const allToBuy = Object.values(toBuy).flat()
    expect(allToBuy).toHaveLength(1)
    expect(allToBuy[0].name).toBe('Broccoli')
  })

  it('4. quantity aggregation: two recipes both need "Tomatoes" qty 2 and 3 → toBuy has qty 5', () => {
    const weekPlan = [
      makeEntry(1, 'Pasta', [{ name: 'Tomatoes', qty: 2, unit: 'cups' }]),
      makeEntry(2, 'Sauce', [{ name: 'Tomatoes', qty: 3, unit: 'cups' }]),
    ]
    const pantry: PantryItem[] = []
    const { toBuy } = computeShoppingList(weekPlan, pantry)
    const allToBuy = Object.values(toBuy).flat()
    const tomatoes = allToBuy.find((i) => i.name === 'Tomatoes')
    expect(tomatoes).toBeDefined()
    expect(tomatoes?.qty).toBe(5)
  })

  it('5. empty week plan → empty result', () => {
    const { haveAlready, toBuy } = computeShoppingList([], [])
    expect(haveAlready).toHaveLength(0)
    expect(Object.values(toBuy).flat()).toHaveLength(0)
  })

  it('6. recipe with null recipes field is skipped gracefully', () => {
    const entry: WeekPlanEntry = {
      id: 'wp-unplanned',
      week_start: '2026-03-29',
      day: 3,
      recipe_id: null,
      recipes: null,
    }
    const { haveAlready, toBuy } = computeShoppingList([entry], [])
    expect(haveAlready).toHaveLength(0)
    expect(Object.values(toBuy).flat()).toHaveLength(0)
  })

  it('categorizes produce items into the Produce category', () => {
    const weekPlan = [makeEntry(1, 'Stir Fry', [{ name: 'broccoli', qty: 1, unit: 'head' }])]
    const { toBuy } = computeShoppingList(weekPlan, [])
    expect(toBuy['Produce']).toBeDefined()
    expect(toBuy['Produce']).toHaveLength(1)
    expect(toBuy['Produce'][0].name).toBe('broccoli')
  })

  it('categorizes unknown items into Pantry Staples', () => {
    const weekPlan = [makeEntry(1, 'Mystery', [{ name: 'unicorn dust', qty: 1, unit: 'pinch' }])]
    const { toBuy } = computeShoppingList(weekPlan, [])
    expect(toBuy['Pantry Staples']).toBeDefined()
    expect(toBuy['Pantry Staples'][0].name).toBe('unicorn dust')
  })

  it('categorizes dairy/protein items correctly', () => {
    const weekPlan = [makeEntry(1, 'Palak Paneer', [{ name: 'paneer', qty: 200, unit: 'g' }])]
    const { toBuy } = computeShoppingList(weekPlan, [])
    expect(toBuy['Dairy & Protein']).toBeDefined()
    expect(toBuy['Dairy & Protein'][0].name).toBe('paneer')
  })
})
