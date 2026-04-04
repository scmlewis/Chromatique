import React from 'react'
import PropTypes from 'prop-types'

const TOOLS = [
  { id: 'palette', label: 'Palette Generator', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  )},
  { id: 'hsl', label: 'HSL Adjuster', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2v20"/>
      <path d="M2 12h20"/>
    </svg>
  )},
  { id: 'harmony', label: 'Harmony Finder', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="4"/>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  )},
  { id: 'image', label: 'Image Extractor', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  )},
  { id: 'blindness', label: 'Accessibility', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )},
  { id: 'gradient', label: 'Gradient Maker', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h20"/>
      <path d="M12 2v20"/>
      <path d="m20 16-4-4 4-4"/>
      <path d="m4 8 4 4-4 4"/>
    </svg>
  )},
  { id: 'favorites', label: 'Saved Palettes', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>
  )},
]

export default function Sidebar({ currentTool, onToolChange, isCollapsed, onToggleCollapse, isOpenMobile, onCloseMobile }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 bg-[var(--color-surface-bg)] border-r border-[var(--color-border-primary)] transition-all duration-300 
      ${isCollapsed ? 'w-20' : 'w-64'} 
      ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 lg:static flex flex-col`}
    >
      {/* Brand / Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex-shrink-0" />
          {(!isCollapsed || isOpenMobile) && <span className="font-bold text-xl tracking-tight text-white" style={{ fontFamily: "var(--font-family-serif-display)" }}>Chromatique</span>}
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={onCloseMobile}
          className="lg:hidden p-2 text-amber-300 hover:text-white"
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
              currentTool === tool.id 
                ? 'bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)] border border-[var(--color-accent-gold)]/30 shadow-lg shadow-[var(--color-accent-gold)]/5' 
                : 'text-amber-300 border border-transparent hover:bg-amber-950/30 hover:text-amber-200'
            }`}
          >
            <span className={`${currentTool === tool.id ? 'text-[var(--color-accent-gold)]' : 'text-amber-500 group-hover:text-amber-200'}`}>
              {tool.icon}
            </span>
            {(!isCollapsed || isOpenMobile) && <span className="font-medium truncate">{tool.label}</span>}
            {currentTool === tool.id && (!isCollapsed || isOpenMobile) && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent-gold)] shadow-[0_0_8px_rgba(212,175,55,0.6)]" />}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle (Desktop) */}
      <div className="hidden lg:block p-3 border-t border-[var(--color-border-subtle)]">
        <button 
          onClick={onToggleCollapse}
          className="w-full flex items-center gap-3 px-3 py-2 text-amber-500 hover:text-amber-200 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
            <polyline points="11 17 6 12 11 7"/>
            <polyline points="18 17 13 12 18 7"/>
          </svg>
          {!isCollapsed && <span className="text-sm font-medium">Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  )
}

Sidebar.propTypes = {
  currentTool: PropTypes.string.isRequired,
  onToolChange: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  isOpenMobile: PropTypes.bool,
  onCloseMobile: PropTypes.func
}

