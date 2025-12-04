import React, { useState } from 'react'
import { readableTextColor, hexToHsl, rgbString } from '../utils/colors'
import { addRipple } from '../utils/ui'
import ColorInfo from './ColorInfo'

export default function PaletteCard({ color, locked, onToggleLock, onCopy, delay, settings = {} }) {
  const textColor = readableTextColor(color)
  const [copiedType, setCopiedType] = useState(null)

  const animStyle = {}
  if (typeof delay === 'number') animStyle.animationDelay = `${delay}ms`

  return (
    <div className="rounded-lg overflow-hidden shadow-md animate-card-pop card-hover" style={animStyle}>
      {/* Color head with controls */}
      <div className="relative h-36 color-swatch" style={{ background: color }} role="img" aria-label={`Color ${color}`} onClick={async (e) => {
        // clicking head copies user's default format
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
            onClick={(e) => { addRipple(e); onToggleLock && onToggleLock() }}
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
      </div>

      <ColorInfo color={color} primary={false} />
    </div>
  )
}
