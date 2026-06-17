import React, { useEffect, useState, useRef, useReducer } from 'react'
import TabContents from './components/TabContents'
import HelpModal from './components/HelpModal'
import SettingsModal from './components/SettingsModal'
import Sidebar from './components/Sidebar'
import { randomHex, getHarmonyColors, hexToHsl, hslToHex } from './utils/colors'
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
  const [currentTool, setCurrentTool] = useLocalStorage('palette:tool', 'palette')
  const [genMode, setGenMode] = useLocalStorage('palette:gen-mode', 'random') // 'random', 'monochromatic', 'analogous', 'triadic'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage('palette:sidebar-collapsed', false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    setTimeout(() => {
      const n = forceCount ?? count
      let next = []
      
      if (genMode === 'random') {
        next = Array.from({ length: n }, (_, i) => {
          if (locks && locks[i]) return palette[i] || randomHex()
          return randomHex()
        })
      } else {
        // Harmony modes
        const seed = palette.find((_, i) => locks[i]) || randomHex()
        const harmonyColors = getHarmonyColors(seed, genMode)
        next = Array.from({ length: n }, (_, i) => {
          if (locks && locks[i]) return palette[i]
          
          // Get the base color from harmony set
          const base = harmonyColors[i % harmonyColors.length] || randomHex()
          
          // If we are repeating colors (e.g. 5 colors from 2 harmony colors), create variations
          if (i >= harmonyColors.length) {
            // This is a simple logic to shift lightness and saturation for variations
            const { h, s, l } = hexToHsl(base)
            // Shift progressively based on how many times we've repeated
            const shiftCount = Math.floor(i / harmonyColors.length)
            const newS = Math.max(10, Math.min(100, s + (shiftCount * 10 > 50 ? -20 : 10)))
            const newL = Math.max(10, Math.min(90, l + (shiftCount % 2 === 0 ? 15 : -15)))
            return hslToHex(h, newS, newL)
          }
          
          return base
        })
      }

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
    const id = Date.now().toString()
    const item = { 
      id, 
      name: name || `Palette ${new Date(Number(id)).toLocaleString()}`, 
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
    if (toastTimerRef.current) { 
      clearTimeout(toastTimerRef.current) 
      toastTimerRef.current = null 
    }
    setToast(null)
  }

  function loadFavorite(colors) {
    setPalette(colors)
    setLocks(Array.from({ length: colors.length }, () => false))
  }

  function removeFavorite(id) {
    setFavorites(prev => (prev || []).filter(f => f.id !== id))
  }

  function renameFavorite(id, newName) {
    setFavorites(prev => (prev || []).map(f => f.id === id ? { ...f, name: newName } : f))
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
    <div className="flex min-h-screen bg-[var(--color-surface-bg)] text-[var(--color-text-primary)]">
      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-fade-in" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Tool Navigation */}
      <Sidebar 
        currentTool={currentTool} 
        onToolChange={(toolId) => { setCurrentTool(toolId); setIsMobileMenuOpen(false) }} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[var(--color-surface-base)] z-30 sticky top-0 h-16 sm:h-20 border-b border-[var(--color-border-ghost)]">
          <div className="flex items-center gap-3">
             {/* Mobile Menu Toggle */}
             <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden icon-btn -ml-2"
                aria-label="Open menu"
             >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
             </button>

            <div className="flex items-center gap-3">
              <span className="font-bold text-lg hidden sm:block tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-family-ui)" }}>Chromatique</span>
              <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
                {currentTool?.replace(/([A-Z])/g, ' $1').trim() || 'Tool'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-ghost" onClick={onClickImport} title="Import Palette">
              <span className="hidden sm:inline mr-2">Import</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v12m0 0l-4-4m4 4l4-4" />
                <path d="M3 18h18" />
              </svg>
            </button>
            <button 
              className="icon-btn" 
              onClick={() => setShowSettings(true)}
              aria-label="Settings"
              title="Settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v6m0 6v6M2 12h6m6 0h6" />
              </svg>
            </button>
            <button 
              className="icon-btn" 
              onClick={() => setShowHelp(true)}
              aria-label="Help"
              title="Help"
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
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <TabContents
            tab={currentTool}
            onToolChange={setCurrentTool}
            palette={palette}
            locks={locks}
            favorites={favorites}
            onToggleLock={toggleLock}
            onUpdateColor={updateColor}
            onReorderPalette={reorderPalette}
            onCopy={copyHex}
            onSaveFavorite={saveFavorite}
            onExportJSON={exportJSON}
            onGeneratePalette={generatePalette}
            count={count}
            setCount={setCount}
            genMode={genMode}
            setGenMode={setGenMode}
            onLoadFavorite={loadFavorite}
            onRemoveFavorite={removeFavorite}
            onRenameFavorite={renameFavorite}
            onCloseToast={closeToast}
            onUndoSave={handleUndoSave}
            settings={settings}
            setSettings={setSettings}
            onApplyPalette={setPalette}
            onApplyAndLock={(colors) => { setPalette(colors); setLocks(Array.from({ length: colors.length }, () => false)) }}
            isGenerating={isGenerating}
          />
        </main>
      </div>

      {/* ========== MODALS ========== */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {showHelp && (
        <HelpModal 
          onClose={() => setShowHelp(false)} 
          settings={settings} 
          setSettings={setSettings} 
        />
      )}

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
  )
}


