import { renderHook, act, waitFor } from '@testing-library/react'
import { useToast } from '../../hooks/useToast'
import { TOAST_DURATION } from '../../constants'

// Suppress act() warnings from fake timer state updates
const originalError = console.error
beforeAll(() => {
  console.error = jest.fn((...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Not wrapped in act')) return
    originalError(...args)
  })
})
afterAll(() => {
  console.error = originalError
})

describe('useToast Hook', () => {
  beforeEach(() => {
    jest.clearAllTimers()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('Basic Functionality', () => {
    it('should initialize with null toast', () => {
      const { result } = renderHook(() => useToast())
      expect(result.current.toast).toBeNull()
    })

    it('should show a toast with showToast', () => {
      const { result } = renderHook(() => useToast())
      const toastData = { message: 'Test message', type: 'success' }

      act(() => {
        result.current.showToast(toastData)
      })

      expect(result.current.toast).toEqual(toastData)
    })

    it('should close toast with closeToast', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showToast({ message: 'Test' })
      })

      expect(result.current.toast).not.toBeNull()

      act(() => {
        result.current.closeToast()
      })

      expect(result.current.toast).toBeNull()
    })
  })

  describe('Auto-dismiss Functionality', () => {
    it('should auto-dismiss toast after default duration', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showToast({ message: 'Test message' })
      })

      expect(result.current.toast).not.toBeNull()

      act(() => {
        jest.advanceTimersByTime(TOAST_DURATION)
      })

      expect(result.current.toast).toBeNull()
    })

    it('should auto-dismiss toast after custom duration', () => {
      const { result } = renderHook(() => useToast())
      const customDuration = 2000

      act(() => {
        result.current.showToast({ message: 'Test' }, customDuration)
      })

      expect(result.current.toast).not.toBeNull()

      act(() => {
        jest.advanceTimersByTime(customDuration)
      })

      expect(result.current.toast).toBeNull()
    })

    it('should not auto-dismiss when duration is 0', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showToast({ message: 'Test' }, 0)
      })

      expect(result.current.toast).not.toBeNull()

      act(() => {
        jest.advanceTimersByTime(TOAST_DURATION * 2)
      })

      expect(result.current.toast).not.toBeNull()
    })

    it('should clear pending timer when showing new toast', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showToast({ message: 'First' })
      })

      act(() => {
        jest.advanceTimersByTime(TOAST_DURATION / 2)
      })

      const firstToast = result.current.toast

      act(() => {
        result.current.showToast({ message: 'Second' })
      })

      expect(result.current.toast.message).toBe('Second')

      act(() => {
        jest.advanceTimersByTime(TOAST_DURATION)
      })

      expect(result.current.toast).toBeNull()
    })

    it('should clear timer when closeToast is called', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showToast({ message: 'Test' })
      })

      act(() => {
        result.current.closeToast()
      })

      expect(result.current.toast).toBeNull()

      act(() => {
        jest.advanceTimersByTime(TOAST_DURATION)
      })

      expect(result.current.toast).toBeNull()
    })
  })

  describe('Convenience Methods', () => {
    it('should show success toast with showSuccess', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showSuccess('Operation successful')
      })

      expect(result.current.toast).toEqual({
        message: 'Operation successful',
        type: 'success',
      })
    })

    it('should show error toast with showError', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showError('An error occurred')
      })

      expect(result.current.toast).toEqual({
        message: 'An error occurred',
        type: 'error',
      })
    })

    it('should show info toast with showInfo', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showInfo('Information message')
      })

      expect(result.current.toast).toEqual({
        message: 'Information message',
        type: 'info',
      })
    })

    it('should merge options with convenience methods', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showSuccess('Saved', { id: '123' })
      })

      expect(result.current.toast).toEqual({
        message: 'Saved',
        type: 'success',
        id: '123',
      })
    })
  })

  describe('Toast Data Options', () => {
    it('should support previewColors option', () => {
      const { result } = renderHook(() => useToast())
      const colors = ['#FF0000', '#00FF00', '#0000FF']

      act(() => {
        result.current.showToast({
          message: 'Colors preview',
          previewColors: colors,
        })
      })

      expect(result.current.toast.previewColors).toEqual(colors)
    })

    it('should support actionLabel option', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showToast({
          message: 'Undo available',
          actionLabel: 'Undo',
          id: '123',
        })
      })

      expect(result.current.toast.actionLabel).toBe('Undo')
      expect(result.current.toast.id).toBe('123')
    })
  })

  describe('Memory Leak Prevention', () => {
    it('should cleanup timer on unmount via cleanup', () => {
      const { result, unmount } = renderHook(() => useToast())

      act(() => {
        result.current.showToast({ message: 'Test' })
      })

      const setTimeoutSpy = jest.spyOn(global, 'clearTimeout')

      act(() => {
        result.current.cleanup()
      })

      expect(setTimeoutSpy).toHaveBeenCalled()
      setTimeoutSpy.mockRestore()
    })

    it('should not cause issues if closeToast called multiple times', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showToast({ message: 'Test' })
      })

      act(() => {
        result.current.closeToast()
        result.current.closeToast()
        result.current.closeToast()
      })

      expect(result.current.toast).toBeNull()
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapidly changing toasts', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showToast({ message: 'First' })
        result.current.showToast({ message: 'Second' })
        result.current.showToast({ message: 'Third' })
      })

      expect(result.current.toast.message).toBe('Third')

      act(() => {
        jest.advanceTimersByTime(TOAST_DURATION)
      })

      expect(result.current.toast).toBeNull()
    })

    it('should handle empty message', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showToast({ message: '' })
      })

      expect(result.current.toast).not.toBeNull()
      expect(result.current.toast.message).toBe('')
    })

    it('should handle toast with no type specified', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showToast({ message: 'Test' })
      })

      expect(result.current.toast.message).toBe('Test')
      expect(result.current.toast.type).toBeUndefined()
    })
  })
})
