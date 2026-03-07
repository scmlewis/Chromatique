import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TabNav from './TabNav'
import HSLPanel from './HSLPanel'
import ImageUploader from './ImageUploader'
import PaletteCard from './PaletteCard'
import Toast from './Toast'
import { PALETTE_CARD_ANIMATION_DELAY_MS } from '../constants'

export default function TabContents(props) {
  const { palette, locks, favorites, toast, onToggleLock, onUpdateColor, onReorderPalette, onCopy, onSaveFavorite, onExportJSON, onLoadFavorite, onRemoveFavorite, onCloseToast, onUndoSave, onGeneratePalette, count, setCount, settings, onApplyPalette, onApplyAndLock, isGenerating } = props
  const [copiedFav, setCopiedFav] = useState(null)
  const [openMenuFav, setOpenMenuFav] = useState(null)
  const [extractedColors, setExtractedColors] = useState([])
  const [extractedName, setExtractedName] = useState('')
  const [showLoadConfirm, setShowLoadConfirm] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest') // 'newest', 'oldest', 'name'
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [modalColors, setModalColors] = useState([])
  const [modalName, setModalName] = useState('')
  const [modalTags, setModalTags] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [tab, setTab] = useState('hsl')

  // Filter and sort favorites
  const filteredFavorites = React.useMemo(() => {
    if (!favorites || favorites.length === 0) return []
    
    // Filter by search query and tags
    let filtered = favorites.filter(fav => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesName = fav.name.toLowerCase().includes(query)
        const matchesColor = fav.colors.some(color => color.toLowerCase().includes(query))
        const matchesTags = fav.tags && fav.tags.some(tag => tag.toLowerCase().includes(query))
        if (!matchesName && !matchesColor && !matchesTags) return false
      }
      
      // Tag filter
      if (filterTag) {
        if (!fav.tags || !fav.tags.includes(filterTag)) return false
      }
      
      return true
    })

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return (b.createdAt || b.id) - (a.createdAt || a.id)
      } else if (sortBy === 'oldest') {
        return (a.createdAt || a.id) - (b.createdAt || b.id)
      } else if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '')
      }
      return 0
    })

    return filtered
  }, [favorites, searchQuery, sortBy, filterTag])

  // Get all unique tags from favorites
  const allTags = React.useMemo(() => {
    if (!favorites) return []
    const tagSet = new Set()
    favorites.forEach(fav => {
      if (fav.tags && Array.isArray(fav.tags)) {
        fav.tags.forEach(tag => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  }, [favorites])

  // Handle drag and drop reordering
  const handleDragStart = (index) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    // Use parent's reorder function
    if (onReorderPalette) {
      onReorderPalette(draggedIndex, dropIndex)
    }
    
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

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
        <TabNav 
          tabs={[
            { key: 'hsl', label: 'HSL' },
            { key: 'palette', label: 'Swatches' },
            { key: 'favorites', label: 'Favorites' },
            { key: 'export', label: 'Export' },
            { key: 'image', label: 'Image' },
          ]}
          current={tab}
          onChange={setTab}
        />
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
              <button 
                onClick={() => onGeneratePalette && onGeneratePalette()} 
                className="btn btn-primary" 
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : 'Generate'}
              </button>
              <button onClick={() => { setModalColors(palette); setModalName(''); setShowSaveModal(true) }} className="btn btn-success">Save</button>
              <button onClick={() => { setModalColors(palette); setShowExportModal(true) }} className="btn btn-outline">Export</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 palette-grid">
            {palette && palette.length > 0 ? (
              palette.map((c, i) => (
                <div 
                  className={`palette-card ${draggedIndex === i ? 'opacity-50' : ''}`} 
                  key={`${c}-${i}`}
                  draggable="true"
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDrop={(e) => handleDrop(e, i)}
                  onDragEnd={handleDragEnd}
                  style={{ cursor: 'grab' }}
                >
                  <div className="relative">
                    {/* Drag handle indicator */}
                    <div className="absolute top-2 left-2 z-10 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
                      </svg>
                    </div>
                    <PaletteCard
                      color={c}
                      locked={!!(locks && locks[i])}
                      onToggleLock={() => onToggleLock(i)}
                      onColorChange={(newColor) => onUpdateColor && onUpdateColor(i, newColor)}
                      onCopy={() => onCopy(c)}
                      delay={i * PALETTE_CARD_ANIMATION_DELAY_MS}
                      settings={settings}
                    />
                  </div>
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
            <p className="text-sm text-slate-400 mb-4">Give this palette a name and optionally add tags.</p>
            <input 
              value={modalName} 
              onChange={e => setModalName(e.target.value)} 
              placeholder="My Palette name" 
              className="w-full p-2 rounded-md bg-slate-800/50 mb-3 text-slate-100 placeholder:text-slate-400" 
            />
            <input 
              value={modalTags} 
              onChange={e => setModalTags(e.target.value)} 
              placeholder="Tags (comma-separated, e.g. dark, modern, blue)" 
              className="w-full p-2 rounded-md bg-slate-800/50 mb-4 text-slate-100 placeholder:text-slate-400 text-sm" 
            />
            <div className="flex justify-end gap-3">
              <button className="btn btn-ghost" onClick={() => setShowSaveModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={() => { 
                const tags = modalTags.split(',').map(t => t.trim()).filter(t => t)
                onSaveFavorite && onSaveFavorite(modalColors, modalName, tags); 
                setShowSaveModal(false);
                setModalTags('');
              }}>Save</button>
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Favorites</h2>
            {favorites && favorites.length > 0 && (
              <div className="text-sm text-slate-400">
                {filteredFavorites.length} of {favorites.length} palette{favorites.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Search and Filter Controls */}
          {favorites && favorites.length > 0 && (
            <div className="mb-4 flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search palettes by name or color..."
                  className="w-full px-4 py-2 pl-10 bg-slate-800/50 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                    aria-label="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 pr-10 bg-slate-800/50 border border-slate-700 rounded-md text-slate-100 focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name (A-Z)</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-slate-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}

          {/* Tag filters */}
          {allTags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-slate-400">Filter by tag:</span>
              <button
                onClick={() => setFilterTag('')}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  !filterTag ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    filterTag === tag ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* No results message */}
          {filteredFavorites.length === 0 && searchQuery && (
            <div className="text-center py-8 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>No palettes found matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Favorites grid */}
          <div className="flex gap-3 flex-wrap">
            {filteredFavorites.length > 0 ? filteredFavorites.map(f => (
              <div key={f.id} className="p-3 rounded-md bg-slate-800/40 glass cursor-pointer relative" onClick={() => setShowLoadConfirm(f)}>
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
                  {/* Tags */}
                  {f.tags && f.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {f.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-0.5 bg-indigo-600/30 text-indigo-300 rounded-full text-xs border border-indigo-500/30"
                          onClick={(e) => { e.stopPropagation(); setFilterTag(tag) }}
                          title={`Filter by ${tag}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
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

      {/* Load Confirmation Modal */}
      {showLoadConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLoadConfirm(null)} />
          <div className="relative z-60 w-full max-w-lg p-6 bg-slate-800 rounded-lg shadow-xl text-slate-100 animate-pop">
            <h3 className="text-xl font-semibold mb-3">Load Palette?</h3>
            <p className="text-sm text-slate-400 mb-4">
              This will replace your current palette with <strong className="text-slate-200">{showLoadConfirm.name}</strong>
            </p>
            
            {/* Palette Preview */}
            <div className="mb-4 p-3 bg-slate-900/50 rounded-md">
              <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Preview ({showLoadConfirm.colors.length} colors)</div>
              <div className="grid grid-cols-5 gap-2">
                {showLoadConfirm.colors.map((col, idx) => (
                  <div key={idx} className="aspect-square rounded-md shadow-md border border-slate-700" style={{ background: col }}>
                    <div className="flex items-end justify-center h-full p-1">
                      <span className="text-xs font-mono bg-black/40 backdrop-blur-sm px-1 rounded" style={{ color: '#fff' }}>
                        {col}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors" 
                onClick={() => setShowLoadConfirm(null)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors" 
                onClick={() => {
                  onLoadFavorite && onLoadFavorite(showLoadConfirm.colors)
                  setShowLoadConfirm(null)
                }}
              >
                Load Palette
              </button>
            </div>
          </div>
        </div>
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

TabContents.propTypes = {
  palette: PropTypes.arrayOf(PropTypes.string),
  locks: PropTypes.arrayOf(PropTypes.bool),
  favorites: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  })),
  toast: PropTypes.shape({
    message: PropTypes.string.isRequired,
    actionLabel: PropTypes.string,
  }),
  onToggleLock: PropTypes.func.isRequired,
  onUpdateColor: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  onSaveFavorite: PropTypes.func.isRequired,
  onExportJSON: PropTypes.func.isRequired,
  onLoadFavorite: PropTypes.func.isRequired,
  onRemoveFavorite: PropTypes.func.isRequired,
  onCloseToast: PropTypes.func.isRequired,
  onUndoSave: PropTypes.func.isRequired,
  onGeneratePalette: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  setCount: PropTypes.func.isRequired,
  settings: PropTypes.object,
  onApplyPalette: PropTypes.func.isRequired,
  onApplyAndLock: PropTypes.func.isRequired,
  isGenerating: PropTypes.bool,
}
