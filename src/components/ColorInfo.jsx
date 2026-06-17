import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { hexToHsl, rgbString, rgbToCmykFromHex, wcagLevel } from '../utils/colors'
import { getClosestColorName, getSimilarityDescription } from '../utils/colorNames'

export default function ColorInfo({ color, h, s, l, primary, showCMYK = true, showDetails = true, settings = {}, onMoveUp, onMoveDown }) {
  const [copied, setCopied] = useState(null)
  if (!color || typeof color !== 'string') return null
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
        padding: !showDetails ? 'var(--space-3)' : 'var(--space-4)',
        background: 'var(--color-surface-bg)',
        borderTop: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Color name section - Only show in detailed view */}
      {showDetails && colorName && (
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
      
      {/* Minimal footer for swatches - arrows (mobile) + color code + copy button */}
      {!showDetails ? (
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          {/* Reorder arrows - mobile only */}
          {(onMoveUp || onMoveDown) && (
            <div className="flex gap-1 md:hidden flex-shrink-0">
              <button
                onClick={onMoveUp || undefined}
                disabled={!onMoveUp}
                aria-label="Move up"
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-surface-elevated)',
                  color: onMoveUp ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)',
                  border: '1px solid var(--color-border-subtle)',
                  opacity: onMoveUp ? 1 : 0.3,
                  cursor: onMoveUp ? 'pointer' : 'default',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
              </button>
              <button
                onClick={onMoveDown || undefined}
                disabled={!onMoveDown}
                aria-label="Move down"
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-surface-elevated)',
                  color: onMoveDown ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)',
                  border: '1px solid var(--color-border-subtle)',
                  opacity: onMoveDown ? 1 : 0.3,
                  cursor: onMoveDown ? 'pointer' : 'default',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>
          )}
          <div
            className="font-mono"
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-primary)',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {(() => {
              const fmt = settings.defaultCopy || 'hex'
              if (fmt === 'rgb') return rgb
              if (fmt === 'hsl') return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
              return color
            })()}
          </div>
          <button 
            className="btn btn-ghost text-xs flex-shrink-0" 
            onClick={() => {
              const format = settings.defaultCopy || 'hex'
              doCopy(format)
            }}
            aria-label={`Copy ${color}`}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              whiteSpace: 'nowrap',
            }}
          >
            {copied ? '✓ Copied' : `Copy ${(settings.defaultCopy || 'hex').toUpperCase()}`}
          </button>
        </div>
      ) : (
        <>
          {/* Hex value - show in detailed view */}
          <div 
            className="font-mono break-words"
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-primary)',
            }}
          >
            {color}
          </div>

          {/* RGB value - Only show in detailed view */}
          {showDetails && (
            <div 
              className="mt-2"
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {rgb}
            </div>
          )}

          {/* HSL value - Only show in detailed view */}
          {showDetails && (
            <div 
              className="mt-2"
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-secondary)',
              }}
            >
              HSL: {Math.round(hsl.h)}° · {Math.round(hsl.s)}% · {Math.round(hsl.l)}%
            </div>
          )}

          {/* Copy buttons - Show in detailed view */}
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

          {/* CMYK info - Only show in detailed view */}
          {showDetails && showCMYK && (
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
        </>
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
  showDetails: PropTypes.bool,
  settings: PropTypes.object,
  onMoveUp: PropTypes.func,
  onMoveDown: PropTypes.func,
}

ColorInfo.defaultProps = {
  primary: true,
  showCMYK: true,
  showDetails: true,
  settings: {},
}
