import React, { useEffect, useState, useRef, useReducer } from 'react'
import TabContents from './components/TabContents'
import HelpModal from './components/HelpModal'
import SettingsModal from './components/SettingsModal'
import { randomHex } from './utils/colors'
import Toast from './components/Toast'
import { safeCopyToClipboard } from './utils/storage'
import { 
  TOAST_DURATION, 
  DEFAULT_PALETTE_COUNT, 
  STORAGE_KEYS 
} from './constants'

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch (e) {
      console.warn(`Failed to read localStorage for key "${key}":`, e)
      return initial
    }
  })
  useEffect(() => {
    try { 
      localStorage.setItem(key, JSON.stringify(state)) 
    } catch (e) {
      console.warn(`Failed to write localStorage for key "${key}":`, e)
    }
  }, [key, state])
  return [state, setState]
}

export default function App() {
  const defaultCount = DEFAULT_PALETTE_COUNT
  const [count, setCount] = useState(defaultCount)
  const [palette, setPalette] = useLocalStorage('palette:current', [])
  const [locks, setLocks] = useLocalStorage('palette:locks', [])
  const [favorites, setFavorites] = useLocalStorage('palette:favs', [])
  const [toast, setToast] = useState(null)
  const toastTimerRef = useRef(null)
  const fileInputRef = useRef(null)
  const [showSettings, setShowSettings] = useState(false)
    const [showHelp, setShowHelp] = useState(false)
  const [settings, setSettings] = useLocalStorage('palette:settings', { showCMYK: true, defaultCopy: 'hex', reducedMotion: false })
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (!palette || palette.length === 0) {
      generatePalette()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    generatePalette(count)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  function generatePalette(forceCount) {
    setIsGenerating(true)
    // Use setTimeout to allow UI to update with loading state
    setTimeout(() => {
      const n = forceCount ?? count
      const next = Array.from({ length: n }, (_, i) => {
        if (locks && locks[i]) return palette[i] || randomHex()
        return randomHex()
      })
      setPalette(next)
      setLocks(l => {
        const nextLocks = Array.from({ length: n }, (_, i) => !!(l && l[i]))
        return nextLocks
      })
      setIsGenerating(false)
    }, 100)
  }

  function toggleLock(index) {
    setLocks(prev => {
      const copy = [...(prev || [])]
      copy[index] = !copy[index]
      return copy
    })
  }

  function updateColor(index, newColor) {
    setPalette(prev => {
      const copy = [...prev]
      copy[index] = newColor
      return copy
    })
  }

  function reorderPalette(fromIndex, toIndex) {
    setPalette(prev => {
      const newPalette = [...prev]
      const [moved] = newPalette.splice(fromIndex, 1)
      newPalette.splice(toIndex, 0, moved)
      return newPalette
    })
    
    setLocks(prev => {
      const newLocks = prev ? [...prev] : []
      const [moved] = newLocks.splice(fromIndex, 1)
      newLocks.splice(toIndex, 0, moved)
      return newLocks
    })
  }

  async function copyHex(hex) {
    const result = await safeCopyToClipboard(hex)
    if (!result.success) {
      console.error('Failed to copy:', result.error)
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
        toastTimerRef.current = null
      }
      setToast({ message: 'Failed to copy to clipboard', type: 'error' })
      toastTimerRef.current = setTimeout(() => {
        setToast(null)
        toastTimerRef.current = null
      }, TOAST_DURATION)
    }
  }

  function saveFavorite(colors, name, tags = []) {
    const toSave = Array.isArray(colors) && colors.length > 0 ? colors : palette
    if (!toSave || toSave.length === 0) return
    const id = Date.now()
    const item = { 
      id, 
      name: name || `Palette ${new Date(id).toLocaleString()}`, 
      colors: toSave, 
      createdAt: id,
      tags: Array.isArray(tags) ? tags : []
    }
    setFavorites(prev => [item, ...(prev || [])])
    // show snackbar with preview and undo
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }
    setToast({ id, message: `Saved: ${item.name}`, actionLabel: 'Undo', previewColors: toSave, type: 'success' })
    toastTimerRef.current = setTimeout(() => {
      setToast(null)
      toastTimerRef.current = null
    }, TOAST_DURATION)
  }

  function handleUndoSave(id) {
    setFavorites(prev => (prev || []).filter(f => f.id !== id))
    if (toastTimerRef.current) { clearTimeout(toastTimerRef.current); toastTimerRef.current = null }
    setToast(null)
  }

  function closeToast() {
    if (toastTimerRef.current) { clearTimeout(toastTimerRef.current); toastTimerRef.current = null }
    setToast(null)
  }

  function loadFavorite(colors) {
    setPalette(colors)
    setLocks(Array.from({ length: colors.length }, () => false))
  }

  function removeFavorite(id) {
    setFavorites(prev => (prev || []).filter(f => f.id !== id))
  }

  function exportJSON(colors) {
    const toExport = Array.isArray(colors) && colors.length > 0 ? colors : palette
    const payload = JSON.stringify({ colors: toExport }, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'palette.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import flow: file picker -> parse JSON -> set palette
  function onClickImport() {
    try {
      fileInputRef.current?.click()
    } catch (e) {
      console.error('Failed to open file picker:', e)
      if (toastTimerRef.current) { clearTimeout(toastTimerRef.current); toastTimerRef.current = null }
      setToast({ message: 'Failed to open file picker', type: 'error' })
      toastTimerRef.current = setTimeout(() => { setToast(null); toastTimerRef.current = null }, TOAST_DURATION)
    }
  }

  async function handleFilePicked(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      let colors = []
      if (Array.isArray(parsed)) colors = parsed
      else if (Array.isArray(parsed.colors)) colors = parsed.colors
      else if (Array.isArray(parsed.palette)) colors = parsed.palette
      if (!Array.isArray(colors) || colors.length === 0) throw new Error('No colors found')
      const trimmed = colors.slice(0, 10).map(c => String(c).trim())
      setPalette(trimmed)
      setLocks(Array.from({ length: trimmed.length }, () => false))
      if (toastTimerRef.current) { clearTimeout(toastTimerRef.current); toastTimerRef.current = null }
      setToast({ message: `Imported ${trimmed.length} colors`, previewColors: trimmed, type: 'success' })
      toastTimerRef.current = setTimeout(() => { setToast(null); toastTimerRef.current = null }, TOAST_DURATION)
    } catch (err) {
      if (toastTimerRef.current) { clearTimeout(toastTimerRef.current); toastTimerRef.current = null }
      setToast({ message: 'Import failed: ' + (err.message || 'invalid file'), type: 'error' })
      toastTimerRef.current = setTimeout(() => { setToast(null); toastTimerRef.current = null }, TOAST_DURATION)
    } finally {
      e.target.value = null
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)' }}>
      <div className="max-w-6xl mx-auto p-6 lg:p-12">
        {/* ========== HEADER ========== */}
        <header className="flex items-start justify-between mb-8 site-header gap-4">
          <div className="flex-1">
            <h1 className="app-title">Chromatique</h1>
            <p className="app-subtitle hidden sm:block">Generate, lock, copy, and save palettes. HSL controls, color extraction, and favorites management.</p>
          </div>

          {/* Header Actions - Desktop & Mobile Variants */}
          <div className="flex items-center gap-3">
            {/* Desktop: text + icon buttons */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                className="btn btn-ghost" 
                onClick={onClickImport}
                aria-label="Import palette from JSON file"
              >
                Import
              </button>
              <button 
                className="btn btn-ghost" 
                onClick={() => setShowSettings(true)}
                aria-label="Open settings"
              >
                Settings
              </button>
              <button 
                className="btn btn-ghost" 
                onClick={() => setShowHelp(true)}
                aria-label="Open help and keyboard shortcuts"
              >
                Help
              </button>
            </div>

            {/* Mobile: icon-only buttons */}
            <div className="flex md:hidden items-center gap-2">
              <button 
                className="btn-icon" 
                onClick={onClickImport}
                title="Import palette"
                aria-label="Import palette from JSON file"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v12m0 0l-4-4m4 4l4-4" />
                  <path d="M3 18h18" />
                </svg>
              </button>
              <button 
                className="btn-icon" 
                onClick={() => setShowSettings(true)}
                title="Settings"
                aria-label="Open settings"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v6m0 6v6M2 12h6m6 0h6" />
                </svg>
              </button>
              <button 
                className="btn-icon" 
                onClick={() => setShowHelp(true)}
                title="Help"
                aria-label="Open help and keyboard shortcuts"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 17v-1m0-4V8m-1-2h2" />
                </svg>
              </button>
            </div>

            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".json,application/json" 
              onChange={handleFilePicked} 
              style={{ display: 'none' }} 
            />
          </div>
        </header>

        {/* ========== MAIN CONTENT ========== */}
        <main className="space-y-6">
          <TabContents
            palette={palette}
            locks={locks}
            favorites={favorites}
            onToggleLock={toggleLock}
            onUpdateColor={updateColor}
            onReorderPalette={reorderPalette}
            onCopyHex={copyHex}
            onSaveFavorite={saveFavorite}
            onExportJSON={exportJSON}
            onGeneratePalette={generatePalette}
            count={count}
            setCount={setCount}
            onLoadFavorite={loadFavorite}
            onRemoveFavorite={removeFavorite}
            onCloseToast={closeToast}
            onUndoSave={handleUndoSave}
            settings={settings}
            setSettings={setSettings}
            onApplyPalette={setPalette}
            onApplyAndLock={(colors) => { setPalette(colors); setLocks(Array.from({ length: colors.length }, () => false)) }}
            isGenerating={isGenerating}
          />
        </main>

        {/* ========== MODALS ========== */}
        {/* Settings Modal */}
        <SettingsModal 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingsChange={setSettings}
        />

        {/* Help Modal */}
        {showHelp && (
          <HelpModal 
            onClose={() => setShowHelp(false)} 
            settings={settings} 
            setSettings={setSettings} 
          />
        )}

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            actionLabel={toast.actionLabel}
            previewColors={toast.previewColors}
            type={toast.type || 'info'}
            onAction={() => handleUndoSave(toast.id)}
            onClose={closeToast}
          />
        )}
      </div>
    </div>
  )
}

