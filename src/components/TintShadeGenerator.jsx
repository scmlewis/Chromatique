import React, { useState, useMemo } from 'react'
import { generateTintsShades, hexToHsl, hslToHex, relativeLuminance } from '../utils/colors'
import { getColorName } from '../utils/colorNames'

function getTextColor(hex) {
  return relativeLuminance(hex) > 0.179 ? '#1a1a1a' : '#ffffff'
}

const SCALE_LABELS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

export default function TintShadeGenerator({ palette, onCopyHex, onSaveFavorite }) {
  const [baseColor, setBaseColor] = useState(palette?.[0] || '#A24936')
  const [stepCount, setStepCount] = useState(11)

  const scale = useMemo(() => {
    const { h, s, l } = hexToHsl(baseColor)
    const result = []

    for (let i = 0; i < stepCount; i++) {
      const t = i / (stepCount - 1)
      // Map from very light (50) to very dark (950)
      // Lightness goes from ~95% down to ~10%
      const targetL = 95 - t * 85
      // Saturation adjustment: slightly desaturate at extremes
      const satMod = 1 - 0.3 * Math.abs(t - 0.5) * 2
      const targetS = Math.max(5, Math.min(100, s * satMod))
      const hex = hslToHex(h, targetS, targetL)
      const label = SCALE_LABELS[i] || `${Math.round(t * 100)}`
      result.push({ hex, label, name: getColorName(hex) })
    }

    return result
  }, [baseColor, stepCount])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Controls */}
      <div className="panel p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div>
            <label className="text-xs font-bold text-[var(--color-text-accent-muted)] uppercase tracking-widest mb-2 block">Base Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value.toUpperCase())}
                className="w-12 h-12 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => { if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) setBaseColor(e.target.value.toUpperCase()) }}
                className="font-mono text-sm px-3 py-2 rounded-lg w-28"
                style={{ background: 'var(--color-surface-overlay)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-ghost)' }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--color-text-accent-muted)] uppercase tracking-widest mb-2 block">Steps</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={3}
                max={15}
                value={stepCount}
                onChange={(e) => setStepCount(Number(e.target.value))}
                className="w-24"
              />
              <span className="font-mono text-sm" style={{ color: 'var(--color-text-primary)' }}>{stepCount}</span>
            </div>
          </div>

          <div className="sm:ml-auto">
            <button
              onClick={() => onSaveFavorite?.(scale.map(s => s.hex), `Tints & Shades — ${baseColor}`)}
              className="btn btn-outline"
            >
              Save Scale
            </button>
          </div>
        </div>

        {/* Palette quick pick */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-[var(--color-text-tertiary)] self-center mr-1">Palette:</span>
          {(palette || []).map((c, i) => (
            <button
              key={i}
              onClick={() => setBaseColor(c)}
              className="w-7 h-7 rounded-md border border-[var(--color-border-ghost)] cursor-pointer hover:scale-110 transition-transform"
              style={{ background: c }}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* Scale Preview */}
      <div className="panel p-6">
        <h3 className="text-xs font-bold text-[var(--color-text-accent-muted)] uppercase tracking-widest mb-4">Tonal Scale</h3>
        <div className="space-y-2">
          {scale.map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-[var(--color-border-accent)] transition-all group"
              style={{ background: step.hex }}
              onClick={() => onCopyHex?.(step.hex)}
            >
              <div className="w-20 text-right pr-3 py-3">
                <span className="text-sm font-bold" style={{ color: getTextColor(step.hex) }}>
                  {step.label}
                </span>
              </div>
              <div className="flex-1 py-3">
                <span className="text-sm font-mono" style={{ color: getTextColor(step.hex), opacity: 0.8 }}>
                  {step.hex}
                </span>
              </div>
              <div className="pr-4 py-3">
                <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider" style={{ color: getTextColor(step.hex), opacity: 0.7 }}>
                  Click to copy
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Strip */}
      <div className="panel p-6">
        <h3 className="text-xs font-bold text-[var(--color-text-accent-muted)] uppercase tracking-widest mb-4">Gradient Strip</h3>
        <div
          className="h-16 rounded-xl overflow-hidden flex cursor-pointer"
          onClick={() => {
            const css = scale.map((s, i) => `  --color-${s.label}: ${s.hex};`).join('\n')
            navigator.clipboard.writeText(`:root {\n${css}\n}`)
            onCopyHex?.('CSS variables copied')
          }}
          title="Click to copy CSS variables"
        >
          {scale.map((step, i) => (
            <div key={i} className="flex-1" style={{ background: step.hex }} />
          ))}
        </div>
        <p className="text-[10px] text-[var(--color-text-tertiary)] mt-2 text-center">Click to copy as CSS custom properties</p>
      </div>
    </div>
  )
}
