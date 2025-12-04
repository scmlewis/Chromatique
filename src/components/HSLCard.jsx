import React from 'react'
import { readableTextColor, hexToRgb } from '../utils/colors'
import ColorInfo from './ColorInfo'

export default function HSLCard({ title, color, h, s, l, showCMYK = true, defaultCopy = 'hex' }) {
  const textColor = readableTextColor(color)

  async function handleHeadClick() {
    try {
      let text = color
      if (defaultCopy === 'rgb') text = `rgb(${hexToRgb(color).r}, ${hexToRgb(color).g}, ${hexToRgb(color).b})`
      else if (defaultCopy === 'hsl') {
        const hh = Math.round(h); const ss = Math.round(s); const ll = Math.round(l)
        text = `hsl(${hh}, ${ss}%, ${ll}%)`
      }
      await navigator.clipboard.writeText(text)
    } catch (e) {}
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-md animate-card-pop card-hover">
      {/* Color head */}
      <div className="h-40 flex items-end p-4 color-swatch" style={{ background: color }} onClick={handleHeadClick}>
        <h3 className="text-lg font-semibold" style={{ color: textColor }}>{title}</h3>
      </div>

      {/* Reuse ColorInfo for consistent layout */}
      <ColorInfo color={color} h={h} s={s} l={l} primary={title === 'Primary'} showCMYK={showCMYK} />
    </div>
  )
}
