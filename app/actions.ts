'use server'

import { revalidatePath } from 'next/cache'
import { createRecipe, deleteRecipe } from '@/lib/recipes'
import { assignRecipe, clearDay } from '@/lib/week-plan'
import { addPantryItem, updateQuantity, deletePantryItem } from '@/lib/pantry'
import type { Ingredient } from '@/lib/types'

export async function createRecipeAction(
  name: string,
  ingredients: Ingredient[],
  prepTime: number | null
) {
  try {
    await createRecipe({ name, ingredients, prep_time: prepTime })
    revalidatePath('/recipes')
    revalidatePath('/shopping-list')
  } catch (err) {
    console.error('createRecipeAction error:', err)
    throw err
  }
}

export async function deleteRecipeAction(id: string) {
  try {
    await deleteRecipe(id)
    revalidatePath('/recipes')
    revalidatePath('/shopping-list')
  } catch (err) {
    console.error('deleteRecipeAction error:', err)
    throw err
  }
}

export async function assignRecipeAction(weekStart: string, day: number, recipeId: string) {
  try {
    await assignRecipe(weekStart, day, recipeId)
    revalidatePath('/')
    revalidatePath('/shopping-list')
  } catch (err) {
    console.error('assignRecipeAction error:', err)
    throw err
  }
}

export async function clearDayAction(weekStart: string, day: number) {
  try {
    await clearDay(weekStart, day)
    revalidatePath('/')
    revalidatePath('/shopping-list')
  } catch (err) {
    console.error('clearDayAction error:', err)
    throw err
  }
}

export async function addPantryItemAction(name: string, qty: number, unit: string) {
  try {
    await addPantryItem(name, qty, unit)
    revalidatePath('/pantry')
    revalidatePath('/shopping-list')
  } catch (err) {
    console.error('addPantryItemAction error:', err)
    throw err
  }
}

export async function updateQuantityAction(id: string, delta: number) {
  try {
    await updateQuantity(id, delta)
    revalidatePath('/pantry')
    revalidatePath('/shopping-list')
  } catch (err) {
    console.error('updateQuantityAction error:', err)
    throw err
  }
}

export async function deletePantryItemAction(id: string) {
  try {
    await deletePantryItem(id)
    revalidatePath('/pantry')
    revalidatePath('/shopping-list')
  } catch (err) {
    console.error('deletePantryItemAction error:', err)
    throw err
  }
}
