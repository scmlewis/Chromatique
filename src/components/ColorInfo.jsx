import React, { useState } from 'react'
import { hexToHsl, rgbString, rgbToCmykFromHex, wcagLevel } from '../utils/colors'

export default function ColorInfo({ color, h, s, l, primary, showCMYK = true }) {
  const [copied, setCopied] = useState(null)
  const hsl = (h !== undefined && s !== undefined && l !== undefined) ? { h, s, l } : hexToHsl(color)
  const rgb = rgbString(color)
  const cmyk = rgbToCmykFromHex(color)

  async function doCopy(type) {
    try {
      let text = ''
      if (type === 'hex') text = color
      else if (type === 'rgb') text = rgb
      else if (type === 'hsl') text = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 1200)
    } catch (e) {}
  }

  const contrast = primary ? (() => {
    const black = wcagLevel(color, '#000000')
    const white = wcagLevel(color, '#ffffff')
    return { black, white }
  })() : null

  return (
    <div className="p-3 bg-slate-900/80">
      <div className="font-mono text-sm text-slate-100 break-words">{color}</div>
      <div className="text-xs text-slate-300 mt-1">{rgb}</div>
      <div className="text-xs text-slate-300 mt-1">HSL: {Math.round(hsl.h)}° · {Math.round(hsl.s)}% · {Math.round(hsl.l)}%</div>

      <div className="mt-3 flex items-center gap-2">
        <button className="btn btn-ghost text-xs px-3 py-1" onClick={() => doCopy('hex')} aria-label={`Copy ${color} as HEX`}>{copied === 'hex' ? 'Copied' : 'HEX'}</button>
        <button className="btn btn-ghost text-xs px-3 py-1" onClick={() => doCopy('rgb')} aria-label={`Copy ${color} as RGB`}>{copied === 'rgb' ? 'Copied' : 'RGB'}</button>
        <button className="btn btn-ghost text-xs px-3 py-1" onClick={() => doCopy('hsl')} aria-label={`Copy ${color} as HSL`}>{copied === 'hsl' ? 'Copied' : 'HSL'}</button>
      </div>

      {showCMYK && (
        <div className="text-xs text-slate-400 mt-3">CMYK: {cmyk.c}% {cmyk.m}% {cmyk.y}% {cmyk.k}%</div>
      )}

      {primary && contrast && (
        <div className="mt-3 pt-2 border-t border-white/10">
          <div className="text-xs text-slate-300 mb-2 font-semibold">Contrast Check</div>
          <div className="flex gap-2 flex-wrap">
            {['black','white'].map((k) => {
              const b = k === 'black' ? contrast.black : contrast.white
              const cls = b.AAA ? 'bg-emerald-600 text-white' : (b.AA ? 'bg-amber-500 text-gray-900' : 'bg-red-600 text-white')
              return (
                <div key={k} className="p-2 rounded-md bg-slate-800/60 text-xs w-full sm:w-auto">
                  <div className="font-semibold">{k === 'black' ? 'Black Text' : 'White Text'}</div>
                  <div className="text-sm mt-1">{b.ratio.toFixed(2)}:1</div>
                  <div className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${cls}`}>{b.AAA ? 'AAA' : (b.AA ? 'AA' : 'Fail')}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
