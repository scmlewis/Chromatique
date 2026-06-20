import React from 'react'

export default function AboutPanel() {
  return (
    <section id="panel-about" role="tabpanel" className="max-w-2xl mx-auto">
      <div className="space-y-5">
        {/* Hero: App + Author */}
        <div className="p-6 rounded-2xl" style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-ghost)' }}>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ background: 'var(--gradient-primary)' }} />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] leading-tight">Chromatique</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Color Palette Generator & Toolkit</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] mb-5">
            A comprehensive color tool for designers and developers. Generate palettes, explore harmonies,
            check accessibility, create gradients, extract colors from images, and export in multiple formats.
          </p>
          <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border-ghost)]">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[var(--color-text-primary)] flex-shrink-0" style={{ background: 'var(--color-surface-accent-strong)' }}>
              L
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">Lewis</span>
              <span className="text-xs text-[var(--color-text-secondary)] ml-1.5 hidden sm:inline">Developer & Designer</span>
            </div>
          </div>
        </div>

        {/* GitHub Links — equal weight, side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://github.com/scmlewis"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl transition-colors duration-150 hover:bg-[var(--color-surface-container)] group"
            style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-ghost)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--color-text-primary)]">GitHub Profile</div>
              <div className="text-xs text-[var(--color-text-secondary)] truncate">@scmlewis</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-[var(--color-text-accent-faint)] group-hover:text-[var(--color-text-secondary)]">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
          <a
            href="https://github.com/scmlewis/Chromatique"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl transition-colors duration-150 hover:bg-[var(--color-surface-container)] group"
            style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-ghost)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--color-text-primary)]">Source Code</div>
              <div className="text-xs text-[var(--color-text-secondary)] truncate">Chromatique repo</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-[var(--color-text-accent-faint)] group-hover:text-[var(--color-text-secondary)]">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>

        {/* Tech Stack */}
        <div className="flex items-center gap-2 flex-wrap px-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-accent-muted)] mr-1">Built with</span>
          {['React', 'Vite', 'Tailwind CSS', 'react-colorful'].map((tech) => (
            <span key={tech} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[var(--color-surface-container)] text-[var(--color-text-secondary)]">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
