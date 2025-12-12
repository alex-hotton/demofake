import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUsers, supabase } from './supabase'

vi.mock('./supabase', async (importOriginal) => {
  const mockSupabase = {
    from: vi.fn(() => ({
      select: vi.fn()
    }))
  }

  return {
    supabase: mockSupabase,
    getUsers: async () => {
      const { data, error } = await mockSupabase.from('users').select('*')
      if (error) throw error
      return data
    }
  }
})

describe('supabase module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUsers', () => {
    it('should return users data when query succeeds', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]

      supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: mockUsers, error: null })
      })

      const result = await getUsers()

      expect(supabase.from).toHaveBeenCalledWith('users')
      expect(result).toEqual(mockUsers)
    })

    it('should return empty array when no users exist', async () => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: [], error: null })
      })

      const result = await getUsers()

      expect(result).toEqual([])
    })

    it('should throw error when query fails', async () => {
      const mockError = new Error('Database error')

      supabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: null, error: mockError })
      })

      await expect(getUsers()).rejects.toThrow('Database error')
    })
  })
})
