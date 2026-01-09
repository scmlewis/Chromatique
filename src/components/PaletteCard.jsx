import React, { useState, useRef, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'
import { readableTextColor, hexToHsl, rgbString } from '../utils/colors'
import { addRipple } from '../utils/ui'
import ColorInfo from './ColorInfo'

export default function PaletteCard({ color, locked, onToggleLock, onCopy, onColorChange, delay, settings = {} }) {
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
    <div className="rounded-lg overflow-hidden shadow-md animate-card-pop card-hover" style={animStyle}>
      {/* Color head with controls */}
      <div className="relative h-36 color-swatch" style={{ background: color }} role="img" aria-label={`Color ${color}`} onClick={async (e) => {
        // clicking head copies user's default format
        if (isEditing) return // Don't copy while editing
        try {
          const def = settings.defaultCopy || 'hex'
          let text = color
          if (def === 'rgb') text = rgbString(color)
          else if (def === 'hsl') { const hh = Math.round(hexToHsl(color).h); const ss = Math.round(hexToHsl(color).s); const ll = Math.round(hexToHsl(color).l); text = `hsl(${hh}, ${ss}%, ${ll}%)` }
          await navigator.clipboard.writeText(text)
          setCopiedType(def)
          setTimeout(() => setCopiedType(null), 1200)
        } catch (err) {}
      }}>
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <button
            aria-label={locked ? 'Unlock color' : 'Lock color'}
            onClick={(e) => { e.stopPropagation(); addRipple(e); onToggleLock && onToggleLock() }}
            className="p-2 rounded-md bg-black/25 backdrop-blur-sm"
            title={locked ? 'Unlock' : 'Lock'}
            style={{ color: textColor }}
          >
            {locked ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 1a4 4 0 00-4 4v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-2V5a4 4 0 00-4-4zm-1 10v6h2v-6h-2z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17 8V7a5 5 0 00-10 0h2a3 3 0 016 0v1h-8a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2h-1zM11 13h2v4h-2z" />
              </svg>
            )}
          </button>
        </div>

        {/* Color editing controls - centered bottom */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center px-2">
          {isEditing ? (
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-md px-2 py-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-24 px-2 py-1 text-sm bg-white/90 text-slate-900 rounded border-2 border-transparent focus:border-indigo-500 outline-none font-mono"
                placeholder="#FF5733"
                autoFocus
              />
              <button
                onClick={handleEditSave}
                className="p-1 text-white hover:text-green-400 transition-colors"
                title="Save"
                aria-label="Save color"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={handleEditCancel}
                className="p-1 text-white hover:text-red-400 transition-colors"
                title="Cancel"
                aria-label="Cancel edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleEditStart() }}
                className="flex items-center gap-1 px-2 py-1 bg-black/30 backdrop-blur-sm rounded-md hover:bg-black/40 transition-colors"
                style={{ color: textColor }}
                title="Edit hex code"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <span className="text-xs font-mono">{color}</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handlePickerStart() }}
                className="p-1.5 bg-black/30 backdrop-blur-sm rounded-md hover:bg-black/40 transition-colors"
                style={{ color: textColor }}
                title="Color picker"
                aria-label="Open color picker"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Color picker popup */}
        {showPicker && (
          <div 
            ref={pickerRef}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 z-50 animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-800 p-3 rounded-lg shadow-xl border border-slate-700">
              <HexColorPicker color={pickerColor} onChange={handlePickerChange} />
              <div className="mt-2 text-center">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowPicker(false) }}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-xs text-white transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 text-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-medium shadow-lg">
              {error}
            </span>
          </div>
        )}

        {/* Copy feedback */}
        {copiedType && (
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 text-center pointer-events-none">
            <span className="bg-green-500 text-white px-3 py-1 rounded-md text-xs font-medium shadow-lg animate-pop">
              Copied {copiedType.toUpperCase()}!
            </span>
          </div>
        )}
      </div>

      <ColorInfo color={color} primary={false} />
    </div>
  )
}
