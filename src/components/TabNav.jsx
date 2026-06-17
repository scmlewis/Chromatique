import React from 'react'
import PropTypes from 'prop-types'

// Icon components for each tab
const TabIcons = {
  hsl: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="5" r="2" fill="currentColor" />
      <circle cx="19" cy="19" r="2" fill="currentColor" />
      <circle cx="5" cy="19" r="2" fill="currentColor" />
    </svg>
  ),
  palette: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <circle cx="6" cy="6" r="2.5" fill="currentColor" />
      <circle cx="18" cy="6" r="2.5" fill="currentColor" />
      <circle cx="12" cy="14" r="2.5" fill="currentColor" />
      <circle cx="6" cy="18" r="2.5" fill="currentColor" />
      <circle cx="18" cy="18" r="2.5" fill="currentColor" />
    </svg>
  ),
  favorites: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  export: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18h14v2H5z" />
    </svg>
  ),
  image: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <path d="M21 15l-5-5-6 6-4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

/**
 * TabNav Component
 * 
 * Responsive tab navigation system:
 * - Mobile (< 640px): Floating bar at bottom with larger icons, improved spacing
 * - Desktop (≥ 640px): Horizontal tabs with icons and labels, evenly distributed
 * 
 * Features:
 * - Touch targets: 56px (mobile), 40px+ (desktop)
 * - Floating mobile navigation with glassmorphic design
 * - Responsive layout with smooth transitions
 * - Keyboard accessible with aria-current
 * - Smooth transitions and active state indicators
 */
export default function TabNav({ tabs, current, onChange }) {
  if (!tabs || !Array.isArray(tabs)) return null
  return (
    <>
      {/* ========== MOBILE NAV (< 640px) ========== */}
      <nav 
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50" 
        role="tablist"
        aria-label="Mobile navigation"
      >
        <div style={{
          // Floating at bottom with proper spacing from edge
          width: '100%',
          padding: 'var(--space-3)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          background: 'var(--color-surface-nav)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--color-border-primary)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.4)',
          
          // Layout - centered with wrapping support
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
        }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              role="tab"
              aria-selected={current === t.key}
              aria-controls={`panel-${t.key}`}
              className={current === t.key ? 'tab-active' : 'tab-inactive'}
              style={{
                // Larger touch targets for mobile: 56px
                width: '56px',
                height: '56px',
                minWidth: '56px',
                minHeight: '56px',
                flex: 'none',
                
                // Layout
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                
                // Icon sizing
                fontSize: '24px',
                
                // Styling
                borderRadius: 'var(--radius-lg)',
                transition: 'all var(--duration-normal) ease',
              }}
              title={t.label}
              aria-label={t.label}
            >
              {TabIcons[t.key] || null}
            </button>
          ))}
        </div>
      </nav>

      {/* ========== DESKTOP NAV (≥ 640px) ========== */}
      <nav 
        className="hidden sm:flex tab-nav" 
        role="tablist"
        aria-label="Desktop navigation"
      >
        <div style={{
          // Desktop: Non-fixed, horizontal layout
          display: 'flex',
          width: '100%',
          gap: 'var(--space-1)',
          backgroundColor: 'var(--color-surface-nav)',
          padding: 'var(--space-1)',
          borderRadius: 'var(--radius-md)',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          flexWrap: 'nowrap',
        }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={current === t.key}
              aria-controls={`panel-${t.key}`}
              aria-label={t.label}
              className={current === t.key ? 'tab-active' : 'tab-inactive'}
              style={{
                // Desktop touch targets: 44px with label
                minHeight: '40px',
                
                // Flex: distribute evenly across available space
                flex: '1 1 0',
                
                // Layout
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                
                // Typography
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                
                // Transitions
                transition: 'all var(--duration-normal) ease',
                border: 'none',
                cursor: 'pointer',
              }}
              title={t.label}
            >
              {/* Icon */}
              <span style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
                {TabIcons[t.key] || null}
              </span>
              {/* Label - always visible on desktop */}
              <span style={{ whiteSpace: 'nowrap' }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}

TabNav.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  current: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
