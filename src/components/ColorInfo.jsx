import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { hexToHsl, rgbString, rgbToCmykFromHex, wcagLevel } from '../utils/colors'
import { getClosestColorName, getSimilarityDescription } from '../utils/colorNames'

export default function ColorInfo({ color, h, s, l, primary, showCMYK = true }) {
  const [copied, setCopied] = useState(null)
  const hsl = (h !== undefined && s !== undefined && l !== undefined) ? { h, s, l } : hexToHsl(color)
  const rgb = rgbString(color)
  const cmyk = rgbToCmykFromHex(color)
  const colorName = getClosestColorName(color)

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
    <div 
      style={{
        padding: 'var(--space-4)',
        background: 'var(--color-surface-bg)',
        borderTop: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Color name section */}
      {colorName && (
        <div 
          style={{
            marginBottom: 'var(--space-3)',
            paddingBottom: 'var(--space-2)',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <div 
                className="capitalize font-semibold"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {colorName.name}
              </div>
              {!colorName.isExactMatch && (
                <div 
                  className="mt-1"
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {getSimilarityDescription(colorName.distance)} to {colorName.name}
                </div>
              )}
            </div>
            {!colorName.isExactMatch && (
              <div 
                className="flex-shrink-0" 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-subtle)',
                  background: colorName.hex,
                }}
                title={`Exact ${colorName.name}: ${colorName.hex}`}
              />
            )}
          </div>
        </div>
      )}
      
      {/* Hex value */}
      <div 
        className="font-mono break-words"
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-primary)',
        }}
      >
        {color}
      </div>

      {/* RGB value */}
      <div 
        className="mt-2"
        style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-secondary)',
        }}
      >
        {rgb}
      </div>

      {/* HSL value */}
      <div 
        className="mt-2"
        style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-secondary)',
        }}
      >
        HSL: {Math.round(hsl.h)}° · {Math.round(hsl.s)}% · {Math.round(hsl.l)}%
      </div>

      {/* Copy buttons */}
      <div 
        className="flex items-center gap-2 flex-wrap mt-4"
        style={{ gap: 'var(--space-2)' }}
      >
        <button 
          className="btn btn-ghost text-xs flex-1 min-w-fit" 
          onClick={() => doCopy('hex')} 
          aria-label={`Copy ${color} as HEX`}
          style={{
            padding: 'var(--space-2) var(--space-3)',
          }}
        >
          {copied === 'hex' ? '✓ HEX' : 'HEX'}
        </button>
        <button 
          className="btn btn-ghost text-xs flex-1 min-w-fit" 
          onClick={() => doCopy('rgb')} 
          aria-label={`Copy ${color} as RGB`}
          style={{
            padding: 'var(--space-2) var(--space-3)',
          }}
        >
          {copied === 'rgb' ? '✓ RGB' : 'RGB'}
        </button>
        <button 
          className="btn btn-ghost text-xs flex-1 min-w-fit" 
          onClick={() => doCopy('hsl')} 
          aria-label={`Copy ${color} as HSL`}
          style={{
            padding: 'var(--space-2) var(--space-3)',
          }}
        >
          {copied === 'hsl' ? '✓ HSL' : 'HSL'}
        </button>
      </div>

      {/* CMYK info */}
      {showCMYK && (
        <div 
          className="mt-3"
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          CMYK: {cmyk.c}% {cmyk.m}% {cmyk.y}% {cmyk.k}%
        </div>
      )}

      {/* Contrast check section */}
      {primary && contrast && (
        <div 
          style={{
            marginTop: 'var(--space-3)',
            paddingTop: 'var(--space-3)',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          <div 
            className="font-semibold mb-3"
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Contrast Check (WCAG)
          </div>
          <div 
            className="flex gap-3 flex-wrap"
            style={{ gap: 'var(--space-3)' }}
          >
            {['black', 'white'].map((k) => {
              const b = k === 'black' ? contrast.black : contrast.white
              const badgeColor = b.AAA ? 'var(--color-success)' : (b.AA ? 'var(--color-warning)' : 'var(--color-error)')
              const badgeTextColor = b.AAA ? '#ffffff' : (b.AA ? '#1f2937' : '#ffffff')
              return (
                <div 
                  key={k} 
                  style={{
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface-elevated)',
                    flex: '1 1 auto',
                    minWidth: '120px',
                  }}
                >
                  <div 
                    className="font-semibold"
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {k === 'black' ? 'Black Text' : 'White Text'}
                  </div>
                  <div 
                    className="mt-2 text-sm"
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {b.ratio.toFixed(2)}:1
                  </div>
                  <div 
                    className="inline-block mt-2 text-xs font-semibold"
                    style={{
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: 'var(--radius-full)',
                      background: badgeColor,
                      color: badgeTextColor,
                    }}
                  >
                    {b.AAA ? 'AAA' : (b.AA ? 'AA' : 'Fail')}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

ColorInfo.propTypes = {
  color: PropTypes.string.isRequired,
  h: PropTypes.number,
  s: PropTypes.number,
  l: PropTypes.number,
  primary: PropTypes.bool,
  showCMYK: PropTypes.bool,
}

ColorInfo.defaultProps = {
  primary: true,
  showCMYK: true,
}
