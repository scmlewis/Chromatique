// Utility functions for safe operations with proper error handling

export async function safeCopyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return { success: true, error: null }
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        return { success: successful, error: successful ? null : 'Copy command failed' }
      } catch (err) {
        document.body.removeChild(textArea)
        return { success: false, error: 'Copy command failed' }
      }
    }
  } catch (err) {
    return { success: false, error: err.message || 'Failed to copy to clipboard' }
  }
}

export function safeLocalStorageGet(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : defaultValue
  } catch (error) {
    console.warn(`Failed to read from localStorage for key "${key}":`, error)
    return defaultValue
  }
}

export function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return { success: true, error: null }
  } catch (error) {
    console.warn(`Failed to write to localStorage for key "${key}":`, error)
    return { success: false, error: error.message }
  }
}

export function safeLocalStorageRemove(key) {
  try {
    localStorage.removeItem(key)
    return { success: true, error: null }
  } catch (error) {
    console.warn(`Failed to remove from localStorage for key "${key}":`, error)
    return { success: false, error: error.message }
  }
}

export function createSafeLocalStorageHook(key, initialValue) {
  return function useSafeLocalStorage() {
    const [state, setState] = React.useState(() => 
      safeLocalStorageGet(key, initialValue)
    )

    React.useEffect(() => {
      safeLocalStorageSet(key, state)
    }, [key, state])

    return [state, setState]
  }
}
