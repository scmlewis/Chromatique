import React from 'react'

export default function TabNav({ tabs, current, onChange }) {
  return (
    <nav className="tab-nav flex gap-2 bg-slate-800/40 p-2 rounded-md">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2 rounded-md text-sm font-medium ${current === t.key ? 'tab-active' : 'tab-inactive'}`}
          aria-current={current === t.key ? 'true' : 'false'}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
