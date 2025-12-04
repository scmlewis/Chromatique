import React, { useState } from 'react'
import HSLPanel from './HSLPanel'
import ImageUploader from './ImageUploader'
import PaletteCard from './PaletteCard'
import Toast from './Toast'

export default function TabContents(props) {
  const { palette, locks, favorites, toast, onToggleLock, onCopy, onSaveFavorite, onExportJSON, onLoadFavorite, onRemoveFavorite, onCloseToast, onUndoSave, onGeneratePalette, count, setCount, settings, onApplyPalette, onApplyAndLock } = props
  const [copiedFav, setCopiedFav] = useState(null)
  const [openMenuFav, setOpenMenuFav] = useState(null)
  const [extractedColors, setExtractedColors] = useState([])
  const [extractedName, setExtractedName] = useState('')

  // generate a PNG image of a palette array and trigger download
  function downloadPalettePNG(colors, name = 'palette') {
    try {
      const cols = colors.length
      const sw = 180
      const padding = 20
      const width = sw * cols
      const height = sw + 80
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      // background
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, width, height)
      // draw swatches
      colors.forEach((c, i) => {
        ctx.fillStyle = c
        ctx.fillRect(i * sw, 0, sw, sw)
        // label
        ctx.fillStyle = '#E6EDF3'
        ctx.font = '14px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(c, i * sw + sw / 2, sw + 24)
      })
      // filename
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `${name.replace(/\s+/g,'_')}.png`
      a.click()
    } catch (e) {
      // ignore
    }
  }
  const [tab, setTab] = useState('hsl')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [modalColors, setModalColors] = useState([])
  const [modalName, setModalName] = useState('')

  function headerFor(tabKey) {
    switch (tabKey) {
      case 'hsl':
        return {
          title: 'HSL Color Palette Generator',
          desc: 'Adjust the sliders to define the base color (H, S, L). Click on any color block to copy its HEX value.'
        }
      case 'palette':
        return {
          title: 'Swatches',
          desc: 'View generated swatches. Click a swatch to copy its HEX; lock a color to keep it when regenerating.'
        }
      case 'favorites':
        return {
          title: 'Favorites',
          desc: 'Saved palettes you can load or export. Use the menu to copy or download palettes.'
        }
      case 'export':
        return {
          title: 'Export',
          desc: 'Export the current palette as JSON, CSS variables, SCSS map, Tailwind config, or PNG.'
        }
      case 'image':
        return {
          title: 'Extract From Image',
          desc: 'Upload an image to extract dominant colors; apply them to the palette or save as a favorite.'
        }
      default:
        return { title: '', desc: '' }
    }
  }

  return (
    <div className="mt-6">
      <div className="mb-4">
          <div className="flex gap-3">
          <button className={`px-3 py-1 rounded-md ${tab==='hsl' ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab('hsl')}>HSL</button>
          <button className={`px-3 py-1 rounded-md ${tab==='palette' ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab('palette')}>Swatches</button>
          <button className={`px-3 py-1 rounded-md ${tab==='favorites' ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab('favorites')}>Favorites</button>
          <button className={`px-3 py-1 rounded-md ${tab==='export' ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab('export')}>Export</button>
          <button className={`px-3 py-1 rounded-md ${tab==='image' ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab('image')}>Image</button>
        </div>
      </div>

      {/* Tab header + description */}
      {(() => {
        const h = headerFor(tab)
        return (
          <div className="mb-6">
            {h.title && <h2 className="text-2xl font-semibold mb-1">{h.title}</h2>}
            {h.desc && <p className="text-sm text-slate-400">{h.desc}</p>}
          </div>
        )
      })()}

      {tab === 'hsl' && (
        <HSLPanel onRequestSave={(colors) => { setModalColors(colors); setModalName(''); setShowSaveModal(true) }} onRequestExport={(colors) => { setModalColors(colors); setShowExportModal(true) }} onCopyHex={onCopy} settings={settings} />
      )}

      {tab === 'palette' && (
        <section className="mb-8">
          <div className="mb-4 control-panel">
            <div className="control-left">
              <label className="text-sm text-slate-300">Colors: <span className="font-medium text-slate-100">{count}</span></label>
              <input
                aria-label="Number of colors"
                type="range"
                min={3}
                max={10}
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="accent-indigo-500 range-compact"
              />
            </div>

            <div className="control-right">
              <button onClick={() => onGeneratePalette && onGeneratePalette()} className="btn btn-primary">Generate</button>
              <button onClick={() => { setModalColors(palette); setModalName(''); setShowSaveModal(true) }} className="btn btn-success">Save</button>
              <button onClick={() => { setModalColors(palette); setShowExportModal(true) }} className="btn btn-outline">Export</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 palette-grid">
            {palette && palette.length > 0 ? (
              palette.map((c, i) => (
                <div className="palette-card" key={`${c}-${i}`}>
                  <PaletteCard
                    color={c}
                    locked={!!(locks && locks[i])}
                    onToggleLock={() => onToggleLock(i)}
                    onCopy={() => onCopy(c)}
                    delay={i * 60}
                    settings={settings}
                  />
                </div>
              ))
            ) : (
              <div className="text-slate-400">No colors yet</div>
            )}
          </div>
        </section>
      )}

      {tab === 'image' && (
        <section className="mb-8">
          <h2 className="text-lg font-medium mb-3">Extract from Image</h2>
          <ImageUploader onExtract={(cols) => { setExtractedColors(cols); setExtractedName(''); }} />
          {extractedColors && extractedColors.length > 0 && (
            <div className="mt-4">
              <div className="flex gap-2 items-center mb-3">
                <div className="flex gap-2">
                  {extractedColors.map(c => (<div key={c} className="w-12 h-12 rounded border" style={{ background: c }} />))}
                </div>
                <div className="ml-4">
                  <input value={extractedName} onChange={e => setExtractedName(e.target.value)} placeholder="Palette name (optional)" className="bg-slate-800/50 p-1 rounded text-sm" />
                </div>
                <div className="ml-auto flex gap-2">
                  <button className="btn btn-primary" onClick={() => { onApplyPalette && onApplyPalette(extractedColors); setTab('palette') }}>Apply to palette</button>
                  <button className="btn btn-success" onClick={() => { onSaveFavorite && onSaveFavorite(extractedColors, extractedName); setExtractedColors([]); setExtractedName('') }}>Save as favorite</button>
                  <button className="btn btn-outline" onClick={() => { navigator.clipboard.writeText(extractedColors.join('\n')) }}>Copy HEX list</button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSaveModal(false)} />
          <div className="relative z-60 w-full max-w-lg p-6 bg-slate-900 rounded-md shadow-lg text-slate-100">
            <h3 className="text-lg font-semibold mb-2">Save Palette</h3>
            <p className="text-sm text-slate-400 mb-4">Give this palette a name to make it easy to find later.</p>
            <input value={modalName} onChange={e => setModalName(e.target.value)} placeholder="My Palette name" className="w-full p-2 rounded-md bg-slate-800/50 mb-4 text-slate-100 placeholder:text-slate-400" />
            <div className="flex justify-end gap-3">
              <button className="btn btn-ghost" onClick={() => setShowSaveModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={() => { onSaveFavorite && onSaveFavorite(modalColors, modalName); setShowSaveModal(false) }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowExportModal(false)} />
          <div className="relative z-60 w-full max-w-lg p-6 bg-slate-900 rounded-md shadow-lg text-slate-100">
            <h3 className="text-lg font-semibold mb-2">Export Palette</h3>
            <p className="text-sm text-slate-400 mb-4">Choose an export format for the current palette.</p>
            <div className="flex flex-col gap-3">
              <button className="btn btn-outline" onClick={() => { onExportJSON && onExportJSON(modalColors); setShowExportModal(false) }}>Download JSON</button>
              <button className="btn btn-ghost" onClick={() => { const cssVars = modalColors.map((c, i) => `--color-${i+1}: ${c};`).join('\n'); navigator.clipboard.writeText(cssVars); setShowExportModal(false) }}>Copy CSS variables</button>
              <button className="btn btn-ghost" onClick={() => { navigator.clipboard.writeText(modalColors.join('\n')); setShowExportModal(false) }}>Copy HEX list</button>
              <button className="btn btn-ghost" onClick={() => {
                const scss = `$palette: (\n${modalColors.map((c,i)=>`  "color-${i+1}": ${c}`).join(',\n')}\n);`
                navigator.clipboard.writeText(scss); setShowExportModal(false)
              }}>Copy SCSS map</button>
              <button className="btn btn-ghost" onClick={() => {
                const tailwind = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${modalColors.map((c,i)=>`        'palette-${i+1}': '${c}',`).join('\n')}\n      }\n    }\n  }\n}`
                navigator.clipboard.writeText(tailwind); setShowExportModal(false)
              }}>Copy Tailwind config</button>
            </div>
            <div className="flex justify-end mt-4">
              <button className="btn btn-ghost" onClick={() => setShowExportModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'favorites' && (
        <section className="mb-8">
          <h2 className="text-lg font-medium mb-3">Favorites</h2>
          <div className="flex gap-3 flex-wrap">
            {favorites && favorites.length > 0 ? favorites.map(f => (
              <div key={f.id} className="p-3 rounded-md bg-slate-800/40 glass cursor-pointer relative" onClick={() => onLoadFavorite(f.colors)}>
                <div className="btn-wrap" style={{ position: 'absolute', top: -10, right: -10 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemoveFavorite(f.id) }}
                    title="Remove favorite"
                    className="bg-slate-700 hover:bg-red-600 p-1 rounded-full icon-btn"
                    aria-label="Remove favorite"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M9 3h6l1 2h4v2H4V5h4l1-2zM6 7h12l-1 14a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7z" />
                    </svg>
                  </button>
                  <span className="tooltip">Remove</span>
                </div>
                <div className="mb-2">
                  <div className="font-semibold text-slate-100">{f.name || 'Saved Palette'}</div>
                  <div className="text-xs text-slate-400">{new Date(f.createdAt || f.id).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  {f.colors.slice(0,6).map((col, idx) => (
                    <div key={idx} className="w-10 h-10 rounded-sm" style={{ background: col }} />
                  ))}
                </div>
                <div className="mt-3 relative">
                  <button className="btn btn-ghost text-sm" onClick={(e) => { e.stopPropagation(); setOpenMenuFav(openMenuFav === f.id ? null : f.id) }}>Export ▾</button>
                  {openMenuFav === f.id && (
                    <div className="fav-menu absolute right-0 mt-2 w-56 p-2 bg-slate-800 rounded shadow-lg z-40">
                      <button className="w-full text-left px-2 py-1 hover:bg-slate-700 rounded" onClick={(e) => { e.stopPropagation(); onExportJSON && onExportJSON(f.colors); setOpenMenuFav(null) }}>Download JSON</button>
                      <button className="w-full text-left px-2 py-1 hover:bg-slate-700 rounded" onClick={async (e) => { e.stopPropagation(); const css = f.colors.map((c,i)=>`--color-${i+1}: ${c};`).join('\n'); await navigator.clipboard.writeText(css); setCopiedFav({ id: f.id, type: 'CSS' }); setTimeout(()=>setCopiedFav(null),1200); setOpenMenuFav(null) }}>Copy CSS variables</button>
                      <button className="w-full text-left px-2 py-1 hover:bg-slate-700 rounded" onClick={async (e) => { e.stopPropagation(); await navigator.clipboard.writeText(f.colors.join('\n')); setCopiedFav({ id: f.id, type: 'HEX' }); setTimeout(()=>setCopiedFav(null),1200); setOpenMenuFav(null) }}>Copy HEX list</button>
                      <button className="w-full text-left px-2 py-1 hover:bg-slate-700 rounded" onClick={async (e) => { e.stopPropagation(); const scss = `$palette: (\n${f.colors.map((c,i)=>`  "color-${i+1}": ${c}`).join(',\n')}\n);`; await navigator.clipboard.writeText(scss); setCopiedFav({ id: f.id, type: 'SCSS' }); setTimeout(()=>setCopiedFav(null),1200); setOpenMenuFav(null) }}>Copy SCSS map</button>
                      <button className="w-full text-left px-2 py-1 hover:bg-slate-700 rounded" onClick={async (e) => { e.stopPropagation(); const tailwind = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${f.colors.map((c,i)=>`        'palette-${i+1}': '${c}',`).join('\n')}\n      }\n    }\n  }\n}`; await navigator.clipboard.writeText(tailwind); setCopiedFav({ id: f.id, type: 'Tailwind' }); setTimeout(()=>setCopiedFav(null),1200); setOpenMenuFav(null) }}>Copy Tailwind config</button>
                      <button className="w-full text-left px-2 py-1 hover:bg-slate-700 rounded" onClick={(e) => { e.stopPropagation(); downloadPalettePNG(f.colors, f.name || `palette-${f.id}`); setOpenMenuFav(null) }}>Download PNG</button>
                    </div>
                  )}
                  {copiedFav && copiedFav.id === f.id && <div className="text-emerald-400 text-xs mt-2">Copied {copiedFav.type}</div>}
                </div>
              </div>
            )) : (
              <div className="text-slate-500">No saved palettes yet</div>
            )}
          </div>
        </section>
      )}

      {tab === 'export' && (
        <section className="mb-8">
          <h2 className="text-lg font-medium mb-3">Export</h2>
          <div className="flex gap-3">
            <button onClick={onSaveFavorite} className="px-3 py-2 border border-slate-700 rounded-md">Save Favorite</button>
            <button onClick={onExportJSON} className="px-3 py-2 border border-slate-700 rounded-md">Export JSON</button>
          </div>
        </section>
      )}

      {toast && (
        <Toast
          message={toast.message}
          actionLabel={toast.actionLabel}
          previewColors={toast.previewColors}
          onAction={() => onUndoSave(toast.id)}
          onClose={onCloseToast}
        />
      )}
    </div>
  )
}
