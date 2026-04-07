import { describe, it, expect, beforeEach } from 'vitest'

describe('Supabase client', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  it('creates a browser client without throwing', async () => {
    const { createClient } = await import('../supabase/client')
    expect(() => createClient()).not.toThrow()
  })

  it('returns a client with auth and from methods', async () => {
    const { createClient } = await import('../supabase/client')
    const client = createClient()
    expect(client).toHaveProperty('auth')
    expect(client).toHaveProperty('from')
  })
})
