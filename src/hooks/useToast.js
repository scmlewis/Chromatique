import { useState, useRef, useCallback } from 'react'
import { TOAST_DURATION } from '../constants'

/**
 * Custom hook for managing toast notifications
 * Handles automatic dismissal and cleanup of timers
 * @returns {Object} - { toast, showToast, closeToast }
 */
export function useToast() {
  const [toast, setToast] = useState(null)
  const toastTimerRef = useRef(null)

  /**
   * Clear any pending toast timer
   * @private
   */
  const clearToastTimer = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }
  }, [])

  /**
   * Show a toast notification with auto-dismiss
   * @param {Object} toastData - Toast configuration
   * @param {string} toastData.message - Toast message text
   * @param {string} [toastData.type='info'] - Toast type: 'success', 'error', 'info'
   * @param {string} [toastData.actionLabel] - Optional action button label
   * @param {Array<string>} [toastData.previewColors] - Optional color preview for palette toasts
   * @param {string} [toastData.id] - Optional unique ID for undo functionality
   * @param {number} [duration=TOAST_DURATION] - Duration in ms before auto-dismiss (0 = no auto-dismiss)
   */
  const showToast = useCallback((toastData, duration = TOAST_DURATION) => {
    clearToastTimer()
    setToast(toastData)
    
    if (duration > 0) {
      toastTimerRef.current = setTimeout(() => {
        setToast(null)
        toastTimerRef.current = null
      }, duration)
    }
  }, [clearToastTimer])

  /**
   * Close the current toast and clear timer
   */
  const closeToast = useCallback(() => {
    clearToastTimer()
    setToast(null)
  }, [clearToastTimer])

  /**
   * Show a success toast
   * @param {string} message
   * @param {Object} [options={}] - Additional toast options
   */
  const showSuccess = useCallback((message, options = {}) => {
    showToast({ ...options, message, type: 'success' })
  }, [showToast])

  /**
   * Show an error toast
   * @param {string} message
   * @param {Object} [options={}] - Additional toast options
   */
  const showError = useCallback((message, options = {}) => {
    showToast({ ...options, message, type: 'error' })
  }, [showToast])

  /**
   * Show an info toast
   * @param {string} message
   * @param {Object} [options={}] - Additional toast options
   */
  const showInfo = useCallback((message, options = {}) => {
    showToast({ ...options, message, type: 'info' })
  }, [showToast])

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    clearToastTimer()
  }, [clearToastTimer])

  return {
    toast,
    showToast,
    closeToast,
    showSuccess,
    showError,
    showInfo,
    cleanup,
  }
}
