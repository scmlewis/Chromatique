import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { HexColorPicker } from 'react-colorful'
import { readableTextColor, hexToHsl, rgbString } from '../utils/colors'
import { addRipple } from '../utils/ui'
import ColorInfo from './ColorInfo'

export default function PaletteCard({ color, locked, onToggleLock, onCopy, onColorChange, delay, settings = {}, onMoveUp, onMoveDown }) {
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
      className="surface-card overflow-visible animate-card-pop card-hover relative" 
      style={{ 
        ...animStyle,
        borderRadius: 'var(--radius-lg)'
      }}
    >
      {/* Color swatch head with controls */}
      <div 
        className="relative h-36 color-swatch transition-all duration-300" 
        style={{ background: color }} 
        role="img" 
        aria-label={`Color swatch ${color}`} 
        onClick={async (e) => {
          // clicking head copies user's default format
          if (isEditing) return
          try {
            const def = settings.defaultCopy || 'hex'
            let text = color
            if (def === 'rgb') text = rgbString(color)
            else if (def === 'hsl') { 
              const hh = Math.round(hexToHsl(color).h)
              const ss = Math.round(hexToHsl(color).s)
              const ll = Math.round(hexToHsl(color).l)
              text = `hsl(${hh}, ${ss}%, ${ll}%)` 
            }
            await navigator.clipboard.writeText(text)
            setCopiedType(def)
            setTimeout(() => setCopiedType(null), 1200)
          } catch (err) {}
        }}
      >
        {/* Lock/Unlock button - top right */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            aria-label={locked ? 'Unlock color' : 'Lock color'}
            onClick={(e) => { 
              e.stopPropagation()
              addRipple(e)
              onToggleLock && onToggleLock() 
            }}
            className="inline-flex items-center justify-center"
            style={{
              width: 'var(--space-10)',
              height: 'var(--space-10)',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(8px)',
              color: textColor,
              transition: 'all var(--duration-normal) ease',
            }}
            title={locked ? 'Unlock' : 'Lock'}
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

        {/* Color controls - centered bottom */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center px-2">
          {isEditing ? (
            <div 
              className="flex items-center gap-2 px-3 py-2" 
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="font-mono text-sm outline-none"
                placeholder="#FF5733"
                autoFocus
                style={{
                  width: '100px',
                  padding: 'var(--space-2)',
                  background: 'var(--color-surface-bg)',
                  color: 'var(--color-text-primary)',
                  border: '2px solid transparent',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'border-color var(--duration-normal) ease',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-brand-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'transparent'}
              />
              <button
                onClick={handleEditSave}
                style={{ color: textColor }}
                className="transition-colors"
                title="Save"
                aria-label="Save color"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={handleEditCancel}
                style={{ color: textColor }}
                className="transition-colors"
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
                onClick={(e) => { 
                  e.stopPropagation()
                  handleEditStart() 
                }}
                className="flex items-center gap-2 px-3 py-1 transition-all"
                style={{
                  color: textColor,
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--radius-md)',
                }}
                title="Edit hex code"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={(e) => { 
                  e.stopPropagation()
                  handlePickerStart() 
                }}
                className="inline-flex items-center justify-center transition-all"
                style={{
                  width: 'var(--space-10)',
                  height: 'var(--space-10)',
                  color: textColor,
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--radius-md)',
                }}
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

      </div>

      {/* Color picker portal - renders at document root to escape card hierarchy */}
      {showPicker && createPortal(
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPicker(false)
            }
          }}
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <div 
            ref={pickerRef}
            className="animate-pop"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <HexColorPicker color={pickerColor} onChange={handlePickerChange} />
            <div className="mt-4 text-center">
              <button
                onClick={(e) => { 
                  e.stopPropagation()
                  setShowPicker(false) 
                }}
                className="btn btn-primary btn-sm"
                style={{
                  background: 'var(--color-brand-primary)',
                  color: 'white',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Error message - positioned at card level */}
      {error && (
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 text-center z-40 pointer-events-none">
          <span 
            className="text-xs font-semibold text-white shadow-lg animate-pop"
            style={{
              display: 'inline-block',
              padding: 'var(--space-2) var(--space-3)',
              background: 'var(--color-error)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {error}
          </span>
        </div>
      )}

      {/* Copy feedback - positioned at card level */}
      {copiedType && (
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 text-center pointer-events-none z-40">
          <span 
            className="text-xs font-semibold text-white shadow-lg animate-pop"
            style={{
              display: 'inline-block',
              padding: 'var(--space-2) var(--space-3)',
              background: 'var(--color-success)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            Copied {copiedType.toUpperCase()}!
          </span>
        </div>
      )}

      {/* Color info footer - Streamlined view */}
      <ColorInfo color={color} primary={false} showDetails={false} settings={settings} onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
    </div>
  )
}

PaletteCard.propTypes = {
  color: PropTypes.string.isRequired,
  locked: PropTypes.bool,
  onToggleLock: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  onColorChange: PropTypes.func.isRequired,
  delay: PropTypes.number,
  settings: PropTypes.shape({
    showCMYK: PropTypes.bool,
    defaultCopy: PropTypes.oneOf(['hex', 'rgb', 'hsl', 'cmyk']),
    reducedMotion: PropTypes.bool,
  }),
}

PaletteCard.defaultProps = {
  locked: false,
  delay: 0,
  settings: {},
}
