import { createClient } from '@/lib/supabase/server'
import { withTimeout } from '@/lib/with-timeout'
import type { PantryItem } from '@/lib/types'

async function getUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { supabase, userId: user.id }
}

export async function getPantryItems(): Promise<PantryItem[]> {
  const supabase = await createClient()
  const { data, error } = await withTimeout(
    supabase.from('pantry').select('*').order('added_at', { ascending: false })
  )
  if (error) {
    console.error('getPantryItems error:', error)
    throw error
  }
  return data ?? []
}

export async function addPantryItem(
  name: string,
  qty: number,
  unit: string
): Promise<PantryItem> {
  const { supabase, userId } = await getUserId()
  const { data, error } = await withTimeout(
    supabase
      .from('pantry')
      .insert({ user_id: userId, name, quantity: qty, unit })
      .select()
      .single()
  )
  if (error) {
    console.error('addPantryItem error:', error)
    throw error
  }
  return data
}

export async function updateQuantity(
  id: string,
  delta: number
): Promise<PantryItem | null> {
  const supabase = await createClient()

  const { data: current, error: fetchError } = await withTimeout(
    supabase.from('pantry').select('*').eq('id', id).single()
  )
  if (fetchError) {
    console.error('updateQuantity fetch error:', fetchError)
    throw fetchError
  }

  const newQty = (current as PantryItem).quantity + delta

  if (newQty <= 0) {
    const { error: deleteError } = await withTimeout(
      supabase.from('pantry').delete().eq('id', id)
    )
    if (deleteError) {
      console.error('updateQuantity delete error:', deleteError)
      throw deleteError
    }
    return null
  }

  const { data: updated, error: updateError } = await withTimeout(
    supabase.from('pantry').update({ quantity: newQty }).eq('id', id).select().single()
  )
  if (updateError) {
    console.error('updateQuantity update error:', updateError)
    throw updateError
  }
  return updated
}

export async function deletePantryItem(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await withTimeout(
    supabase.from('pantry').delete().eq('id', id)
  )
  if (error) {
    console.error('deletePantryItem error:', error)
    throw error
  }
}
