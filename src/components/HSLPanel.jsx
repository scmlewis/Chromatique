import React, { useState, useMemo } from 'react'
import HSLCard from './HSLCard'
import { hslToHex } from '../utils/colors'

const labelsByScheme = {
  analogous: ['Primary', 'Analogous 1', 'Analogous 2', 'Accent Tone 1', 'Accent Tone 2'],
  complementary: ['Primary', 'Light Primary', 'Dark Primary', 'Complementary', 'Light Complement'],
  'split-complementary': ['Primary', 'Accent 1', 'Accent 2', 'Primary Light', 'Accent 1 Dark'],
  triadic: ['Color 1 (Primary)', 'Color 2 (Accent)', 'Color 3 (Accent)', 'Color 1 (Light)', 'Color 2 (Dark)'],
  tetradic: ['Primary (H1)', 'Secondary (H2)', 'Complement 1 (H3)', 'Complement 2 (H4)', 'Primary Light'],
  monochromatic: ['Lightest Tone', 'Light Tone', 'Primary', 'Dark Tone', 'Darkest Tone']
}

export default function HSLPanel({ onRequestSave, onRequestExport, onCopyHex, settings = {} }) {
  const [h, setH] = useState(161)
  const [s, setS] = useState(81)
  const [l, setL] = useState(57)
  const [scheme, setScheme] = useState('triadic')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const generated = useMemo(() => {
    // generate palette according to the selected scheme
    function wrap(v) { return ((v % 360) + 360) % 360 }

    const out = []
    if (scheme === 'analogous') {
      // spread -40, -20, 0, +20, +40
      const deltas = [-40, -20, 0, 20, 40]
      deltas.forEach(d => {
        out.push({ h: wrap(h + d), s, l })
      })
    } else if (scheme === 'split-complementary') {
      const h_comp1 = wrap(h + 150)
      const h_comp2 = wrap(h + 210)

      out.push({ h: wrap(h), s, l })
      out.push({ h: h_comp1, s: Math.min(100, s + 10), l: Math.max(0, l - 10) })
      out.push({ h: h_comp2, s: Math.max(0, s - 10), l: Math.min(100, l + 10) })
      out.push({ h: wrap(h), s: Math.max(0, s - 20), l: Math.min(100, l + 30) })
      out.push({ h: h_comp1, s: Math.min(100, s + 15), l: Math.max(0, l - 20) })
    } else if (scheme === 'complementary') {
      // primary, primary tint, complement, complement tint, secondary
      out.push({ h: wrap(h), s, l })
      out.push({ h: wrap(h), s: Math.max(0, s - 20), l: Math.min(100, l + 12) })
      out.push({ h: wrap(h + 180), s, l })
      out.push({ h: wrap(h + 180), s: Math.max(0, s - 20), l: Math.min(100, l + 12) })
      out.push({ h: wrap(h + 30), s, l })
    } else if (scheme === 'triadic') {
      const tri = [0, 120, 240]
      out.push({ h: wrap(h + tri[0]), s, l })
      out.push({ h: wrap(h + tri[1]), s: Math.max(10, s - 8), l: Math.max(8, l - 12) })
      out.push({ h: wrap(h + tri[2]), s: Math.max(6, s - 4), l: Math.min(96, l + 12) })
      out.push({ h: wrap(h + 180), s: Math.min(100, s + 10), l: Math.max(10, l - 6) })
      out.push({ h: wrap(h + 30), s, l })
    } else if (scheme === 'monochromatic') {
      // vary lightness and saturation around base
      out.push({ h: wrap(h), s: Math.max(0, s - 18), l: Math.max(6, l - 20) })
      out.push({ h: wrap(h), s: Math.max(0, s - 6), l: Math.max(0, l - 6) })
      out.push({ h: wrap(h), s, l })
      out.push({ h: wrap(h), s: Math.min(100, s + 8), l: Math.min(96, l + 10) })
      out.push({ h: wrap(h), s: Math.min(100, s + 20), l: Math.min(98, l + 22) })
    } else {
      // tetradic (fallback)
      const h1 = wrap(h)
      const h2 = wrap(h + 30)
      const h3 = wrap(h + 180)
      const h4 = wrap(h + 210)

      out.push({ h: h1, s, l })
      out.push({ h: h2, s: Math.min(100, s + 5), l: Math.max(0, l - 10) })
      out.push({ h: h3, s: Math.min(100, s + 10), l: Math.min(100, l + 5) })
      out.push({ h: h4, s: Math.max(0, s - 10), l: Math.max(0, l - 5) })
      out.push({ h: h1, s: Math.max(0, s - 20), l: Math.min(100, l + 20) })
    }

    // ensure we have 5 entries; if less, pad with variations
    while (out.length < 5) out.push({ h: wrap(h), s, l })

    const vals = out.slice(0,5).map(entry => hslToHex(entry.h, entry.s, entry.l))
    const labels = labelsByScheme[scheme] || labelsByScheme.triadic
    return vals.map((hex, i) => ({ hex, title: labels[i] || `Color ${i+1}`, h: out[i].h, s: out[i].s, l: out[i].l }))
  }, [h, s, l, scheme])

  function computeHue(baseH, idx) {
    switch (idx) {
      case 0: return baseH
      case 1: return baseH
      case 2: return baseH
      case 3: return (baseH + 220) % 360
      case 4: return (baseH + 30) % 360
      default: return baseH
    }
  }

  function computeLightness(baseL, idx) {
    switch (idx) {
      case 0: return baseL
      case 1: return Math.max(0, baseL - 15)
      case 2: return Math.min(100, baseL + 15)
      case 3: return Math.max(0, baseL - 3)
      case 4: return baseL
      default: return baseL
    }
  }

  const hueGradient = 'linear-gradient(90deg, #ff0000 0%, #ffea00 16%, #00ff80 33%, #00e5ff 50%, #004bff 66%, #a400ff 83%, #ff0054 100%)'

  return (
    <section className="mb-10">
      {/* ========== CONTROL PANEL ========== */}
      <div className="surface-glass p-6 mb-6">
        <div className="grid gap-6">
          {/* Scheme Selection */}
          <div>
            <label className="text-label block mb-2">Palette Scheme</label>
            <select 
              value={scheme} 
              onChange={e => setScheme(e.target.value)} 
              className="input-field w-full"
            >
              <option value="analogous">Analogous</option>
              <option value="complementary">Complementary</option>
              <option value="split-complementary">Split Complementary</option>
              <option value="triadic">Triadic</option>
              <option value="tetradic">Tetradic (4 Hues)</option>
              <option value="monochromatic">Monochromatic</option>
            </select>
          </div>

          {/* Hue Slider */}
          <div>
            <label className="text-label block mb-2 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: hueGradient }}></span>
              Hue (H)
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min={0} 
                max={360} 
                value={h} 
                onChange={e => setH(Number(e.target.value))}
                className="hsl-range flex-1" 
                style={{ background: hueGradient }}
                aria-label="Hue slider"
              />
              <div className="text-label w-16 text-right font-mono">{Math.round(h)}°</div>
            </div>
          </div>

          {/* Saturation Slider */}
          <div>
            <label className="text-label block mb-2 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: `linear-gradient(90deg, hsl(${h},0%,50%) 0%, hsl(${h},100%,50%) 100%)` }}></span>
              Saturation (S)
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min={0} 
                max={100} 
                value={s} 
                onChange={e => setS(Number(e.target.value))}
                className="hsl-range flex-1" 
                style={{ background: `linear-gradient(90deg, hsl(${h},0%,50%) 0%, hsl(${h},100%,50%) 100%)` }}
                aria-label="Saturation slider"
              />
              <div className="text-label w-16 text-right font-mono">{Math.round(s)}%</div>
            </div>
          </div>

          {/* Lightness Slider */}
          <div>
            <label className="text-label block mb-2 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: `linear-gradient(90deg, hsl(${h}, ${s}%, 0%) 0%, hsl(${h}, ${s}%, 50%) 50%, hsl(${h}, ${s}%, 100%) 100%)` }}></span>
              Lightness (L)
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min={0} 
                max={100} 
                value={l} 
                onChange={e => setL(Number(e.target.value))}
                className="hsl-range flex-1" 
                style={{ background: `linear-gradient(90deg, hsl(${h}, ${s}%, 0%) 0%, hsl(${h}, ${s}%, 50%) 50%, hsl(${h}, ${s}%, 100%) 100%)` }}
                aria-label="Lightness slider"
              />
              <div className="text-label w-16 text-right font-mono">{Math.round(l)}%</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Generate Random Button */}
            <button
              onClick={() => {
                const randH = Math.floor(Math.random() * 360)
                const randS = Math.floor(40 + Math.random() * 40)
                const randL = Math.floor(30 + Math.random() * 40)
                setH(randH)
                setS(randS)
                setL(randL)
              }}
              className="btn btn-primary w-full"
              aria-label="Generate random palette"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v6h6M21 21v-6h-6"/>
              </svg>
              Generate Random
            </button>

            {/* Palette Controls */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={async () => {
                  try {
                    const text = generated.map(g => g.hex).join('\n')
                    await navigator.clipboard.writeText(text)
                    setCopied(true)
                    if (typeof onCopyHex === 'function') onCopyHex(text)
                    setTimeout(() => setCopied(false), 1500)
                  } catch (e) {
                    // ignore
                  }
                }}
                className="btn btn-secondary"
                aria-label="Copy all color codes"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>

              <button
                onClick={() => {
                  const colors = generated.map(g => g.hex)
                  if (typeof onRequestSave === 'function') onRequestSave(colors)
                  setSaved(true)
                  setTimeout(() => setSaved(false), 1600)
                }}
                className="btn btn-success"
                aria-label="Save palette to favorites"
              >
                {saved ? '✓ Saved' : 'Save'}
              </button>

              <button
                onClick={() => {
                  const colors = generated.map(g => g.hex)
                  if (typeof onRequestExport === 'function') onRequestExport(colors)
                }}
                className="btn btn-ghost"
                aria-label="Export palette"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========== GENERATED PALETTE GRID ========== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {generated.map((g, i) => (
          <div key={i}>
            <HSLCard 
              title={g.title} 
              color={g.hex} 
              h={g.h} 
              s={g.s} 
              l={g.l} 
              showCMYK={!!settings.showCMYK} 
              defaultCopy={settings.defaultCopy} 
            />
          </div>
        ))}
      </div>
    </section>
  )
}
