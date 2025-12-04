import React from 'react'

export default function Toast({ message, actionLabel, onAction, onClose, previewColors = [] }) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-slate-800/95 text-slate-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-4 animate-pop max-w-md">
        {previewColors && previewColors.length > 0 && (
          <div className="toast-preview flex items-center gap-2">
            {previewColors.slice(0,8).map((c, i) => (
              <div key={i} className="toast-swatch" style={{ background: c }} />
            ))}
          </div>
        )}
        <div className="flex-1">
          <div className="text-sm">{message}</div>
        </div>
        {actionLabel && (
          <button onClick={onAction} className="ml-2 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-md text-sm">
            {actionLabel}
          </button>
        )}
        <button onClick={onClose} aria-label="Close toast" className="ml-2 text-slate-300 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  )
}
