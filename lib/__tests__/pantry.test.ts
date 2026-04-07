import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { PantryItem } from '@/lib/types'

const mockFrom = vi.fn()
const mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } })
const mockClient = {
  from: mockFrom,
  auth: { getUser: mockGetUser },
}
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockClient)),
}))

const sampleItem: PantryItem = {
  id: 'p1',
  name: 'Spinach',
  quantity: 3,
  unit: 'cups',
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })
})

describe('getPantryItems', () => {
  it('returns all pantry items', async () => {
    const chain: Record<string, unknown> = {}
    chain['select'] = vi.fn(() => chain)
    chain['order'] = vi.fn().mockResolvedValue({ data: [sampleItem], error: null })
    mockFrom.mockReturnValue(chain)

    const { getPantryItems } = await import('@/lib/pantry')
    const result = await getPantryItems()
    expect(result).toEqual([sampleItem])
    expect(mockFrom).toHaveBeenCalledWith('pantry')
  })

  it('returns empty array when data is null', async () => {
    const chain: Record<string, unknown> = {}
    chain['select'] = vi.fn(() => chain)
    chain['order'] = vi.fn().mockResolvedValue({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    const { getPantryItems } = await import('@/lib/pantry')
    expect(await getPantryItems()).toEqual([])
  })

  it('throws on Supabase error', async () => {
    const chain: Record<string, unknown> = {}
    chain['select'] = vi.fn(() => chain)
    chain['order'] = vi.fn().mockResolvedValue({ data: null, error: new Error('DB error') })
    mockFrom.mockReturnValue(chain)

    const { getPantryItems } = await import('@/lib/pantry')
    await expect(getPantryItems()).rejects.toThrow('DB error')
  })
})

describe('addPantryItem', () => {
  it('inserts and returns the new pantry item', async () => {
    const chain: Record<string, unknown> = {}
    chain['insert'] = vi.fn(() => chain)
    chain['select'] = vi.fn(() => chain)
    chain['single'] = vi.fn().mockResolvedValue({ data: sampleItem, error: null })
    mockFrom.mockReturnValue(chain)

    const { addPantryItem } = await import('@/lib/pantry')
    const result = await addPantryItem('Spinach', 3, 'cups')
    expect(result).toEqual(sampleItem)
  })

  it('throws on Supabase error', async () => {
    const chain: Record<string, unknown> = {}
    chain['insert'] = vi.fn(() => chain)
    chain['select'] = vi.fn(() => chain)
    chain['single'] = vi.fn().mockResolvedValue({ data: null, error: new Error('Insert failed') })
    mockFrom.mockReturnValue(chain)

    const { addPantryItem } = await import('@/lib/pantry')
    await expect(addPantryItem('Spinach', 3, 'cups')).rejects.toThrow('Insert failed')
  })
})

describe('updateQuantity', () => {
  it('returns updated item when new quantity > 0', async () => {
    const updatedItem = { ...sampleItem, quantity: 4 }

    const selectChain: Record<string, unknown> = {}
    selectChain['select'] = vi.fn(() => selectChain)
    selectChain['eq'] = vi.fn(() => selectChain)
    selectChain['single'] = vi.fn().mockResolvedValue({ data: sampleItem, error: null })

    const updateChain: Record<string, unknown> = {}
    updateChain['update'] = vi.fn(() => updateChain)
    updateChain['eq'] = vi.fn(() => updateChain)
    updateChain['select'] = vi.fn(() => updateChain)
    updateChain['single'] = vi.fn().mockResolvedValue({ data: updatedItem, error: null })

    let callCount = 0
    mockFrom.mockImplementation(() => { callCount++; return callCount === 1 ? selectChain : updateChain })

    const { updateQuantity } = await import('@/lib/pantry')
    expect(await updateQuantity('p1', 1)).toEqual(updatedItem)
  })

  it('deletes item and returns null when new quantity <= 0', async () => {
    const lowItem = { ...sampleItem, quantity: 1 }

    const selectChain: Record<string, unknown> = {}
    selectChain['select'] = vi.fn(() => selectChain)
    selectChain['eq'] = vi.fn(() => selectChain)
    selectChain['single'] = vi.fn().mockResolvedValue({ data: lowItem, error: null })

    const deleteChain: Record<string, unknown> = {}
    deleteChain['delete'] = vi.fn(() => deleteChain)
    deleteChain['eq'] = vi.fn().mockResolvedValue({ data: null, error: null })

    let callCount = 0
    mockFrom.mockImplementation(() => { callCount++; return callCount === 1 ? selectChain : deleteChain })

    const { updateQuantity } = await import('@/lib/pantry')
    expect(await updateQuantity('p1', -1)).toBeNull()
  })

  it('throws on fetch error', async () => {
    const chain: Record<string, unknown> = {}
    chain['select'] = vi.fn(() => chain)
    chain['eq'] = vi.fn(() => chain)
    chain['single'] = vi.fn().mockResolvedValue({ data: null, error: new Error('Fetch failed') })
    mockFrom.mockReturnValue(chain)

    const { updateQuantity } = await import('@/lib/pantry')
    await expect(updateQuantity('p1', 1)).rejects.toThrow('Fetch failed')
  })
})

describe('deletePantryItem', () => {
  it('resolves without error', async () => {
    const chain: Record<string, unknown> = {}
    chain['delete'] = vi.fn(() => chain)
    chain['eq'] = vi.fn().mockResolvedValue({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    const { deletePantryItem } = await import('@/lib/pantry')
    await expect(deletePantryItem('p1')).resolves.toBeUndefined()
  })

  it('throws on Supabase error', async () => {
    const chain: Record<string, unknown> = {}
    chain['delete'] = vi.fn(() => chain)
    chain['eq'] = vi.fn().mockResolvedValue({ data: null, error: new Error('Delete failed') })
    mockFrom.mockReturnValue(chain)

    const { deletePantryItem } = await import('@/lib/pantry')
    await expect(deletePantryItem('p1')).rejects.toThrow('Delete failed')
  })
})
