import React, { useState } from 'react'
import PropTypes from 'prop-types'

export default function GradientPanel({ palette, onApplyPalette, onCopyHex }) {
  const [stops, setStops] = useState(
    palette && palette.length >= 2 
      ? palette.slice(0, 2).map((c, i) => ({ color: c, position: i === 0 ? 0 : 100 })) 
      : [{ color: '#6366F1', position: 0 }, { color: '#A855F7', position: 100 }]
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
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
      {/* Left: Controls */}
      <div className="w-full lg:w-96 space-y-6">
        <div className="p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gradient Stops</label>
            <button 
              onClick={handleAddStop}
              disabled={stops.length >= 5}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 disabled:opacity-30 transition-colors"
            >
              + Add Stop
            </button>
          </div>

          <div className="space-y-4">
            {stops.map((stop, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-700/30 group">
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
                    className="w-full accent-indigo-500"
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500 w-8">{stop.position}%</span>
                {stops.length > 2 && (
                  <button 
                    onClick={() => handleRemoveStop(i)}
                    className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Angle</label>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{angle}°</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="360" 
            value={angle} 
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
              <button 
                key={a}
                onClick={() => setAngle(a)}
                className={`text-[10px] font-bold py-1 rounded border transition-all ${angle === a ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:text-slate-300'}`}
              >
                {a}°
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="flex-1 space-y-6">
        <div className="p-8 bg-slate-900/40 rounded-3xl border border-slate-800/60 shadow-xl overflow-hidden flex flex-col h-full">
           <h3 className="text-xl font-bold text-white mb-6">Preview</h3>
           
           <div 
             className="flex-1 w-full min-h-[300px] rounded-2xl shadow-2xl border border-white/5 relative group"
             style={{ background: gradientString }}
           >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
                <button 
                  onClick={handleCopyCSS}
                  className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  Copy CSS
                </button>
              </div>
           </div>

           <div className="mt-8 p-4 bg-slate-900/80 rounded-xl border border-slate-800 font-mono text-[11px] text-indigo-300 overflow-x-auto whitespace-nowrap scrollbar-hide">
             {`background: ${gradientString};`}
           </div>

           <div className="mt-8 flex flex-wrap gap-4 pt-8 border-t border-slate-800/60 mt-auto">
             <button 
                onClick={() => onApplyPalette(stops.map(s => s.color))}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20"
             >
               Apply Colors to Palette
             </button>
             <button 
                onClick={() => setStops(palette.slice(0, 5).map((c, i) => ({ color: c, position: Math.round((i / (Math.min(palette.length, 5) - 1)) * 100) })))}
                className="btn bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-8 py-3 rounded-xl font-bold"
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
