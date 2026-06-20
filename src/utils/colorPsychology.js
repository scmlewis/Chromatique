import { hexToHsl } from './colors'

const PSYCHOLOGY_BY_HUE = [
  {
    range: [0, 15],
    name: 'Red',
    mood: 'Passionate, energetic, urgent',
    meaning: 'Love, strength, courage, danger, excitement',
    uses: 'CTAs, sale banners, food brands, entertainment, alerts',
  },
  {
    range: [15, 45],
    name: 'Orange',
    mood: 'Warm, friendly, confident',
    meaning: 'Creativity, enthusiasm, adventure, affordability',
    uses: 'E-commerce CTAs, youth brands, food & drink, entertainment',
  },
  {
    range: [45, 65],
    name: 'Yellow',
    mood: 'Optimistic, cheerful, attention-grabbing',
    meaning: 'Happiness, warmth, caution, innovation',
    uses: 'Highlights, warning states, playful brands, retail',
  },
  {
    range: [65, 80],
    name: 'Lime',
    mood: 'Fresh, vibrant, youthful',
    meaning: 'Growth, energy, nature, health',
    uses: 'Health & fitness, eco brands, startups, call-to-actions',
  },
  {
    range: [80, 160],
    name: 'Green',
    mood: 'Balanced, peaceful, prosperous',
    meaning: 'Nature, wealth, safety, renewal, health',
    uses: 'Finance, sustainability, healthcare, nature, success states',
  },
  {
    range: [160, 190],
    name: 'Teal',
    mood: 'Sophisticated, calm, unique',
    meaning: 'Clarity, open communication, sophistication',
    uses: 'Tech brands, healthcare, creative agencies, SaaS',
  },
  {
    range: [190, 240],
    name: 'Blue',
    mood: 'Trustworthy, professional, serene',
    meaning: 'Trust, loyalty, wisdom, stability, technology',
    uses: 'Corporate, fintech, healthcare, social media, SaaS',
  },
  {
    range: [240, 270],
    name: 'Indigo',
    mood: 'Deep, wise, spiritual',
    meaning: 'Intuition, royalty, luxury, contemplation',
    uses: 'Premium brands, education, spiritual/wellness, creative',
  },
  {
    range: [270, 310],
    name: 'Purple',
    mood: 'Luxurious, creative, magical',
    meaning: 'Royalty, wisdom, mystery, imagination',
    uses: 'Beauty, luxury, creative, children, spirituality',
  },
  {
    range: [310, 340],
    name: 'Pink',
    mood: 'Playful, romantic, gentle',
    meaning: 'Love, femininity, compassion, sweetness',
    uses: 'Beauty, fashion, food, youth, wellness, dating',
  },
  {
    range: [340, 360],
    name: 'Crimson',
    mood: 'Bold, dramatic, intense',
    meaning: 'Passion, power, determination, beauty',
    uses: 'Fashion, luxury, entertainment, bold brands',
  },
]

function getPsychologyByHue(hue) {
  for (const entry of PSYCHOLOGY_BY_HUE) {
    if (hue >= entry.range[0] && hue < entry.range[1]) {
      return entry
    }
  }
  return PSYCHOLOGY_BY_HUE[0]
}

function getSaturationNote(saturation) {
  if (saturation < 10) return 'Desaturated — conveys neutrality, formality, or timelessness.'
  if (saturation < 30) return 'Muted — feels sophisticated, understated, and elegant.'
  if (saturation < 60) return 'Moderate — balanced and approachable.'
  if (saturation < 80) return 'Vivid — energetic and confident.'
  return 'Highly saturated — bold, intense, and attention-grabbing.'
}

function getLightnessNote(lightness) {
  if (lightness < 20) return 'Very dark — authoritative, premium, and dramatic.'
  if (lightness < 40) return 'Dark — serious, professional, and grounded.'
  if (lightness < 60) return 'Mid-tone — balanced and versatile.'
  if (lightness < 80) return 'Light — airy, clean, and open.'
  return 'Very light — minimal, delicate, and spacious.'
}

export function getColorPsychology(hex) {
  const { h, s, l } = hexToHsl(hex)
  const base = getPsychologyByHue(h)

  return {
    name: base.name,
    mood: base.mood,
    meaning: base.meaning,
    uses: base.uses,
    saturationNote: getSaturationNote(s),
    lightnessNote: getLightnessNote(l),
    hue: h,
    saturation: s,
    lightness: l,
  }
}
