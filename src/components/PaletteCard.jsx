import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { HexColorPicker } from 'react-colorful'
import { readableTextColor, hexToHsl, rgbString } from '../utils/colors'
import { addRipple } from '../utils/ui'
import ColorInfo from './ColorInfo'

export default function PaletteCard({ color, locked, onToggleLock, onCopy, onColorChange, delay, settings = {}, onMoveUp, onMoveDown, isCompact }) {
  const textColor = readableTextColor(color)
  const [copiedType, setCopiedType] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [editValue, setEditValue] = useState(color)
  const [pickerColor, setPickerColor] = useState(color)
  const [error, setError] = useState(null)
  const pickerRef = useRef(null)

  const animStyle = {}
  if (typeof delay === 'number') animStyle.animationDelay = `${delay}ms`

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false)
      }
    }

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPicker])

  // Update picker color when color prop changes
  useEffect(() => {
    setPickerColor(color)
    setEditValue(color)
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
    setIsEditing(true)
    setEditValue(color)
    setError(null)
    setShowPicker(false)
  }

  const handlePickerStart = () => {
    setShowPicker(true)
    setPickerColor(color)
    setIsEditing(false)
    setError(null)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditValue(color)
    setError(null)
  }

  const handlePickerChange = (newColor) => {
    setPickerColor(newColor)
    if (onColorChange) {
      onColorChange(newColor.toUpperCase())
    }
  }

  const handleEditSave = () => {
    if (validateHex(editValue)) {
      const normalized = normalizeHex(editValue)
      if (onColorChange) {
        onColorChange(normalized)
      }
      setIsEditing(false)
      setError(null)
    } else {
      setError('Invalid hex color')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSave()
    } else if (e.key === 'Escape') {
      handleEditCancel()
    }
  }

  return (
    <div 
      className="palette-card-alt group relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out" 
      style={{ 
        ...animStyle,
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-surface-elevated)',
        border: '1px solid var(--color-border-primary)'
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
            className="flex items-center justify-center p-2 rounded-lg bg-black/30 backdrop-blur-md text-white/90 hover:bg-black/50 transition-all border border-white/10 hover:scale-110"
            title={locked ? 'Unlock' : 'Lock'}
          >
            {locked ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 1a4 4 0 00-4 4v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-2V5a4 4 0 00-4-4zm-1 10v6h2v-6h-2z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17 8V7a5 5 0 00-10 0h2a3 3 0 016 0v1h-8a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2h-1zM11 13h2v4h-2z" />
              </svg>
            )}
          </button>
        </div>

        {/* Center Icons - Only visible on hover (lg) but persistent on touch/mobile */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 transform translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0">
          <button
            onClick={(e) => { e.stopPropagation(); handleEditStart() }}
            className="p-3 rounded-xl bg-black/40 backdrop-blur-lg text-white hover:bg-black/60 transition-all border border-white/20 shadow-xl"
            title="Edit Hex"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          
          <button
             onClick={(e) => { e.stopPropagation(); setShowPicker(true); setPickerColor(color) }}
             className="p-3 rounded-xl bg-black/40 backdrop-blur-lg text-white hover:bg-black/60 transition-all border border-white/20 shadow-xl"
             title="Pick Color"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        {/* Edit Input Overlay */}
        {isEditing && (
           <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-20" onClick={e => e.stopPropagation()}>
              <div className="flex flex-col gap-2 p-4 animate-pop">
                 <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="font-mono text-lg text-center bg-slate-900 text-white border-2 border-indigo-500 rounded-lg px-3 py-2 outline-none shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    placeholder="#HEX"
                    autoFocus
                 />
                 <div className="flex gap-2">
                    <button onClick={handleEditSave} className="flex-1 bg-indigo-500 hover:bg-indigo-600 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider">Save</button>
                    <button onClick={handleEditCancel} className="flex-1 bg-slate-800 hover:bg-slate-700 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-slate-400">Cancel</button>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* 2. CARD FOOTER (INFO BAR) - Hide in compact mode unless hovered or on touch */}
      <div className={`bg-[#0f1115] p-3 flex items-center justify-between border-t border-white/5 transition-all duration-300 ${isCompact ? 'opacity-100 lg:opacity-0 lg:group-hover:opacity-100 max-h-20 lg:max-h-0 lg:group-hover:max-h-20 overflow-hidden' : 'opacity-100'}`}>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">HEX</span>
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
          className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-[10px] font-bold px-2 py-1 rounded-md border border-white/5 transition-colors uppercase tracking-tight"
        >
          {copiedType === 'hex' ? 'COPIED!' : 'COPY'}
        </button>
      </div>

      {/* 3. COLOR PICKER PORTAL */}
      {showPicker && createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowPicker(false)}>
          <div ref={pickerRef} className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl animate-pop" onClick={e => e.stopPropagation()}>
            <HexColorPicker color={pickerColor} onChange={handlePickerChange} />
            <div className="mt-4 flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-white/5">
               <span className="font-mono font-bold text-indigo-400 uppercase">{pickerColor}</span>
               <button onClick={() => setShowPicker(false)} className="px-4 py-1.5 bg-indigo-500 rounded-lg text-xs font-bold uppercase">Done</button>
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
