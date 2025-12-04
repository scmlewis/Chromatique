// Utility to extract dominant colors from an uploaded image file.
// Uses a simple k-means clustering on sampled pixels.

function rgbToHex([r, g, b]) {
  const toHex = v => v.toString(16).padStart(2, '0')
  return `#${toHex(Math.round(r))}${toHex(Math.round(g))}${toHex(Math.round(b))}`.toUpperCase()
}

export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (e) => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

export function getImageData(img) {
  const canvas = document.createElement('canvas')
  const w = img.naturalWidth || img.width
  const h = img.naturalHeight || img.height
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, w, h)
  try {
    return ctx.getImageData(0, 0, w, h)
  } catch (e) {
    throw new Error('Unable to access image pixels (possible CORS or tainted canvas)')
  }
}

export function samplePixels(imageData, step = 6) {
  const pixels = []
  const w = imageData.width
  const h = imageData.height
  const d = imageData.data
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const idx = (y * w + x) * 4
      const a = d[idx + 3]
      if (a < 125) continue // skip mostly-transparent pixels
      pixels.push([d[idx], d[idx + 1], d[idx + 2]])
    }
  }
  return pixels
}

function distanceSq(a, b) {
  const dr = a[0] - b[0]
  const dg = a[1] - b[1]
  const db = a[2] - b[2]
  return dr * dr + dg * dg + db * db
}

function meanOfPoints(points) {
  const m = [0, 0, 0]
  if (!points || points.length === 0) return m
  for (const p of points) {
    m[0] += p[0]
    m[1] += p[1]
    m[2] += p[2]
  }
  m[0] /= points.length
  m[1] /= points.length
  m[2] /= points.length
  return m
}

export function kmeans(pixels, k = 5, maxIter = 12) {
  if (!pixels || pixels.length === 0) return []
  const n = pixels.length
  k = Math.min(k, n)
  // initialize centers by sampling k unique pixels
  const centers = []
  const used = new Set()
  while (centers.length < k) {
    const idx = Math.floor(Math.random() * n)
    if (used.has(idx)) continue
    used.add(idx)
    centers.push([...pixels[idx]])
  }

  let assignments = new Array(n).fill(-1)
  for (let iter = 0; iter < maxIter; iter++) {
    let moved = false
    // assign
    for (let i = 0; i < n; i++) {
      let best = 0
      let bestDist = distanceSq(pixels[i], centers[0])
      for (let c = 1; c < centers.length; c++) {
        const d = distanceSq(pixels[i], centers[c])
        if (d < bestDist) { bestDist = d; best = c }
      }
      if (assignments[i] !== best) { moved = true; assignments[i] = best }
    }

    if (!moved) break

    // recompute centers
    const buckets = Array.from({ length: centers.length }, () => [])
    for (let i = 0; i < n; i++) buckets[assignments[i]].push(pixels[i])
    for (let c = 0; c < centers.length; c++) {
      if (buckets[c].length === 0) continue
      centers[c] = meanOfPoints(buckets[c])
    }
  }
  return centers
}

export async function extractDominantColorsFromFile(file, count = 5) {
  const img = await loadImageFromFile(file)
  // choose a sampling step based on image size to keep work reasonable
  const maxDim = Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height)
  const step = Math.max(1, Math.floor(maxDim / 250))
  const imageData = getImageData(img)
  const pixels = samplePixels(imageData, step)
  if (!pixels || pixels.length === 0) return []
  const centers = kmeans(pixels, count, 14)
  // sort by brightness/desirability (optional) — here by descending luminance
  const luminance = c => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2])
  centers.sort((a, b) => luminance(b) - luminance(a))
  return centers.map(rgbToHex)
}

export default {
  loadImageFromFile,
  getImageData,
  samplePixels,
  kmeans,
  extractDominantColorsFromFile,
}
