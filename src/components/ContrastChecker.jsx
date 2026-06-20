import React, { useState, useMemo } from 'react'
import { wcagLevel, readableTextColor } from '../utils/colors'
import { getColorName } from '../utils/colorNames'

export default function ContrastChecker({ palette, onCopyHex }) {
  const [fg, setFg] = useState(palette?.[0] || '#FFFFFF')
  const [bg, setBg] = useState(palette?.[1] || '#1A1110')

  const result = useMemo(() => wcagLevel(fg, bg), [fg, bg])
  const fgText = readableTextColor(fg)
  const bgText = readableTextColor(bg)

  function SwapButton() {
    return (
      <button
        onClick={() => { setFg(bg); setBg(fg) }}
        className="icon-btn mx-2"
        title="Swap colors"
        aria-label="Swap foreground and background"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
        </svg>
      </button>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Color Pickers */}
      <div className="panel p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Foreground */}
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-[var(--color-text-accent-muted)] uppercase tracking-widest mb-2 block">Foreground</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value.toUpperCase())}
                className="w-12 h-12 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={fg}
                onChange={(e) => { if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) setFg(e.target.value.toUpperCase()) }}
                className="flex-1 font-mono text-sm px-3 py-2 rounded-lg"
                style={{ background: 'var(--color-surface-overlay)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-ghost)' }}
                aria-label="Foreground hex"
              />
            </div>
          </div>

          <SwapButton />

          {/* Background */}
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-[var(--color-text-accent-muted)] uppercase tracking-widest mb-2 block">Background</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value.toUpperCase())}
                className="w-12 h-12 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={bg}
                onChange={(e) => { if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) setBg(e.target.value.toUpperCase()) }}
                className="flex-1 font-mono text-sm px-3 py-2 rounded-lg"
                style={{ background: 'var(--color-surface-overlay)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-ghost)' }}
                aria-label="Background hex"
              />
            </div>
          </div>
        </div>

        {/* Quick pick from palette */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-[var(--color-text-tertiary)] self-center mr-1">Palette:</span>
          {(palette || []).map((c, i) => (
            <button
              key={i}
              onClick={() => setFg(c)}
              className="w-7 h-7 rounded-md border border-[var(--color-border-ghost)] cursor-pointer hover:scale-110 transition-transform"
              style={{ background: c }}
              title={`Set as foreground: ${c}`}
            />
          ))}
        </div>
      </div>

      {/* Contrast Ratio */}
      <div className="panel p-6">
        <div className="text-center mb-6">
          <div className="text-6xl font-bold tracking-tight mb-2" style={{ color: 'var(--color-text-primary)' }}>
            {result.ratio}:1
          </div>
          <div className="text-sm text-[var(--color-text-secondary)]">Contrast Ratio</div>
        </div>

        {/* WCAG Results */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'AA Normal', pass: result.AA, desc: '≥ 4.5:1' },
            { label: 'AA Large', pass: result.AA_Large, desc: '≥ 3:1' },
            { label: 'AAA Normal', pass: result.AAA, desc: '≥ 7:1' },
            { label: 'AAA Large', pass: result.AA_Large, desc: '≥ 4.5:1' },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-xl text-center"
              style={{
                background: item.pass ? 'var(--color-surface-accent)' : 'var(--color-surface-overlay)',
                border: `1px solid ${item.pass ? 'var(--color-border-accent)' : 'var(--color-border-ghost)'}`,
              }}
            >
              <div className="text-lg font-bold" style={{ color: item.pass ? 'var(--color-success)' : 'var(--color-error)' }}>
                {item.pass ? 'PASS' : 'FAIL'}
              </div>
              <div className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>{item.label}</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)]">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div className="panel p-6">
        <h3 className="text-xs font-bold text-[var(--color-text-accent-muted)] uppercase tracking-widest mb-4">Preview</h3>
        <div className="rounded-xl overflow-hidden" style={{ background: bg }}>
          <div className="p-8 space-y-4">
            <p className="text-3xl font-bold" style={{ color: fg }}>Heading Text</p>
            <p className="text-lg" style={{ color: fg }}>Body text at 18px — {getColorName(fg)} on {getColorName(bg)}</p>
            <p className="text-sm" style={{ color: fg }}>Small text at 14px — The quick brown fox jumps over the lazy dog.</p>
            <div className="flex gap-3 pt-2">
              <button
                className="btn btn-primary text-sm"
                style={{ background: fg, color: bg }}
                onClick={() => onCopyHex?.(fg)}
              >
                Button Sample
              </button>
              <button
                className="btn text-sm"
                style={{ background: 'transparent', color: fg, border: `2px solid ${fg}` }}
                onClick={() => onCopyHex?.(bg)}
              >
                Outline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
