import { hexToRgb } from './colors'

/**
 * Blend two hex colors together.
 * @param {string} hex1 - First color (hex)
 * @param {string} hex2 - Second color (hex)
 * @param {number} ratio - 0 = all hex1, 1 = all hex2
 * @returns {string} Blended hex color
 */
export function blendColors(hex1, hex2, ratio = 0.5) {
  const c1 = hexToRgb(hex1)
  const c2 = hexToRgb(hex2)
  const r = Math.round(c1.r + (c2.r - c1.r) * ratio)
  const g = Math.round(c1.g + (c2.g - c1.g) * ratio)
  const b = Math.round(c1.b + (c2.b - c1.b) * ratio)
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase()}`
}

/**
 * Generate a blend ramp between two colors.
 * @param {string} hex1 - Start color
 * @param {string} hex2 - End color
 * @param {number} steps - Number of intermediate steps (including endpoints)
 * @returns {string[]} Array of hex colors
 */
export function blendRamp(hex1, hex2, steps = 5) {
  const result = []
  for (let i = 0; i < steps; i++) {
    const ratio = steps === 1 ? 0.5 : i / (steps - 1)
    result.push(blendColors(hex1, hex2, ratio))
  }
  return result
}
