import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { HexColorPicker } from 'react-colorful'
import { readableTextColor, hexToHsl, rgbString } from '../utils/colors'
import { addRipple } from '../utils/ui'
import ColorInfo from './ColorInfo'

export default function PaletteCard({ color, locked, onToggleLock, onCopy, onColorChange, delay, settings = {}, onMoveUp, onMoveDown, isCompact }) {
  if (!color || typeof color !== 'string') return null
  const textColor = readableTextColor(color)
  const [copiedType, setCopiedType] = useState(null)
  const [showPicker, setShowPicker] = useState(false)
  const [pickerInput, setPickerInput] = useState(color)
  const [pickerColor, setPickerColor] = useState(color)
  const [error, setError] = useState(null)

  const animStyle = {}
  if (typeof delay === 'number') animStyle.animationDelay = `${delay}ms`

  // Update picker color when color prop changes
  useEffect(() => {
    setPickerColor(color)
    setPickerInput(color)
  }, [color])

  const validateHex = (value) => {
    const hex = value.trim()
    // Allow with or without #
    const hexPattern = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
    return hexPattern.test(hex)
  }

  const normalizeHex = (value) => {
    let hex = value.trim().toUpperCase()
    if (!hex.startsWith('#')) hex = '#' + hex
    // Expand shorthand (e.g., #F0F -> #FF00FF)
    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
    }
    return hex
  }

  const handleEditStart = () => {
    setShowPicker(true)
    setPickerColor(color)
    setPickerInput(color)
    setError(null)
  }

  const handlePickerChange = (newColor) => {
    const normalized = newColor.toUpperCase()
    setPickerColor(normalized)
    setPickerInput(normalized)
    if (onColorChange) {
      onColorChange(normalized)
    }
  }

  const handlePickerInputChange = (value) => {
    setPickerInput(value)
    if (validateHex(value)) {
      const normalized = normalizeHex(value)
      setPickerColor(normalized)
      if (onColorChange) {
        onColorChange(normalized)
      }
      setError(null)
    } else if (value.trim().length > 0) {
      setError('Invalid hex color')
    } else {
      setError(null)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (validateHex(pickerInput)) {
        setShowPicker(false)
      }
    } else if (e.key === 'Escape') {
      setShowPicker(false)
    }
  }

  return (
    <div 
      className="palette-card-alt group relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out" 
      style={{ 
        ...animStyle,
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-surface-container-low)',
        border: 'none'
      }}
    >
      {/* 1. MAIN COLOR AREA (HOVER TARGET) */}
      <div 
        className="relative flex-1 cursor-pointer transition-all duration-300" 
        style={{ background: color }} 
        role="img" 
        aria-label={`Color swatch ${color}`} 
      >
        {/* Lock/Unlock button - top right */}
        <div className={`absolute top-4 right-4 z-10 transition-opacity duration-300 ${isCompact && !locked ? 'opacity-100 lg:opacity-0 lg:group-hover:opacity-100' : 'opacity-100'}`}>
          <button
            aria-label={locked ? 'Unlock color' : 'Lock color'}
            onClick={(e) => { 
              e.stopPropagation()
              addRipple(e)
              onToggleLock && onToggleLock() 
            }}
            className="flex items-center justify-center p-2 rounded-lg bg-black/40 text-white/90 hover:bg-black/60 transition-all"
            title={locked ? 'Unlock' : 'Lock'}
          >
            {locked ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="7" y="11" width="10" height="9" rx="2" />
                <path d="M9 11V8a3 3 0 0 1 6 0v3" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="7" y="11" width="10" height="9" rx="2" />
                <path d="M9 11V8a3 3 0 0 1 4.5-2.6" />
              </svg>
            )}
          </button>
        </div>

        {/* Center Action - Single color edit action to avoid duplicate behavior */}
        <div className="absolute inset-0 flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 transform translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0">
          <button
             onClick={(e) => { e.stopPropagation(); handleEditStart() }}
             className="p-3 rounded-xl bg-black/50 text-white hover:bg-black/70 transition-all"
             title="Edit Color"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

      </div>

      {/* 2. CARD FOOTER (INFO BAR) - Hide in compact mode unless hovered or on touch */}
      <div className={`bg-[var(--color-surface-dim)] p-3 flex items-center justify-between border-t border-white/5 transition-all duration-300 ${isCompact ? 'opacity-100 lg:opacity-0 lg:group-hover:opacity-100 max-h-20 lg:max-h-0 lg:group-hover:max-h-20 overflow-hidden' : 'opacity-100'}`}>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-widest text-[var(--color-primary)] font-bold">HEX</span>
          <span className="font-mono text-xs font-bold text-white tracking-widest leading-none">{color}</span>
        </div>
        
        <button 
          onClick={async (e) => {
             e.stopPropagation();
             try {
                await navigator.clipboard.writeText(color);
                setCopiedType('hex');
                setTimeout(() => setCopiedType(null), 1200);
             } catch(err){}
          }}
          className="bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/30 text-[var(--color-primary)] text-[10px] font-bold px-2 py-1 rounded-md transition-colors uppercase tracking-tight"
        >
          {copiedType === 'hex' ? 'COPIED!' : 'COPY'}
        </button>
      </div>

      {/* 3. COLOR PICKER PORTAL */}
      {showPicker && createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-[420px] bg-[var(--color-surface-dim)] border border-white/10 p-4 sm:p-6 rounded-2xl shadow-2xl animate-pop" onClick={e => e.stopPropagation()}>
            <HexColorPicker color={pickerColor} onChange={handlePickerChange} />
            <div className="mt-4 bg-[var(--color-primary)]/10 p-3 rounded-xl border border-[var(--color-primary)]/20 space-y-3">
               <input
                 type="text"
                 value={pickerInput}
                 onChange={(e) => handlePickerInputChange(e.target.value)}
                 onKeyDown={handleKeyDown}
                 className="w-full font-mono font-bold text-xl text-[var(--color-primary)]/90 uppercase bg-[var(--color-surface-container-low)] border border-[var(--color-primary)]/30 rounded-lg px-3 py-2 outline-none focus:border-[var(--color-primary)]"
                 inputMode="text"
                 pattern="^#?[0-9A-Fa-f]{6}$"
                 aria-label="Color hex input"
               />
               <div className="flex items-center justify-between gap-3">
                 <span className="text-[11px] text-[var(--color-primary)]">Type a HEX code to preview live</span>
                 <button
                   onClick={() => setShowPicker(false)}
                   className="px-5 py-2 bg-[var(--color-primary)] rounded-lg text-sm font-bold uppercase text-white"
                 >
                   Done
                 </button>
               </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Copy feedback overlay */}
      {error && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center z-50 pointer-events-none">
          <span className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl animate-pop">{error}</span>
        </div>
      )}
    </div>
  )
}

PaletteCard.propTypes = {
  color: PropTypes.string.isRequired,
  locked: PropTypes.bool,
  onToggleLock: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func,
  isCompact: PropTypes.bool,
}

PaletteCard.defaultProps = {
  locked: false,
  delay: 0,
  settings: {},
}

