import React from 'react'

export default function SettingsModal({ isOpen, onClose, settings, onSettingsChange }) {
  if (!isOpen) return null

  const handleToggleCMYK = () => {
    onSettingsChange({ ...settings, showCMYK: !settings.showCMYK })
  }

  const handleCopyFormatChange = (format) => {
    onSettingsChange({ ...settings, defaultCopy: format })
  }

  const handleToggleReducedMotion = () => {
    onSettingsChange({ ...settings, reducedMotion: !settings.reducedMotion })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in p-4" onClick={onClose}>
      <div className="rounded-2xl shadow-2xl max-w-lg w-full mx-4 animate-pop overflow-hidden border border-[var(--color-border-ghost)]" style={{ background: 'var(--color-surface-raised)' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-ghost)]">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Settings</h2>
          <button
            onClick={onClose}
            className="icon-btn"
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* CMYK Display Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Show CMYK Values</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Display CMYK color format in color info panels</p>
            </div>
            <button
              onClick={handleToggleCMYK}
              className="relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 cursor-pointer"
              style={{ background: settings.showCMYK ? 'var(--gradient-primary)' : 'var(--color-surface-highlight)' }}
              role="switch"
              aria-checked={settings.showCMYK}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                  settings.showCMYK ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Default Copy Format */}
          <div>
            <h3 className="font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Default Copy Format</h3>
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>Choose the format used when clicking color swatches</p>
            <div className="flex gap-3">
              {['hex', 'rgb', 'hsl'].map((format) => (
                <button
                  key={format}
                  onClick={() => handleCopyFormatChange(format)}
                  className={`btn ${settings.defaultCopy === format ? 'btn-primary' : 'btn-outline'}`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Reduce Motion</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Minimize animations for better accessibility</p>
            </div>
            <button
              onClick={handleToggleReducedMotion}
              className="relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 cursor-pointer"
              style={{ background: settings.reducedMotion ? 'var(--gradient-primary)' : 'var(--color-surface-highlight)' }}
              role="switch"
              aria-checked={settings.reducedMotion}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-[var(--color-border-ghost)]">
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

