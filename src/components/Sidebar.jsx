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

function NavContent({ currentTool, onToolChange, expanded }) {
  return (
    <nav className="flex-1 overflow-y-auto py-4 px-2.5">
      {TOOL_GROUPS.map((group, gi) => (
        <div key={group.label} className={gi > 0 ? 'mt-5' : ''}>
          {expanded && (
            <div className="px-2.5 mb-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">
              {group.label}
            </div>
          )}
          {group.tools.map((tool) => {
            const active = currentTool === tool.id
            return (
              <button
                key={tool.id}
                onClick={() => onToolChange(tool.id)}
                title={expanded ? undefined : tool.label}
                className={`relative w-full flex items-center gap-2.5 rounded-lg transition-colors duration-150
                  ${expanded ? 'px-3 py-2' : 'justify-center px-0 py-2.5'}
                  ${active
                    ? 'bg-[var(--color-surface-accent-strong)] text-[var(--color-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-text-primary)]'
                  }
                `}
              >
                {active && !expanded && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-[var(--color-primary)]" />
                )}
                <span className={`flex-shrink-0 ${active ? 'text-[var(--color-primary)]' : ''}`}>
                  {tool.icon}
                </span>
                {expanded && (
                  <span className="text-[13px] whitespace-nowrap">{tool.label}</span>
                )}
              </button>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

export default function Sidebar({ currentTool, onToolChange, isCollapsed, onToggleCollapse, isOpenMobile, onCloseMobile }) {
  const expanded = !isCollapsed

  return (
    <>
      {/* ===== MOBILE: fixed overlay ===== */}
      {isOpenMobile && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onCloseMobile} />
          <aside
            className="fixed top-0 left-0 z-50 h-full w-60 flex flex-col border-r border-[var(--color-border-ghost)] lg:hidden"
            style={{ background: 'var(--color-surface-raised)' }}
          >
            {/* Brand */}
            <div className="h-16 flex items-center px-5 gap-3 border-b border-[var(--color-border-ghost)] shrink-0">
              <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ background: 'var(--gradient-primary)' }} />
              <span className="font-bold text-[15px] tracking-tight text-[var(--color-text-primary)] whitespace-nowrap" style={{ fontFamily: "var(--font-family-ui)" }}>
                Chromatique
              </span>
            </div>
            <NavContent currentTool={currentTool} onToolChange={onToolChange} expanded={true} />
          </aside>
        </>
      )}

      {/* ===== DESKTOP: static flex child ===== */}
      <aside
        className={`
          hidden lg:flex h-full flex-col border-r border-[var(--color-border-ghost)] transition-all duration-300 shrink-0
          ${expanded ? 'w-60' : 'w-[68px]'}
        `}
        style={{ background: 'var(--color-surface-raised)' }}
      >
        {/* Brand */}
        <div className={`h-20 flex items-center border-b border-[var(--color-border-ghost)] shrink-0 ${expanded ? 'px-5 gap-3' : 'px-0 justify-center'}`}>
          <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ background: 'var(--gradient-primary)' }} />
          {expanded && (
            <span className="font-bold text-[15px] tracking-tight text-[var(--color-text-primary)] whitespace-nowrap" style={{ fontFamily: "var(--font-family-ui)" }}>
              Chromatique
            </span>
          )}
        </div>

        <NavContent currentTool={currentTool} onToolChange={onToolChange} expanded={expanded} />

        {/* Collapse toggle */}
        <div className="p-2.5 border-t border-[var(--color-border-ghost)] shrink-0">
          <button
            onClick={onToggleCollapse}
            title={expanded ? undefined : 'Expand sidebar'}
            className={`w-full flex items-center gap-2.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-text-primary)] transition-colors duration-150
              ${expanded ? 'px-3 py-2' : 'justify-center px-0 py-2.5'}
            `}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 transition-transform duration-300 ${expanded ? '' : 'rotate-180'}`}>
              <polyline points="11 17 6 12 11 7"/>
              <polyline points="18 17 13 12 18 7"/>
            </svg>
            {expanded && <span className="text-[13px] whitespace-nowrap">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
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
