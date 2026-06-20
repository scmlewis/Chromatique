import React from 'react'
import PropTypes from 'prop-types'

const TOOL_GROUPS = [
  {
    label: 'Create',
    tools: [
      { id: 'palette', label: 'Palette Generator', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="9" y1="21" x2="9" y2="9"/>
        </svg>
      )},
      { id: 'hsl', label: 'HSL Adjuster', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2v20"/>
          <path d="M2 12h20"/>
        </svg>
      )},
      { id: 'harmony', label: 'Harmony Finder', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="4"/>
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
        </svg>
      )},
      { id: 'gradient', label: 'Gradient Maker', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h20"/>
          <path d="M12 2v20"/>
          <path d="m20 16-4-4 4-4"/>
          <path d="m4 8 4 4-4 4"/>
        </svg>
      )},
      { id: 'tints', label: 'Tints & Shades', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="3" y1="15" x2="21" y2="15"/>
        </svg>
      )},
      { id: 'blender', label: 'Color Blender', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="12" r="5"/>
          <circle cx="16" cy="12" r="5"/>
        </svg>
      )},
    ]
  },
  {
    label: 'Analyze',
    tools: [
      { id: 'image', label: 'Image Extractor', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      )},
      { id: 'blindness', label: 'Accessibility', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )},
      { id: 'contrast', label: 'Contrast Checker', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a10 10 0 0 1 0 20z"/>
        </svg>
      )},
    ]
  },
  {
    label: 'Saved',
    tools: [
      { id: 'favorites', label: 'Saved Palettes', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
        </svg>
      )},
    ]
  }
]

const ALL_TOOLS = TOOL_GROUPS.flatMap(g => g.tools)

export default function Sidebar({ currentTool, onToolChange, isCollapsed, onToggleCollapse, isOpenMobile, onCloseMobile }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--color-border-ghost)] transition-all duration-300 
      ${isCollapsed ? 'w-[72px]' : 'w-60'} 
      ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 lg:static`}
      style={{ background: 'var(--color-surface-raised)' }}
    >
      {/* Brand */}
      <div className={`flex items-center h-16 sm:h-20 border-b border-[var(--color-border-ghost)] ${isCollapsed ? 'justify-center px-2' : 'px-5'}`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ background: 'var(--gradient-primary)' }} />
          {(!isCollapsed || isOpenMobile) && (
            <span className="font-bold text-[15px] tracking-tight text-[var(--color-text-primary)] truncate" style={{ fontFamily: "var(--font-family-ui)" }}>
              Chromatique
            </span>
          )}
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {TOOL_GROUPS.map((group, gi) => (
          <div key={group.label} className={gi > 0 ? 'mt-6' : ''}>
            {(!isCollapsed || isOpenMobile) && (
              <div className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.tools.map((tool) => {
                const active = currentTool === tool.id
                return (
                  <button
                    key={tool.id}
                    onClick={() => onToolChange(tool.id)}
                    title={isCollapsed ? tool.label : undefined}
                    className={`relative w-full flex items-center gap-3 rounded-lg transition-all duration-150 group ${
                      isCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'
                    } ${
                      active
                        ? 'bg-[var(--color-surface-accent-strong)] text-[var(--color-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {active && !isCollapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-[var(--color-primary)]" />
                    )}
                    <span className={`flex-shrink-0 transition-colors duration-150 ${
                      active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]'
                    }`}>
                      {tool.icon}
                    </span>
                    {(!isCollapsed || isOpenMobile) && (
                      <span className={`text-[13px] truncate ${active ? 'font-medium' : ''}`}>
                        {tool.label}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="hidden lg:block p-3 border-t border-[var(--color-border-ghost)]">
        <button 
          onClick={onToggleCollapse}
          className={`w-full flex items-center gap-3 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-text-primary)] transition-all duration-150 ${
            isCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'
          }`}
          title={isCollapsed ? 'Expand sidebar' : undefined}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
            <polyline points="11 17 6 12 11 7"/>
            <polyline points="18 17 13 12 18 7"/>
          </svg>
          {!isCollapsed && <span className="text-[13px]">Collapse</span>}
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
