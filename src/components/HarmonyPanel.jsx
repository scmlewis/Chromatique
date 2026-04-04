import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getHarmonyColors, hexToHsl, hslToHex, readableTextColor } from '../utils/colors'
import { HexColorPicker } from 'react-colorful'

const HARMONY_TYPES = [
  { id: 'complementary', label: 'Complementary', desc: 'Opposite on the color wheel' },
  { id: 'analogous', label: 'Analogous', desc: 'Colors next to each other' },
  { id: 'triadic', label: 'Triadic', desc: 'Three equally spaced colors' },
  { id: 'split-complementary', label: 'Split Complementary', desc: 'Base plus two colors adjacent to its complement' },
  { id: 'tetradic', label: 'Tetradic', desc: 'Four colors in a rectangle/square' },
  { id: 'monochromatic', label: 'Monochromatic', desc: 'Different shades and tints of the same hue' },
]

export default function HarmonyPanel({ baseColor, onApplyPalette, onSaveFavorite, onCopyHex }) {
  const [color, setColor] = useState(baseColor || '#d4af37')
  const [type, setType] = useState('triadic')
  const [harmonies, setHarmonies] = useState([])

  useEffect(() => {
    setHarmonies(getHarmonyColors(color, type))
  }, [color, type])

  return (
    <div className="flex flex-col gap-6">
      {/* 1. TOP BAR: Harmony Type Selection */}
      <div className="bg-amber-950/25 p-1.5 rounded-2xl border border-amber-900/35 flex flex-wrap gap-1.5 shadow-sm">
        {HARMONY_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`flex-1 min-w-[100px] h-9 md:h-8 text-center px-2 md:px-3 py-2 rounded-xl transition-all text-[10px] md:text-[11px] ${
              type === t.id 
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25' 
                : 'bg-transparent text-amber-300 hover:bg-stone-950/30 hover:text-amber-200'
            }`}
          >
            <div className="font-bold uppercase tracking-wider">{t.label}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 2. LEFT: Picker (Compact) */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          <div className="p-4 bg-amber-950/25 rounded-2xl border border-amber-900/35 shadow-sm">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-3 block">Base Color</span>
            <div className="flex flex-col items-center">
              <div className="w-full max-w-xs">
                <HexColorPicker color={color} onChange={setColor} />
              </div>
              <div className="mt-2 w-full flex items-center gap-2">
                <div 
                  className="w-10 h-10 md:w-8 md:h-8 rounded-lg border border-white/5 shadow-inner flex-shrink-0" 
                  style={{ backgroundColor: color }} 
                />
                <input 
                  type="text" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)}
                  inputMode="text"
                  pattern="^#?[0-9A-Fa-f]{6}$"
                  className="flex-1 bg-stone-950/40 border border-amber-900 px-3 py-1.5 md:py-1 rounded-lg text-xs font-mono uppercase text-white outline-none focus:border-amber-500"
                />
                <button 
                  onClick={() => onCopyHex(color)}
                  className="p-2 md:p-1.5 text-amber-300 hover:text-white hover:bg-amber-900 rounded-lg transition-colors border border-transparent hover:border-amber-800 flex-shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Subtler Tip box moved here */}
           <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-3 items-start">
             <div className="text-amber-300 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
             </div>
             <div>
                <h4 className="font-bold text-amber-200 text-[11px] uppercase tracking-wider mb-1">Tip</h4>
                <p className="text-[11px] text-amber-500 leading-normal">
                  {type === 'complementary' && 'Strong contrast for CTAs.'}
                  {type === 'analogous' && 'Natural and pleasing schemes.'}
                  {type === 'triadic' && 'Vibrant and balanced palettes.'}
                  {type === 'monochromatic' && 'Professional cohesive looks.'}
                  {!['complementary', 'analogous', 'triadic', 'monochromatic'].includes(type) && 'Advanced balanced harmony.'}
                </p>
             </div>
          </div>
        </div>

        {/* 3. RIGHT: Results Grid */}
        <div className="flex-1 p-6 bg-stone-950/30 rounded-3xl border border-stone-900/70 shadow-xl flex flex-col justify-between">
           <div>
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-white tracking-tight">Generated Results</h3>
                 <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[9px] font-bold text-amber-300 uppercase tracking-widest">
                    {type.replace('-', ' ')}
                 </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {harmonies.map((h, i) => (
                  <div key={i} className="group relative animate-pop" style={{ animationDelay: `${i * 30}ms` }}>
                    <div 
                      className="aspect-square w-full rounded-2xl border border-white/5 shadow-lg transition-all group-hover:scale-[1.05] group-hover:shadow-2xl cursor-pointer"
                      style={{ backgroundColor: h }}
                      onClick={() => onCopyHex(h)}
                    />
                    <div className="mt-2 text-center">
                      <span className="text-[10px] font-mono font-bold text-amber-500 group-hover:text-amber-300 transition-colors uppercase tracking-tight">{h}</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-stone-900/70">
             <button 
               onClick={() => onApplyPalette(harmonies)}
               className="btn bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-amber-600/20 transition-all active:scale-95"
             >
               Apply to Palette
             </button>
             <button 
               onClick={() => onSaveFavorite(harmonies, `${type} harmony from ${color}`)}
               className="btn bg-white/5 hover:bg-white/10 text-amber-200 border border-white/10 px-6 py-2 rounded-xl text-xs font-bold transition-all"
             >
               Save as Favorite
             </button>
           </div>
        </div>
      </div>
    </div>
  )
}

HarmonyPanel.propTypes = {
  baseColor: PropTypes.string,
  onApplyPalette: PropTypes.func.isRequired,
  onSaveFavorite: PropTypes.func.isRequired,
  onCopyHex: PropTypes.func.isRequired,
}

