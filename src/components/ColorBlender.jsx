import React, { useState, useMemo } from 'react'
import { blendColors, blendRamp } from '../utils/colorBlend'
import { getColorName } from '../utils/colorNames'

export default function ColorBlender({ palette, onCopyHex, onSaveFavorite }) {
  const [color1, setColor1] = useState(palette?.[0] || '#A24936')
  const [color2, setColor2] = useState(palette?.[1] || '#FFB4A4')
  const [ratio, setRatio] = useState(0.5)
  const [rampSteps, setRampSteps] = useState(7)

  const blended = useMemo(() => blendColors(color1, color2, ratio), [color1, color2, ratio])
  const ramp = useMemo(() => blendRamp(color1, color2, rampSteps), [color1, color2, rampSteps])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Controls */}
      <div className="panel p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Color 1 */}
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-[var(--color-text-accent-muted)] uppercase tracking-widest mb-2 block">Color A</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value.toUpperCase())}
                className="w-12 h-12 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={color1}
                onChange={(e) => { if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) setColor1(e.target.value.toUpperCase()) }}
                className="flex-1 font-mono text-sm px-3 py-2 rounded-lg"
                style={{ background: 'var(--color-surface-overlay)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-ghost)' }}
              />
            </div>
          </div>

          {/* Blend Ratio */}
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-[var(--color-text-accent-muted)] uppercase tracking-widest mb-2 block">
              Mix — {Math.round(ratio * 100)}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(ratio * 100)}
              onChange={(e) => setRatio(Number(e.target.value) / 100)}
              className="w-full"
            />
          </div>

          {/* Color 2 */}
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-[var(--color-text-accent-muted)] uppercase tracking-widest mb-2 block">Color B</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value.toUpperCase())}
                className="w-12 h-12 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={color2}
                onChange={(e) => { if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) setColor2(e.target.value.toUpperCase()) }}
                className="flex-1 font-mono text-sm px-3 py-2 rounded-lg"
                style={{ background: 'var(--color-surface-overlay)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-ghost)' }}
              />
            </div>
          </div>
        </div>

        {/* Palette quick pick */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-[var(--color-text-tertiary)] self-center mr-1">Palette:</span>
          {(palette || []).map((c, i) => (
            <button
              key={i}
              onClick={() => setColor1(c)}
              className="w-7 h-7 rounded-md border border-[var(--color-border-ghost)] cursor-pointer hover:scale-110 transition-transform"
              style={{ background: c }}
              title={`Set as Color A: ${c}`}
            />
          ))}
          {(palette || []).map((c, i) => (
            <button
              key={`b-${i}`}
              onClick={() => setColor2(c)}
              className="w-7 h-7 rounded-md border border-[var(--color-border-ghost)] cursor-pointer hover:scale-110 transition-transform ring-2 ring-offset-1 ring-[var(--color-border-accent)]"
              style={{ background: c }}
              title={`Set as Color B: ${c}`}
            />
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="panel p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          {/* Side by side */}
          <div className="flex gap-3 flex-1">
            <div
              className="w-20 h-20 rounded-xl cursor-pointer hover:scale-105 transition-transform"
              style={{ background: color1 }}
              onClick={() => onCopyHex?.(color1)}
              title={`Copy ${color1}`}
            />
            <div className="flex items-center text-[var(--color-text-tertiary)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            </div>
            <div
              className="w-20 h-20 rounded-xl cursor-pointer hover:scale-105 transition-transform"
              style={{ background: color2 }}
              onClick={() => onCopyHex?.(color2)}
              title={`Copy ${color2}`}
            />
          </div>

          {/* Blended result */}
          <div className="text-center">
            <div
              className="w-28 h-28 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform mx-auto flex items-center justify-center"
              style={{ background: blended }}
              onClick={() => onCopyHex?.(blended)}
              title={`Copy ${blended}`}
            >
              <span className="text-xs font-mono font-bold px-2 py-1 rounded" style={{ color: 'inherit', filter: 'brightness(0.8)' }}>
                {blended}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-2">{getColorName(blended)}</p>
          </div>
        </div>
      </div>

      {/* Blend Ramp */}
      <div className="panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-[var(--color-text-accent-muted)] uppercase tracking-widest">Blend Ramp</h3>
          <div className="flex items-center gap-3">
            <label className="text-xs text-[var(--color-text-tertiary)]">Steps:</label>
            <input
              type="range"
              min={3}
              max={15}
              value={rampSteps}
              onChange={(e) => setRampSteps(Number(e.target.value))}
              className="w-20"
            />
            <span className="font-mono text-xs" style={{ color: 'var(--color-text-primary)' }}>{rampSteps}</span>
          </div>
        </div>

        {/* Ramp strip */}
        <div
          className="h-20 rounded-xl overflow-hidden flex cursor-pointer mb-4"
          onClick={() => {
            const colors = ramp.join(', ')
            navigator.clipboard.writeText(colors)
            onCopyHex?.('Colors copied')
          }}
          title="Click to copy all colors"
        >
          {ramp.map((c, i) => (
            <div key={i} className="flex-1 group relative" style={{ background: c }}>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono font-bold bg-black/40 text-white px-1.5 py-0.5 rounded">{c}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Save ramp */}
        <div className="flex justify-end">
          <button
            onClick={() => onSaveFavorite?.(ramp, `Blend — ${color1} → ${color2}`)}
            className="btn btn-outline"
          >
            Save Ramp
          </button>
        </div>
      </div>
    </div>
  )
}
