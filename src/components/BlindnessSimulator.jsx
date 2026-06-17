import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { simulateBlindness } from '../utils/colors'

const DEFICIENCIES = [
  { id: 'protanopia', label: 'Protanopia', desc: 'Red-blind (1% of males)', impact: 'Difficulty distinguishing red/green and blue/purple.' },
  { id: 'deuteranopia', label: 'Deuteranopia', desc: 'Green-blind (1% of males)', impact: 'Similar to protanopia; most common form of color blindness.' },
  { id: 'tritanopia', label: 'Tritanopia', desc: 'Blue-blind (<1% of population)', impact: 'Difficulty distinguishing blue/green and yellow/violet.' },
  { id: 'achromatopsia', label: 'Achromatopsia', desc: 'Total color blind', impact: 'Sees only in shades of grey. Very rare.' },
]

export default function BlindnessSimulator({ palette }) {
  const [selected, setSelected] = useState('deuteranopia')

  if (!palette || palette.length === 0) {
    return (
      <div className="p-12 text-center bg-[var(--color-surface-container-low)] rounded-3xl">
        <p className="text-[var(--color-text-accent-faint)] font-medium">Generate a palette first to simulate vision deficiencies.</p>
      </div>
    )
  }

  const simulatedPalette = palette.map(c => simulateBlindness(c, selected))
  const activeDeficiency = DEFICIENCIES.find(d => d.id === selected)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {DEFICIENCIES.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelected(d.id)}
            className={`p-4 rounded-2xl text-left transition-all border ${
              selected === d.id 
                ? 'bg-[var(--color-primary)] text-[var(--color-surface-dim)] shadow-lg shadow-[var(--color-primary)]/25 border-transparent' 
                : 'bg-[var(--color-surface-container)] text-[var(--color-primary)] border-[var(--color-border-ghost)] hover:bg-[var(--color-surface-container-high)] hover:border-[var(--color-border-ghost-hover)] hover:shadow-md'
            }`}
          >
            <div className="font-bold mb-1">{d.label}</div>
            <div className={`text-[10px] uppercase tracking-wider font-semibold opacity-70 ${selected === d.id ? 'text-[var(--color-surface-dim)]' : 'text-[var(--color-primary)]'}`}>
              {d.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Info Card */}
      <div className="p-6 bg-[var(--color-surface-container-low)] rounded-2xl flex gap-4 items-center shadow-md">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[var(--color-text-accent)] shrink-0" style={{ background: 'var(--color-surface-accent)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-1" style={{ color: 'var(--color-text-primary)' }}>{activeDeficiency.label} Impact</h4>
          <p className="text-sm text-[var(--color-text-accent-muted)] leading-relaxed">{activeDeficiency.impact}</p>
        </div>
      </div>

      {/* Comparison View */}
      <div className="space-y-6">
        {/* Original */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest">Normal Vision (Original)</span>
          </div>
          <div className="flex w-full h-24 rounded-2xl overflow-hidden shadow-lg">
            {palette.map((c, i) => (
              <div 
                key={i} 
                className="flex-1 transition-all duration-500" 
                style={{ backgroundColor: c }} 
                title={`Original: ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Simulated */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-[var(--color-text-accent-muted)] uppercase tracking-widest italic">{activeDeficiency.label} Simulation</span>
          </div>
          <div className="flex w-full h-32 rounded-3xl overflow-hidden shadow-2xl">
            {simulatedPalette.map((c, i) => (
              <div 
                key={i} 
                className="flex-1 transition-all duration-500 group relative" 
                style={{ backgroundColor: c }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                   <span className="bg-black/60 text-white text-[10px] font-mono px-2 py-1 rounded-full border border-white/10">{c}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {palette.map((c, i) => (
          <div key={i} className="p-4 bg-[var(--color-surface-container-low)] rounded-2xl flex flex-col gap-3 shadow-md">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: c }} />
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase">Original</span>
                  <span className="text-xs font-mono text-[var(--color-text-accent-faint)]">{c}</span>
               </div>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: simulatedPalette[i] }} />
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[var(--color-text-accent-muted)] uppercase">Simulated</span>
                  <span className="text-xs font-mono text-[var(--color-text-accent-faint)]">{simulatedPalette[i]}</span>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}

BlindnessSimulator.propTypes = {
  palette: PropTypes.arrayOf(PropTypes.string).isRequired,
}

