import React from 'react'
import { readableTextColor, hexToRgb, hexToHsl } from '../utils/colors'

export default function HSLCard({ title, color, h, s, l, showCMYK = true, defaultCopy = 'hex' }) {
  const textColor = readableTextColor(color)

  // Return a display string according to the configured default copy format
  function displayForFormat() {
    if (defaultCopy === 'rgb') {
      const { r, g, b } = hexToRgb(color)
      return `rgb(${r}, ${g}, ${b})`
    }

    if (defaultCopy === 'hsl') {
      const hh = Math.round(hexToHsl(color).h)
      const ss = Math.round(hexToHsl(color).s)
      const ll = Math.round(hexToHsl(color).l)
      return `hsl(${hh}, ${ss}%, ${ll}%)`
    }

    return color
  }

  async function handleHeadClick() {
    try {
      await navigator.clipboard.writeText(displayForFormat())
    } catch (e) {}
  }

  return (
    <div className="surface-card overflow-hidden animate-card-pop">
      {/* Color head */}
      <div className="h-40 flex items-end p-4 color-swatch" style={{ background: color }} onClick={handleHeadClick}>
        <h3 className="text-lg font-semibold" style={{ color: textColor }}>{title}</h3>
      </div>

      {/* Streamlined footer - keep minimal info only */}
      <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface-bg)', borderTop: '1px solid var(--color-border-subtle)' }}>
        <div className="flex items-center justify-between">
          <div className="font-mono" style={{ color: 'var(--color-text-primary)' }}>{displayForFormat()}</div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={async () => { try { await navigator.clipboard.writeText(displayForFormat()) } catch (e) {} }}
            aria-label="Copy color code"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}
