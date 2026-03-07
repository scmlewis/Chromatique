// App constants
export const TOAST_DURATION = 4500
export const DEFAULT_PALETTE_COUNT = 5
export const MAX_PALETTE_COUNT = 10
export const MIN_PALETTE_COUNT = 3

// Animation constants
export const ANIMATION_DURATION = 400
export const PALETTE_CARD_ANIMATION_DELAY_MS = 60
export const RIPPLE_SCALE_FACTOR = 1.2
export const RIPPLE_DURATION = 450
export const SHIMMER_ANIMATION_DURATION = 3200

// UI Dimensions
export const COLOR_SWATCH_HEIGHT = 140
export const MODAL_MAX_WIDTH = 'max-w-lg'
export const HELP_MODAL_MAX_WIDTH = 'max-w-3xl'

// Color extraction constants
export const IMAGE_SAMPLING_STEP = 6
export const MAX_IMAGE_DIMENSION = 250
export const KMEANS_MAX_ITERATIONS = 12
export const KMEANS_COLOR_EXTRACTION_ITERATIONS = 14

// Canvas export constants
export const PNG_SWATCH_WIDTH = 180
export const PNG_PADDING = 20
export const PNG_HEIGHT_OFFSET = 80

// Color format constants
export const COLOR_FORMATS = {
  HEX: 'hex',
  RGB: 'rgb', 
  HSL: 'hsl'
}

// Storage keys
export const STORAGE_KEYS = {
  PALETTE: 'palette:current',
  LOCKS: 'palette:locks',
  FAVORITES: 'palette:favs',
  SETTINGS: 'palette:settings',
  HELP_ON_START: 'palette:showHelp'
}
