import React, { useState } from 'react'
import { PRESET_CATEGORIES } from '../data/presetPalettes'
import { readableTextColor } from '../utils/colors'
import { getColorName } from '../utils/colorNames'

export default function PresetPalettes({ onApplyPalette, onCopyHex }) {
  const [activeCategory, setActiveCategory] = useState(PRESET_CATEGORIES[0].id)
  const [copiedColor, setCopiedColor] = useState(null)

  const category = PRESET_CATEGORIES.find(c => c.id === activeCategory) || PRESET_CATEGORIES[0]

  async function handleCopyColor(hex) {
    try {
      await navigator.clipboard.writeText(hex)
      setCopiedColor(hex)
      setTimeout(() => setCopiedColor(null), 1200)
    } catch (e) {}
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Category Tabs */}
      <div className="panel p-4 rounded-2xl">
        <div className="flex flex-wrap gap-2">
          {PRESET_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat.id
                  ? 'bg-[var(--color-surface-accent-strong)] text-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] mt-3">{category.description}</p>
      </div>

      {/* Palettes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {category.palettes.map((preset, i) => (
          <div
            key={i}
            className="panel rounded-2xl overflow-hidden hover:border-[var(--color-border-accent)] transition-all cursor-pointer group"
            onClick={() => onApplyPalette && onApplyPalette(preset.colors)}
          >
            {/* Color Strip */}
            <div className="flex h-20">
              {preset.colors.map((c, ci) => (
                <div
                  key={ci}
                  className="flex-1 relative group/swatch"
                  style={{ background: c }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopyColor(c) }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/swatch:opacity-100 transition-opacity"
                    title={`Copy ${c}`}
                  >
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/50" style={{ color: readableTextColor(c) }}>
                      {copiedColor === c ? '✓' : c}
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{preset.name}</div>
                <div className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">
                  {preset.colors.map(c => getColorName(c)).join(' · ')}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onApplyPalette && onApplyPalette(preset.colors) }}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-[var(--color-surface-accent)] text-[var(--color-primary)] hover:bg-[var(--color-surface-accent-strong)] transition-colors opacity-0 group-hover:opacity-100"
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
