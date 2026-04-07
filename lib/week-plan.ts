import { createClient } from '@/lib/supabase/server'
import { withTimeout } from '@/lib/with-timeout'
import type { WeekPlanEntry } from '@/lib/types'

async function getUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { supabase, userId: user.id }
}

export async function getWeekPlan(weekStart: string): Promise<WeekPlanEntry[]> {
  const supabase = await createClient()
  const { data, error } = await withTimeout(
    supabase
      .from('week_plan')
      .select('*, recipes(*)')
      .eq('week_start', weekStart)
      .order('day')
  )
  if (error) {
    console.error('getWeekPlan error:', error)
    throw error
  }
  return data ?? []
}

export async function assignRecipe(
  weekStart: string,
  day: number,
  recipeId: string
): Promise<void> {
  const { supabase, userId } = await getUserId()
  const { error } = await withTimeout(
    supabase.from('week_plan').upsert(
      { user_id: userId, week_start: weekStart, day, recipe_id: recipeId },
      { onConflict: 'user_id,week_start,day' }
    )
  )
  if (error) {
    console.error('assignRecipe error:', error)
    throw error
  }
}

export async function clearDay(weekStart: string, day: number): Promise<void> {
  const supabase = await createClient()
  const { error } = await withTimeout(
    supabase
      .from('week_plan')
      .delete()
      .eq('week_start', weekStart)
      .eq('day', day)
  )
  if (error) {
    console.error('clearDay error:', error)
    throw error
  }
}
