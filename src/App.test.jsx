import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import App from './App'

vi.mock('./lib/supabase', () => ({
  getUsers: vi.fn()
}))

import { getUsers } from './lib/supabase'

describe('App component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    getUsers.mockResolvedValue([])
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initial render', () => {
    it('should render the title VIBECODING', async () => {
      await act(async () => {
        render(<App />)
      })

      expect(screen.getByText('VIBECODING')).toBeInTheDocument()
    })

    it('should render with initial vibe state START', async () => {
      await act(async () => {
        render(<App />)
      })

      expect(screen.getByText('START')).toBeInTheDocument()
    })

    it('should render click to vibe hint', async () => {
      await act(async () => {
        render(<App />)
      })

      expect(screen.getByText('click to vibe')).toBeInTheDocument()
    })

    it('should not display username when no users exist', async () => {
      getUsers.mockResolvedValue([])

      await act(async () => {
        render(<App />)
      })

      expect(screen.queryByText(/Hello/)).not.toBeInTheDocument()
    })
  })

  describe('User loading', () => {
    it('should display username when users exist', async () => {
      vi.useRealTimers()
      getUsers.mockResolvedValue([{ id: 1, name: 'TestUser' }])

      await act(async () => {
        render(<App />)
      })

      await waitFor(() => {
        expect(screen.getByText('Hello TestUser')).toBeInTheDocument()
      })
      vi.useFakeTimers()
    })

    it('should handle error when getUsers fails', async () => {
      vi.useRealTimers()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      getUsers.mockRejectedValue(new Error('API Error'))

      await act(async () => {
        render(<App />)
      })

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error loading user:', expect.any(Error))
      })

      consoleSpy.mockRestore()
      vi.useFakeTimers()
    })

    it('should call getUsers on mount', async () => {
      await act(async () => {
        render(<App />)
      })

      expect(getUsers).toHaveBeenCalledTimes(1)
    })
  })

  describe('Vibe level progression', () => {
    it('should progress through vibe states on click', async () => {
      await act(async () => {
        render(<App />)
      })

      const vibeIndicator = screen.getByText('START').closest('.vibe-indicator')

      expect(screen.getByText('START')).toBeInTheDocument()

      await act(async () => {
        fireEvent.click(vibeIndicator)
        vi.advanceTimersByTime(300)
      })
      expect(screen.getByText('FLOW')).toBeInTheDocument()

      await act(async () => {
        fireEvent.click(vibeIndicator)
        vi.advanceTimersByTime(300)
      })
      expect(screen.getByText('ZONE')).toBeInTheDocument()

      await act(async () => {
        fireEvent.click(vibeIndicator)
        vi.advanceTimersByTime(300)
      })
      expect(screen.getByText('DEEP')).toBeInTheDocument()

      await act(async () => {
        fireEvent.click(vibeIndicator)
        vi.advanceTimersByTime(300)
      })
      expect(screen.getByText('PEAK')).toBeInTheDocument()

      await act(async () => {
        fireEvent.click(vibeIndicator)
        vi.advanceTimersByTime(300)
      })
      expect(screen.getByText('TRANSCEND')).toBeInTheDocument()
    })

    it('should cycle back to START after TRANSCEND', async () => {
      await act(async () => {
        render(<App />)
      })

      const vibeIndicator = screen.getByText('START').closest('.vibe-indicator')

      for (let i = 0; i < 6; i++) {
        await act(async () => {
          fireEvent.click(vibeIndicator)
          vi.advanceTimersByTime(300)
        })
      }

      expect(screen.getByText('START')).toBeInTheDocument()
    })
  })

  describe('Animation states', () => {
    it('should add pulse class during animation', async () => {
      await act(async () => {
        render(<App />)
      })

      const vibeIndicator = screen.getByText('START').closest('.vibe-indicator')

      expect(vibeIndicator).not.toHaveClass('pulse')

      await act(async () => {
        fireEvent.click(vibeIndicator)
      })

      expect(vibeIndicator).toHaveClass('pulse')

      await act(async () => {
        vi.advanceTimersByTime(300)
      })

      expect(vibeIndicator).not.toHaveClass('pulse')
    })
  })

  describe('Quote display', () => {
    it('should show quote container after click', async () => {
      await act(async () => {
        render(<App />)
      })

      const vibeIndicator = screen.getByText('START').closest('.vibe-indicator')
      const quoteContainer = document.querySelector('.quote-container')

      expect(quoteContainer).not.toHaveClass('visible')

      await act(async () => {
        fireEvent.click(vibeIndicator)
      })

      expect(quoteContainer).toHaveClass('visible')
    })

    it('should hide quote container after 3 seconds', async () => {
      await act(async () => {
        render(<App />)
      })

      const vibeIndicator = screen.getByText('START').closest('.vibe-indicator')

      await act(async () => {
        fireEvent.click(vibeIndicator)
      })

      const quoteContainer = document.querySelector('.quote-container')
      expect(quoteContainer).toHaveClass('visible')

      await act(async () => {
        vi.advanceTimersByTime(3000)
      })

      expect(quoteContainer).not.toHaveClass('visible')
    })

    it('should display Rick Rubin image', async () => {
      await act(async () => {
        render(<App />)
      })

      const image = screen.getByAltText('Rick Rubin')
      expect(image).toBeInTheDocument()
    })

    it('should display quote author', async () => {
      await act(async () => {
        render(<App />)
      })

      expect(screen.getByText('Rick Rubin')).toBeInTheDocument()
    })
  })

  describe('Progress bar', () => {
    it('should have 0% progress at START', async () => {
      await act(async () => {
        render(<App />)
      })

      const progressFill = document.querySelector('.vibe-progress-fill')
      expect(progressFill.style.width).toBe('0%')
    })

    it('should increase progress with each vibe level', async () => {
      await act(async () => {
        render(<App />)
      })

      const vibeIndicator = screen.getByText('START').closest('.vibe-indicator')
      const progressFill = document.querySelector('.vibe-progress-fill')

      await act(async () => {
        fireEvent.click(vibeIndicator)
        vi.advanceTimersByTime(300)
      })
      expect(progressFill.style.width).toBe('20%')

      await act(async () => {
        fireEvent.click(vibeIndicator)
        vi.advanceTimersByTime(300)
      })
      expect(progressFill.style.width).toBe('40%')
    })

    it('should have 100% progress at TRANSCEND', async () => {
      await act(async () => {
        render(<App />)
      })

      const vibeIndicator = screen.getByText('START').closest('.vibe-indicator')

      for (let i = 0; i < 5; i++) {
        await act(async () => {
          fireEvent.click(vibeIndicator)
          vi.advanceTimersByTime(300)
        })
      }

      const progressFill = document.querySelector('.vibe-progress-fill')
      expect(progressFill.style.width).toBe('100%')
    })
  })

  describe('Vibe states styling', () => {
    it('should apply correct color for each vibe state', async () => {
      await act(async () => {
        render(<App />)
      })

      const vibeLabel = screen.getByText('START')
      expect(vibeLabel.style.color).toBe('rgb(51, 51, 51)')

      const vibeIndicator = vibeLabel.closest('.vibe-indicator')

      await act(async () => {
        fireEvent.click(vibeIndicator)
        vi.advanceTimersByTime(300)
      })

      const flowLabel = screen.getByText('FLOW')
      expect(flowLabel.style.color).toBe('rgb(99, 102, 241)')
    })
  })
})
