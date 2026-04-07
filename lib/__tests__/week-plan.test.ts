import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { WeekPlanEntry } from '@/lib/types'

const mockFrom = vi.fn()
const mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } })
const mockClient = {
  from: mockFrom,
  auth: { getUser: mockGetUser },
}
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockClient)),
}))

const sampleEntry: WeekPlanEntry = {
  id: 'wp1',
  week_start: '2026-03-29',
  day: 1,
  recipe_id: 'r1',
  recipes: {
    id: 'r1',
    name: 'Pasta',
    ingredients: [{ name: 'Tomatoes', qty: 2, unit: 'cups' }],
    prep_time: 20,
  },
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })
})

describe('getWeekPlan', () => {
  it('returns week plan entries joined with recipes', async () => {
    const chain: Record<string, unknown> = {}
    chain['select'] = vi.fn(() => chain)
    chain['eq'] = vi.fn(() => chain)
    chain['order'] = vi.fn().mockResolvedValue({ data: [sampleEntry], error: null })
    mockFrom.mockReturnValue(chain)

    const { getWeekPlan } = await import('@/lib/week-plan')
    const result = await getWeekPlan('2026-03-29')
    expect(result).toEqual([sampleEntry])
    expect(mockFrom).toHaveBeenCalledWith('week_plan')
    expect(chain['select']).toHaveBeenCalledWith('*, recipes(*)')
  })

  it('returns empty array when data is null', async () => {
    const chain: Record<string, unknown> = {}
    chain['select'] = vi.fn(() => chain)
    chain['eq'] = vi.fn(() => chain)
    chain['order'] = vi.fn().mockResolvedValue({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    const { getWeekPlan } = await import('@/lib/week-plan')
    expect(await getWeekPlan('2026-03-29')).toEqual([])
  })

  it('throws on Supabase error', async () => {
    const chain: Record<string, unknown> = {}
    chain['select'] = vi.fn(() => chain)
    chain['eq'] = vi.fn(() => chain)
    chain['order'] = vi.fn().mockResolvedValue({ data: null, error: new Error('Query failed') })
    mockFrom.mockReturnValue(chain)

    const { getWeekPlan } = await import('@/lib/week-plan')
    await expect(getWeekPlan('2026-03-29')).rejects.toThrow('Query failed')
  })
})

describe('assignRecipe', () => {
  it('upserts the recipe assignment', async () => {
    const chain: Record<string, unknown> = {}
    chain['upsert'] = vi.fn().mockResolvedValue({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    const { assignRecipe } = await import('@/lib/week-plan')
    await expect(assignRecipe('2026-03-29', 1, 'r1')).resolves.toBeUndefined()
    expect(mockFrom).toHaveBeenCalledWith('week_plan')
  })

  it('throws on Supabase error', async () => {
    const chain: Record<string, unknown> = {}
    chain['upsert'] = vi.fn().mockResolvedValue({ data: null, error: new Error('Upsert failed') })
    mockFrom.mockReturnValue(chain)

    const { assignRecipe } = await import('@/lib/week-plan')
    await expect(assignRecipe('2026-03-29', 1, 'r1')).rejects.toThrow('Upsert failed')
  })
})

describe('clearDay', () => {
  it('deletes the entry for the given week_start and day', async () => {
    const chain: Record<string, unknown> = {}
    chain['delete'] = vi.fn(() => chain)
    let callCount = 0
    chain['eq'] = vi.fn(() => {
      callCount++
      if (callCount === 2) return Promise.resolve({ data: null, error: null })
      return chain
    })
    mockFrom.mockReturnValue(chain)

    const { clearDay } = await import('@/lib/week-plan')
    await expect(clearDay('2026-03-29', 1)).resolves.toBeUndefined()
  })

  it('throws on Supabase error', async () => {
    const chain: Record<string, unknown> = {}
    chain['delete'] = vi.fn(() => chain)
    let callCount = 0
    chain['eq'] = vi.fn(() => {
      callCount++
      if (callCount === 2) return Promise.resolve({ data: null, error: new Error('Delete failed') })
      return chain
    })
    mockFrom.mockReturnValue(chain)

    const { clearDay } = await import('@/lib/week-plan')
    await expect(clearDay('2026-03-29', 1)).rejects.toThrow('Delete failed')
  })
})
