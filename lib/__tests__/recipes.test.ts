import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Recipe } from '@/lib/types'

const mockFrom = vi.fn()
const mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } })
const mockClient = {
  from: mockFrom,
  auth: { getUser: mockGetUser },
}
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockClient)),
}))

// select → returns chain; order is the terminal resolver
function makeChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'insert', 'delete', 'eq', 'single', 'order']
  methods.forEach((m) => { chain[m] = vi.fn(() => chain) })
  ;(chain['order'] as ReturnType<typeof vi.fn>).mockResolvedValue(result)
  ;(chain['single'] as ReturnType<typeof vi.fn>).mockResolvedValue(result)
  ;(chain['eq'] as ReturnType<typeof vi.fn>).mockResolvedValue(result)
  return chain
}

const sampleRecipe: Recipe = {
  id: 'r1',
  name: 'Pasta',
  ingredients: [{ name: 'Tomatoes', qty: 2, unit: 'cups' }],
  prep_time: 20,
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })
})

describe('getRecipes', () => {
  it('returns an array of recipes on success', async () => {
    const chain = makeChain({ data: [sampleRecipe], error: null })
    mockFrom.mockReturnValue(chain)
    const { getRecipes } = await import('@/lib/recipes')
    const result = await getRecipes()
    expect(result).toEqual([sampleRecipe])
    expect(mockFrom).toHaveBeenCalledWith('recipes')
  })

  it('returns empty array when data is null', async () => {
    const chain = makeChain({ data: null, error: null })
    mockFrom.mockReturnValue(chain)
    const { getRecipes } = await import('@/lib/recipes')
    expect(await getRecipes()).toEqual([])
  })

  it('throws when Supabase returns an error', async () => {
    const chain = makeChain({ data: null, error: new Error('DB error') })
    mockFrom.mockReturnValue(chain)
    const { getRecipes } = await import('@/lib/recipes')
    await expect(getRecipes()).rejects.toThrow('DB error')
  })
})

describe('createRecipe', () => {
  it('returns the created recipe on success', async () => {
    const chain: Record<string, unknown> = {}
    chain['insert'] = vi.fn(() => chain)
    chain['select'] = vi.fn(() => chain)
    chain['single'] = vi.fn().mockResolvedValue({ data: sampleRecipe, error: null })
    mockFrom.mockReturnValue(chain)

    const { createRecipe } = await import('@/lib/recipes')
    const result = await createRecipe({
      name: 'Pasta',
      ingredients: [{ name: 'Tomatoes', qty: 2, unit: 'cups' }],
      prep_time: 20,
    })
    expect(result).toEqual(sampleRecipe)
  })

  it('throws when Supabase returns an error', async () => {
    const chain: Record<string, unknown> = {}
    chain['insert'] = vi.fn(() => chain)
    chain['select'] = vi.fn(() => chain)
    chain['single'] = vi.fn().mockResolvedValue({ data: null, error: new Error('Insert failed') })
    mockFrom.mockReturnValue(chain)

    const { createRecipe } = await import('@/lib/recipes')
    await expect(
      createRecipe({ name: 'Pasta', ingredients: [], prep_time: null })
    ).rejects.toThrow('Insert failed')
  })
})

describe('deleteRecipe', () => {
  it('resolves without error on success', async () => {
    const chain: Record<string, unknown> = {}
    chain['delete'] = vi.fn(() => chain)
    chain['eq'] = vi.fn().mockResolvedValue({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    const { deleteRecipe } = await import('@/lib/recipes')
    await expect(deleteRecipe('r1')).resolves.toBeUndefined()
  })

  it('throws when Supabase returns an error', async () => {
    const chain: Record<string, unknown> = {}
    chain['delete'] = vi.fn(() => chain)
    chain['eq'] = vi.fn().mockResolvedValue({ data: null, error: new Error('Delete failed') })
    mockFrom.mockReturnValue(chain)

    const { deleteRecipe } = await import('@/lib/recipes')
    await expect(deleteRecipe('r1')).rejects.toThrow('Delete failed')
  })
})
