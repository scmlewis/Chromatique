export function randomHex() {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')
  return `#${hex.toUpperCase()}`
}

export function hslToHex(h, s, l) {
  // h: 0-360, s: 0-100, l: 0-100
  s /= 100
  l /= 100
  const C = (1 - Math.abs(2 * l - 1)) * s
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - C / 2
  let r = 0, g = 0, b = 0
  if (0 <= h && h < 60) { r = C; g = X; b = 0 }
  else if (60 <= h && h < 120) { r = X; g = C; b = 0 }
  else if (120 <= h && h < 180) { r = 0; g = C; b = X }
  else if (180 <= h && h < 240) { r = 0; g = X; b = C }
  else if (240 <= h && h < 300) { r = X; g = 0; b = C }
  else { r = C; g = 0; b = X }
  const R = Math.round((r + m) * 255)
  const G = Math.round((g + m) * 255)
  const B = Math.round((b + m) * 255)
  return `#${[R, G, B].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase()}`
}

export function hexToRgb(hex) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0,2),16)
  const g = parseInt(c.substring(2,4),16)
  const b = parseInt(c.substring(4,6),16)
  return { r, g, b }
}

export function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex)
  const r1 = r / 255
  const g1 = g / 255
  const b1 = b / 255
  const max = Math.max(r1, g1, b1)
  const min = Math.min(r1, g1, b1)
  let h = 0, s = 0, l = (max + min) / 2
  if (max === min) {
    h = 0
    s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break
      case g1: h = (b1 - r1) / d + 2; break
      case b1: h = (r1 - g1) / d + 4; break
    }
    h = h * 60
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function rgbString(hex) {
  const { r, g, b } = hexToRgb(hex)
  return `rgb(${r}, ${g}, ${b})`
}

export function rgbToCmykFromHex(hex) {
  const { r, g, b } = hexToRgb(hex)
  const r1 = r / 255
  const g1 = g / 255
  const b1 = b / 255
  const k = 1 - Math.max(r1, g1, b1)
  let c = 0, m = 0, y = 0
  if (k < 1) {
    c = (1 - r1 - k) / (1 - k)
    m = (1 - g1 - k) / (1 - k)
    y = (1 - b1 - k) / (1 - k)
  }
  return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) }
}

export function readableTextColor(hex) {
  // convert hex to luminance -> return black or white
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0,2),16)
  const g = parseInt(c.substring(2,4),16)
  const b = parseInt(c.substring(4,6),16)
  const luminance = (0.2126*r + 0.7152*g + 0.0722*b)/255
  return luminance > 0.55 ? '#0f172a' : '#ffffff'
}

export function srgbToLinear(c) {
  c = c / 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

export function relativeLuminance(hex) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0,2),16)
  const g = parseInt(c.substring(2,4),16)
  const b = parseInt(c.substring(4,6),16)
  const R = srgbToLinear(r)
  const G = srgbToLinear(g)
  const B = srgbToLinear(b)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export function contrastRatio(hex1, hex2) {
  const L1 = relativeLuminance(hex1)
  const L2 = relativeLuminance(hex2)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2))
}

export function wcagLevel(hex1, hex2) {
  const ratio = contrastRatio(hex1, hex2)
  return {
    ratio,
    AA: ratio >= 4.5,
    AA_Large: ratio >= 3,
    AAA: ratio >= 7,
  }
}

export function generateTintsShades(hex, steps = 5) {
  // return array of tints (lighter) and shades (darker)
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0,2),16)
  const g = parseInt(c.substring(2,4),16)
  const b = parseInt(c.substring(4,6),16)
  const tints = []
  const shades = []
  for (let i=1;i<=steps;i++){
    const f = i/(steps+1)
    // tint towards white
    const tr = Math.round(r + (255 - r)*f)
    const tg = Math.round(g + (255 - g)*f)
    const tb = Math.round(b + (255 - b)*f)
    tints.push(`#${[tr,tg,tb].map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase()}`)
    // shade towards black
    const sr = Math.round(r*(1-f))
    const sg = Math.round(g*(1-f))
    const sb = Math.round(b*(1-f))
    shades.push(`#${[sr,sg,sb].map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase()}`)
  }
  return { tints, shades }
}
