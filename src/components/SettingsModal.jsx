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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in p-4" onClick={onClose}>
      <div className="glass rounded-2xl shadow-2xl max-w-lg w-full mx-4 animate-pop overflow-hidden border border-white/10" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer"
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
              <h3 className="text-slate-100 font-medium">Show CMYK Values</h3>
              <p className="text-slate-400 text-sm mt-1">Display CMYK color format in color info panels</p>
            </div>
            <button
              onClick={handleToggleCMYK}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 cursor-pointer shadow-inner ${
                settings.showCMYK ? 'bg-gradient-to-r from-amber-600 to-orange-600' : 'bg-slate-600'
              }`}
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
            <h3 className="text-slate-100 font-medium mb-3">Default Copy Format</h3>
            <p className="text-slate-400 text-sm mb-3">Choose the format used when clicking color swatches</p>
            <div className="flex gap-3">
              {['hex', 'rgb', 'hsl'].map((format) => (
                <button
                  key={format}
                  onClick={() => handleCopyFormatChange(format)}
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                    settings.defaultCopy === format
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg transform scale-105'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:scale-105'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-slate-100 font-medium">Reduce Motion</h3>
              <p className="text-slate-400 text-sm mt-1">Minimize animations for better accessibility</p>
            </div>
            <button
              onClick={handleToggleReducedMotion}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 cursor-pointer shadow-inner ${
                settings.reducedMotion ? 'bg-gradient-to-r from-amber-600 to-orange-600' : 'bg-slate-600'
              }`}
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
        <div className="flex justify-end p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
