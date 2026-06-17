import React, { useState } from 'react'
import PropTypes from 'prop-types'

export default function GradientPanel({ palette, onApplyPalette, onCopyHex }) {
  const [stops, setStops] = useState(
    palette && palette.length >= 2 
      ? palette.slice(0, 2).map((c, i) => ({ color: c, position: i === 0 ? 0 : 100 })) 
      : [{ color: '#d4af37', position: 0 }, { color: '#b87333', position: 100 }]
  )
  const [angle, setAngle] = useState(135)

  const gradientString = `linear-gradient(${angle}deg, ${stops
    .sort((a,b) => a.position - b.position)
    .map(s => `${s.color} ${s.position}%`)
    .join(', ')})`

  const handleUpdateStop = (index, updates) => {
    const newStops = [...stops]
    newStops[index] = { ...newStops[index], ...updates }
    setStops(newStops)
  }

  const handleAddStop = () => {
    if (stops.length >= 5) return
    const lastStop = stops[stops.length - 1]
    const newPosition = Math.min(100, lastStop.position + 10)
    setStops([...stops, { color: '#ffffff', position: newPosition }])
  }

  const handleRemoveStop = (index) => {
    if (stops.length <= 2) return
    setStops(stops.filter((_, i) => i !== index))
  }

  const handleCopyCSS = () => {
    navigator.clipboard.writeText(`background: ${gradientString};`)
    onCopyHex(gradientString) // Use the toast notification from App.jsx
  }

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-8 animate-fade-in">
      {/* Left: Controls */}
      <div className="w-full lg:w-96 space-y-4 lg:space-y-6">
        <div className="p-6 bg-[var(--color-surface-container-low)] rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-6">
            <label className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">Gradient Stops</label>
            <button 
              onClick={handleAddStop}
              disabled={stops.length >= 5}
              className="text-xs font-bold text-[var(--color-text-accent)] hover:text-[var(--color-text-accent-faint)] disabled:opacity-30 transition-colors"
            >
              + Add Stop
            </button>
          </div>

          <div className="space-y-4">
            {stops.map((stop, i) => (
              <div key={i} className="flex items-center gap-3 bg-[var(--color-surface-container)] p-3 rounded-xl shadow-sm group">
                <input 
                  type="color" 
                  value={stop.color} 
                  onChange={(e) => handleUpdateStop(i, { color: e.target.value })}
                  className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer overflow-hidden p-0"
                />
                <div className="flex-1">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={stop.position} 
                    onChange={(e) => handleUpdateStop(i, { position: parseInt(e.target.value) })}
                    className="w-full accent-[var(--color-primary)]"
                  />
                </div>
                <span className="text-[10px] font-mono text-[var(--color-primary)] w-8">{stop.position}%</span>
                {stops.length > 2 && (
                  <button 
                    onClick={() => handleRemoveStop(i)}
                    className="p-1 text-[var(--color-primary)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-[var(--color-surface-container-low)]/95 rounded-2xl border border-[var(--color-border-ghost)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">Angle</label>
            <span className="text-xs font-mono text-[var(--color-text-accent)] bg-[var(--color-surface-accent)] px-2 py-0.5 rounded">{angle}°</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="360" 
            value={angle} 
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
              <button 
                key={a}
                onClick={() => setAngle(a)}
                className={`text-[10px] font-bold py-1 rounded border transition-all ${angle === a ? 'btn-primary' : 'btn-outline'}`}
              >
                {a}°
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="flex-1 space-y-6">
        <div className="p-8 bg-[var(--color-surface-container-low)] rounded-3xl shadow-lg overflow-hidden flex flex-col h-full">
           <h3 className="text-xl font-bold text-white mb-6">Preview</h3>
           
           <div 
             className="flex-1 w-full min-h-[300px] rounded-2xl shadow-2xl relative group"
             style={{ background: gradientString }}
           >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <button 
                  onClick={handleCopyCSS}
                  className="btn btn-primary"
                >
                  Copy CSS
                </button>
              </div>
           </div>

           <div className="mt-8 p-4 rounded-xl font-mono text-[11px] text-[var(--color-text-accent-faint)] overflow-x-auto whitespace-nowrap scrollbar-hide shadow-inner" style={{ background: 'var(--color-surface-container)' }}>
             {`background: ${gradientString};`}
           </div>

           <div className="mt-8 flex flex-wrap gap-4 pt-8 border-t border-[var(--color-border-primary)] mt-auto">
             <button 
                onClick={() => onApplyPalette(stops.map(s => s.color))}
               className="btn btn-primary"
             >
               Apply Colors to Palette
             </button>
             <button 
                onClick={() => setStops(palette.slice(0, 5).map((c, i) => ({ color: c, position: Math.round((i / (Math.min(palette.length, 5) - 1)) * 100) })))}
                className="btn btn-outline"
             >
               Import From Palette
             </button>
           </div>
        </div>
      </div>
    </div>
  )
}

GradientPanel.propTypes = {
  palette: PropTypes.arrayOf(PropTypes.string).isRequired,
  onApplyPalette: PropTypes.func.isRequired,
  onCopyHex: PropTypes.func.isRequired,
}

