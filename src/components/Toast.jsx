import React from 'react'

export default function Toast({ message, actionLabel, onAction, onClose, previewColors = [], type = 'info' }) {
  return (
    // Mobile: centered, positioned above nav | Desktop: bottom-right
    <div className="toast-container">
      <div className="glass border border-white/10 text-[var(--color-primary)]/80 toast-content animate-pop">
        {/* Top row: Icon + Message */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-0">
          {/* Icon based on type */}
          {type === 'success' && (
            <div className="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {type === 'error' && (
            <div className="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {type === 'loading' && (
            <div className="flex-shrink-0 mt-0.5">
              <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-[var(--color-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm font-medium leading-snug">{message}</div>
          </div>

          {/* Close button - positioned top-right on desktop */}
          <button onClick={onClose} aria-label="Close toast" className="hidden sm:block flex-shrink-0 p-1.5 text-[var(--color-primary)]/75 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Color preview swatches - responsive count and layout */}
        {previewColors && previewColors.length > 0 && (
          <div className="toast-preview mb-3 sm:mb-0 sm:px-0">
            {/* Mobile: 4 swatches | Desktop: 8 swatches */}
            {previewColors.slice(0, 8).map((c, i) => (
              <div key={i} className="toast-swatch" style={{ background: c }} />
            ))}
          </div>
        )}

        {/* Bottom row (mobile only) or inline (desktop) */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-2 sm:gap-3 sm:ml-auto">
          {actionLabel && (
            <button onClick={onAction} className="toast-action-button">
              {actionLabel}
            </button>
          )}
          
          {/* Close button - mobile only */}
          <button onClick={onClose} aria-label="Close toast" className="sm:hidden p-1.5 text-[var(--color-primary)]/75 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer self-end">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

