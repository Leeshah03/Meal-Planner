import { createClient } from '@/lib/supabase/server'
import { withTimeout } from '@/lib/with-timeout'
import type { Recipe, Ingredient } from '@/lib/types'

async function getUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { supabase, userId: user.id }
}

export async function getRecipes(): Promise<Recipe[]> {
  const supabase = await createClient()
  const { data, error } = await withTimeout(
    supabase.from('recipes').select('*').order('created_at', { ascending: false })
  )
  if (error) {
    console.error('getRecipes error:', error)
    throw error
  }
  return data ?? []
}

export async function createRecipe(input: {
  name: string
  ingredients: Ingredient[]
  prep_time: number | null
}): Promise<Recipe> {
  const { supabase, userId } = await getUserId()
  const { data, error } = await withTimeout(
    supabase
      .from('recipes')
      .insert({ ...input, user_id: userId })
      .select()
      .single()
  )
  if (error) {
    console.error('createRecipe error:', error)
    throw error
  }
  return data
}

export async function deleteRecipe(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await withTimeout(
    supabase.from('recipes').delete().eq('id', id)
  )
  if (error) {
    console.error('deleteRecipe error:', error)
    throw error
  }
}
