import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TabNav from './TabNav'
import HSLPanel from './HSLPanel'
import HarmonyPanel from './HarmonyPanel'
import BlindnessSimulator from './BlindnessSimulator'
import GradientPanel from './GradientPanel'
import ImageUploader from './ImageUploader'
import PaletteCard from './PaletteCard'
import Toast from './Toast'
import { PALETTE_CARD_ANIMATION_DELAY_MS } from '../constants'

export default function TabContents(props) {
  const { tab, onToolChange, palette, locks, favorites, toast, onToggleLock, onUpdateColor, onReorderPalette, onCopy, onSaveFavorite, onExportJSON, onLoadFavorite, onRemoveFavorite, onRenameFavorite, onCloseToast, onUndoSave, onGeneratePalette, count, setCount, genMode, setGenMode, settings, onApplyPalette, onApplyAndLock, isGenerating } = props
  const [copiedFav, setCopiedFav] = useState(null)
  const [openMenuFav, setOpenMenuFav] = useState(null)
  const [renamingId, setRenamingId] = useState(null)
  const [renamingText, setRenamingText] = useState('')
  const [extractedColors, setExtractedColors] = useState([])
  const [extractedName, setExtractedName] = useState('')
  const [showLoadConfirm, setShowLoadConfirm] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest') // 'newest', 'oldest', 'name'
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [modalColors, setModalColors] = useState([])
  const [modalName, setModalName] = useState('')
  const [modalTags, setModalTags] = useState('')
  const [filterTag, setFilterTag] = useState('')

  // Filter and sort favorites
  const allTags = Array.from(new Set((favorites || []).flatMap(f => f.tags || []))).sort()

  const filteredFavorites = (favorites || [])
    .filter(f => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      const matchesName = f.name?.toLowerCase().includes(q)
      const matchesColor = f.colors.some(c => c.toLowerCase().includes(q))
      const matchesTag = f.tags?.some(t => t.toLowerCase().includes(q))
      return matchesName || matchesColor || matchesTag
    })
    .filter(f => !filterTag || (f.tags && f.tags.includes(filterTag)))
    .sort((a, b) => {
      if (sortBy === 'newest') return (b.createdAt || b.id) - (a.createdAt || a.id)
      if (sortBy === 'oldest') return (a.createdAt || a.id) - (b.createdAt || b.id)
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
      return 0
    })

  function downloadPalettePNG(colors, filename) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const size = 200
    canvas.width = colors.length * size
    canvas.height = size
    
    colors.forEach((color, i) => {
      ctx.fillStyle = color
      ctx.fillRect(i * size, 0, size, size)
    })
    
    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  function handleMoveColor(index, direction) {
    if (direction === 'up' && index > 0) {
      onReorderPalette(index, index - 1)
    } else if (direction === 'down' && index < palette.length - 1) {
      onReorderPalette(index, index + 1)
    }
  }

  function headerFor(tabKey) {
    switch (tabKey) {
      case 'hsl':
        return {
          title: 'HSL Adjuster',
          desc: 'Fine-tune your colors using Hue, Saturation, and Lightness sliders.'
        }
      case 'palette':
        return {
          title: 'Palette Generator',
          desc: 'Generate, lock, and reorder colors to create your perfect theme.'
        }
      case 'harmony':
        return {
          title: 'Harmony Finder',
          desc: 'Discover beautiful color relationships based on classic color theory.'
        }
      case 'blindness':
        return {
          title: 'Accessibility Simulator',
          desc: 'Preview how your colors appear to users with different types of color vision deficiency.'
        }
      case 'gradient':
        return {
          title: 'Gradient Maker',
          desc: 'Create smooth, modern gradients and export them as CSS or images.'
        }
      case 'favorites':
        return {
          title: 'Saved Palettes',
          desc: 'Your collection of curated palettes, ready for export and reuse.'
        }
      case 'image':
        return {
          title: 'Image Extractor',
          desc: 'Upload an image and we\'ll extract the most prominent colors for you.'
        }
      default:
        return { title: 'Tool', desc: 'Description' }
    }
  }

  const h = headerFor(tab)

  return (
    <div className="animate-fade-in">
      {/* Tab header + description (Slimmed) */}
      <div className="mb-4 py-4 px-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{h.title}</h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-0.5">{h.desc}</p>
        </div>
      </div>

      {tab === 'hsl' && (
        <section id="panel-hsl" role="tabpanel">
          <HSLPanel onRequestSave={(colors) => { setModalColors(colors); setModalName(''); setShowSaveModal(true) }} onRequestExport={(colors) => { setModalColors(colors); setShowExportModal(true) }} onCopyHex={onCopy} settings={settings} />
        </section>
      )}

      {tab === 'palette' && (
        <section id="panel-palette" role="tabpanel" className="mb-0">
          <div className="mb-4 control-panel bg-slate-800/40 p-3.5 rounded-2xl border border-slate-700/50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-0.5">Colors</span>
                <div className="flex items-center gap-3">
                   <input
                    aria-label="Number of colors"
                    type="range"
                    min={3}
                    max={10}
                    value={count}
                    onChange={e => setCount(Number(e.target.value))}
                    className="accent-amber-500 w-28 h-1.5"
                  />
                  <span className="font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded text-xs font-bold">{count}</span>
                </div>
              </div>

              <div className="h-6 w-[1px] bg-slate-700/50 mx-1 hidden md:block" />

              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-0.5">Method</span>
                <select 
                  value={genMode} 
                  onChange={(e) => setGenMode(e.target.value)}
                  className="bg-slate-900/50 border border-slate-700 text-slate-300 text-[11px] font-bold rounded-lg px-2 py-1 outline-none focus:border-amber-500 transition-colors cursor-pointer"
                >
                  <option value="random">Random</option>
                  <option value="complementary">Complementary</option>
                  <option value="analogous">Analogous</option>
                  <option value="triadic">Triadic</option>
                  <option value="split-complementary">Split-Comp</option>
                  <option value="tetradic">Tetradic</option>
                  <option value="monochromatic">Mono</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => onGeneratePalette && onGeneratePalette()} 
                className="btn bg-amber-600 hover:bg-amber-500 text-white px-5 py-1.5 rounded-xl text-xs font-bold shadow-lg shadow-amber-600/20 transition-all active:scale-95 disabled:opacity-50" 
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate New'}
              </button>
              <button onClick={() => { setModalColors(palette); setModalName(''); setShowSaveModal(true) }} className="btn bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-xl text-xs font-bold transition-all">Save</button>
              <button onClick={() => { setModalColors(palette); setShowExportModal(true) }} className="btn bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-1.5 rounded-xl text-xs font-bold transition-all">Export</button>
            </div>
          </div>

          <div className="palette-container-interactive flex flex-col md:flex-row gap-3 md:gap-2 w-full h-auto md:h-[480px] min-h-0 border-decorative-gold pattern-accent p-4 rounded-xl">
            {palette && palette.length > 0 ? (
              palette.map((c, i) => {
                const isHighCount = palette.length > 6
                
                return (
                  <div 
                    className="relative overflow-hidden w-full h-[220px] sm:h-[240px] md:w-auto md:h-auto md:flex-1 md:min-h-0 md:min-w-[40px] animate-card-pop"
                    key={`palette-card-${i}`}
                  >
                      <PaletteCard
                        color={c}
                        locked={!!(locks && locks[i])}
                        onToggleLock={() => onToggleLock(i)}
                        onColorChange={(newColor) => onUpdateColor && onUpdateColor(i, newColor)}
                        onCopy={() => onCopy(c)}
                        delay={i * 50}
                        settings={settings}
                        isCompact={isHighCount}
                        onMoveUp={i > 0 ? () => handleMoveColor(i, 'up') : null}
                        onMoveDown={i < palette.length - 1 ? () => handleMoveColor(i, 'down') : null}
                      />
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center text-slate-500 w-full bg-slate-900/40 rounded-3xl border border-dashed border-slate-700">
                <div className="mb-4 text-4xl">🎨</div>
                <p>No colors generated yet.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {tab === 'image' && (
        <section id="panel-image" role="tabpanel" className="mb-8">
          <ImageUploader onExtract={(cols) => { setExtractedColors(cols); setExtractedName(''); }} />
          {extractedColors && extractedColors.length > 0 && (
            <div className="mt-8 p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50 animate-pop">
              <h3 className="text-lg font-bold text-white mb-4">Extracted Colors</h3>
              <div className="flex gap-3 flex-wrap mb-6">
                {extractedColors.map((c, i) => (
                  <div key={i} className="w-16 h-16 rounded-xl border-2 border-slate-700/50 shadow-lg cursor-pointer hover:scale-110 transition-transform" style={{ background: c }} />
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Palette Name</label>
                  <input value={extractedName} onChange={e => setExtractedName(e.target.value)} placeholder="Summer Sunset, etc." className="bg-slate-900/50 border border-slate-700 p-3 rounded-xl text-sm w-full outline-none focus:border-amber-500 transition-colors" />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button className="btn bg-amber-600 hover:bg-amber-500 text-white px-4 py-3 rounded-xl font-semibold flex-1 sm:flex-none" onClick={() => { onApplyPalette && onApplyPalette(extractedColors); onToolChange && onToolChange('palette') }}>Apply</button>
                  <button className="btn bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-3 rounded-xl font-semibold flex-1 sm:flex-none" onClick={() => { onSaveFavorite && onSaveFavorite(extractedColors, extractedName); setExtractedColors([]); setExtractedName('') }}>Save Fav</button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {tab === 'harmony' && (
        <section id="panel-harmony" role="tabpanel">
          <HarmonyPanel 
            baseColor={palette[0] || '#d4af37'} 
            onApplyPalette={(colors) => { onApplyPalette(colors); onToolChange('palette') }}
            onSaveFavorite={onSaveFavorite}
            onCopyHex={onCopy}
          />
        </section>
      )}

      {tab === 'blindness' && (
        <section id="panel-blindness" role="tabpanel">
          <BlindnessSimulator palette={palette} />
        </section>
      )}

      {tab === 'gradient' && (
        <section id="panel-gradient" role="tabpanel">
          <GradientPanel 
            palette={palette} 
            onApplyPalette={(colors) => { onApplyPalette(colors); onToolChange('palette') }}
            onCopyHex={onCopy}
          />
        </section>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSaveModal(false)} />
          <div className="relative z-60 w-full max-w-lg p-6 bg-slate-900 rounded-md shadow-lg text-slate-100">
            <h3 className="text-lg font-semibold mb-2">Save Palette</h3>
            <p className="tab-desc mb-4">Give this palette a name and optionally add tags.</p>
            <input 
              value={modalName} 
              onChange={e => setModalName(e.target.value)} 
              placeholder="My Palette name" 
              className="input-field w-full mb-3" 
            />
            <input 
              value={modalTags} 
              onChange={e => setModalTags(e.target.value)} 
              placeholder="Tags (comma-separated, e.g. dark, modern, blue)" 
              className="input-field w-full mb-4" 
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowExportModal(false)} />
          <div className="relative z-60 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-slate-900 rounded-md shadow-lg text-slate-100">
            <h3 className="text-2xl font-bold mb-2">Export Palette</h3>
            <p className="text-sm text-slate-400 mb-6">Choose an export format for the current palette.</p>
            
            {/* Structured Data Section */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Structured Data</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button 
                  className="export-format-card" 
                  onClick={() => { onExportJSON && onExportJSON(modalColors); setShowExportModal(false) }}
                >
                  <div className="font-semibold text-white">JSON File</div>
                  <p className="text-xs text-slate-400 mt-1">Download as a JSON file</p>
                </button>
                <button 
                  className="export-format-card" 
                  onClick={() => { const cssVars = modalColors.map((c, i) => `--color-${i+1}: ${c};`).join('\n'); navigator.clipboard.writeText(cssVars); setShowExportModal(false) }}
                >
                  <div className="font-semibold text-white">CSS Variables</div>
                  <p className="text-xs text-slate-400 mt-1">Copy to clipboard</p>
                </button>
                <button 
                  className="export-format-card" 
                  onClick={() => {
                    const scss = `$palette: (\n${modalColors.map((c,i)=>`  "color-${i+1}": ${c}`).join(',\n')}\n);`
                    navigator.clipboard.writeText(scss); setShowExportModal(false)
                  }}
                >
                  <div className="font-semibold text-white">SCSS Map</div>
                  <p className="text-xs text-slate-400 mt-1">Copy to clipboard</p>
                </button>
                <button 
                  className="export-format-card" 
                  onClick={() => {
                    const tailwind = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${modalColors.map((c,i)=>`        'palette-${i+1}': '${c}',`).join('\n')}\n      }\n    }\n  }\n}`
                    navigator.clipboard.writeText(tailwind); setShowExportModal(false)
                  }}
                >
                  <div className="font-semibold text-white">Tailwind Config</div>
                  <p className="text-xs text-slate-400 mt-1">Copy to clipboard</p>
                </button>
              </div>
            </div>
            
            {/* Quick Copy Section */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Quick Copy</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button 
                  className="export-format-card" 
                  onClick={() => { navigator.clipboard.writeText(modalColors.join('\n')); setShowExportModal(false) }}
                >
                  <div className="font-semibold text-white">HEX List</div>
                  <p className="text-xs text-slate-400 mt-1">Copy to clipboard</p>
                </button>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 pt-4 border-t border-slate-700">
              <button className="btn btn-ghost" onClick={() => setShowExportModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'favorites' && (
        <section id="panel-favorites" role="tabpanel" aria-label="Favorites" className="mb-8">
          {favorites && favorites.length > 0 && (
            <div className="tab-desc mb-4">
              {filteredFavorites.length} of {favorites.length} palette{favorites.length !== 1 ? 's' : ''}
            </div>
          )}

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
                  className="input-field w-full pl-10"
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
                  className="input-field pr-10 appearance-none cursor-pointer"
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
                className={`tag-chip ${!filterTag ? 'tag-chip-active' : ''}`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
                  className={`tag-chip ${filterTag === tag ? 'tag-chip-active' : ''}`}
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
                className="mt-2 text-amber-300 hover:text-amber-200 text-sm"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Favorites grid */}
          <div className="flex gap-3 flex-wrap">
            {filteredFavorites.length > 0 ? filteredFavorites.map(f => (
              <div key={f.id} className="fav-card" onClick={() => setShowLoadConfirm(f)}>
                <div className="btn-wrap absolute -top-2.5 -right-2.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); setRenamingId(f.id); setRenamingText(f.name || ''); setOpenMenuFav(null) }}
                    title="Rename palette"
                    className="icon-btn hover:bg-amber-600/80"
                    aria-label="Rename palette"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                      <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemoveFavorite(f.id) }}
                    title="Remove favorite"
                    className="icon-btn hover:bg-red-600/80"
                    aria-label="Remove favorite"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M9 3h6l1 2h4v2H4V5h4l1-2zM6 7h12l-1 14a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7z" />
                    </svg>
                  </button>
                  <span className="tooltip">Rename / Remove</span>
                </div>
                <div className="mb-2">
                  {renamingId === f.id ? (
                    <div className="flex gap-2 items-center mb-2">
                      <input
                        type="text"
                        value={renamingText}
                        onChange={(e) => setRenamingText(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onRenameFavorite(f.id, renamingText)
                            setRenamingId(null)
                          } else if (e.key === 'Escape') {
                            setRenamingId(null)
                          }
                        }}
                        className="bg-slate-800 border border-amber-500/40 text-white text-sm px-2 py-1 rounded flex-1 outline-none focus:border-amber-500"
                        autoFocus
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); onRenameFavorite(f.id, renamingText); setRenamingId(null) }}
                        className="btn btn-primary text-xs px-2 py-1"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-label">{f.name || 'Saved Palette'}</div>
                      <div className="text-caption mt-0.5">{new Date(Number(f.createdAt || f.id)).toLocaleString()}</div>
                    </>
                  )}
                  {/* Tags */}
                  {f.tags && f.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {f.tags.map((tag, idx) => (
                        <button
                          key={idx}
                          className="tag-chip"
                          onClick={(e) => { e.stopPropagation(); setFilterTag(tag) }}
                          title={`Filter by ${tag}`}
                        >
                          {tag}
                        </button>
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
                    <div className="fav-menu absolute right-0 mt-2 w-56 z-40">
                      <button className="fav-menu-item" onClick={(e) => { e.stopPropagation(); onExportJSON && onExportJSON(f.colors); setOpenMenuFav(null) }}>Download JSON</button>
                      <button className="fav-menu-item" onClick={async (e) => { e.stopPropagation(); const css = f.colors.map((c,i)=>`--color-${i+1}: ${c};`).join('\n'); await navigator.clipboard.writeText(css); setCopiedFav({ id: f.id, type: 'CSS' }); setTimeout(()=>setCopiedFav(null),1200); setOpenMenuFav(null) }}>Copy CSS variables</button>
                      <button className="fav-menu-item" onClick={async (e) => { e.stopPropagation(); await navigator.clipboard.writeText(f.colors.join('\n')); setCopiedFav({ id: f.id, type: 'HEX' }); setTimeout(()=>setCopiedFav(null),1200); setOpenMenuFav(null) }}>Copy HEX list</button>
                      <button className="fav-menu-item" onClick={async (e) => { e.stopPropagation(); const scss = `$palette: (\n${f.colors.map((c,i)=>`  "color-${i+1}": ${c}`).join(',\n')}\n);`; await navigator.clipboard.writeText(scss); setCopiedFav({ id: f.id, type: 'SCSS' }); setTimeout(()=>setCopiedFav(null),1200); setOpenMenuFav(null) }}>Copy SCSS map</button>
                      <button className="fav-menu-item" onClick={async (e) => { e.stopPropagation(); const tailwind = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${f.colors.map((c,i)=>`        'palette-${i+1}': '${c}',`).join('\n')}\n      }\n    }\n  }\n}`; await navigator.clipboard.writeText(tailwind); setCopiedFav({ id: f.id, type: 'Tailwind' }); setTimeout(()=>setCopiedFav(null),1200); setOpenMenuFav(null) }}>Copy Tailwind config</button>
                      <button className="fav-menu-item" onClick={(e) => { e.stopPropagation(); downloadPalettePNG(f.colors, f.name || `palette-${f.id}`); setOpenMenuFav(null) }}>Download PNG</button>
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
        <section id="panel-export" role="tabpanel" aria-label="Export" className="mb-8">
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">Structured Data</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                className="export-format-card"
                onClick={() => { onExportJSON && onExportJSON(palette) }}
              >
                <div className="font-semibold text-white">JSON File</div>
                <p className="text-xs text-slate-400 mt-1">Download palette as a JSON file</p>
              </button>
              <button
                className="export-format-card"
                onClick={async () => { const cssVars = palette.map((c, i) => `--color-${i+1}: ${c};`).join('\n'); await navigator.clipboard.writeText(cssVars) }}
              >
                <div className="font-semibold text-white">CSS Variables</div>
                <p className="text-xs text-slate-400 mt-1">Copy to clipboard</p>
              </button>
              <button
                className="export-format-card"
                onClick={async () => { const scss = `$palette: (\n${palette.map((c,i)=>`  "color-${i+1}": ${c}`).join(',\n')}\n);`; await navigator.clipboard.writeText(scss) }}
              >
                <div className="font-semibold text-white">SCSS Map</div>
                <p className="text-xs text-slate-400 mt-1">Copy to clipboard</p>
              </button>
              <button
                className="export-format-card"
                onClick={async () => { const tw = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${palette.map((c,i)=>`        'palette-${i+1}': '${c}',`).join('\n')}\n      }\n    }\n  }\n}`; await navigator.clipboard.writeText(tw) }}
              >
                <div className="font-semibold text-white">Tailwind Config</div>
                <p className="text-xs text-slate-400 mt-1">Copy to clipboard</p>
              </button>
            </div>
          </div>
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">Quick Copy</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                className="export-format-card"
                onClick={async () => { await navigator.clipboard.writeText(palette.join('\n')) }}
              >
                <div className="font-semibold text-white">HEX List</div>
                <p className="text-xs text-slate-400 mt-1">Copy to clipboard</p>
              </button>
              <button
                className="export-format-card"
                onClick={() => downloadPalettePNG(palette, 'palette')}
              >
                <div className="font-semibold text-white">Download PNG</div>
                <p className="text-xs text-slate-400 mt-1">Save palette as image</p>
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
            <button
              className="btn btn-success"
              onClick={() => { setModalColors(palette); setModalName(''); setShowSaveModal(true) }}
            >
              Save to Favorites
            </button>
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
                className="btn btn-ghost" 
                onClick={() => setShowLoadConfirm(null)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
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
