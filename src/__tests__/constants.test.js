import {
  TOAST_DURATION,
  DEFAULT_PALETTE_COUNT,
  MAX_PALETTE_COUNT,
  MIN_PALETTE_COUNT,
  ANIMATION_DURATION,
  PALETTE_CARD_ANIMATION_DELAY_MS,
  RIPPLE_SCALE_FACTOR,
  RIPPLE_DURATION,
  COLOR_SWATCH_HEIGHT,
  IMAGE_SAMPLING_STEP,
  MAX_IMAGE_DIMENSION,
  KMEANS_MAX_ITERATIONS,
  KMEANS_COLOR_EXTRACTION_ITERATIONS,
  PNG_SWATCH_WIDTH,
  PNG_PADDING,
  PNG_HEIGHT_OFFSET,
  COLOR_FORMATS,
  STORAGE_KEYS,
} from '../constants'

describe('Constants', () => {
  describe('App Constants', () => {
    it('should have valid TOAST_DURATION', () => {
      expect(TOAST_DURATION).toBe(4500)
      expect(typeof TOAST_DURATION).toBe('number')
      expect(TOAST_DURATION).toBeGreaterThan(0)
    })

    it('should have valid palette count constants', () => {
      expect(MIN_PALETTE_COUNT).toBe(3)
      expect(DEFAULT_PALETTE_COUNT).toBe(5)
      expect(MAX_PALETTE_COUNT).toBe(10)
      expect(MIN_PALETTE_COUNT <= DEFAULT_PALETTE_COUNT).toBe(true)
      expect(DEFAULT_PALETTE_COUNT <= MAX_PALETTE_COUNT).toBe(true)
    })
  })

  describe('Animation Constants', () => {
    it('should have valid animation durations', () => {
      expect(ANIMATION_DURATION).toBe(400)
      expect(RIPPLE_DURATION).toBe(450)
      expect(PALETTE_CARD_ANIMATION_DELAY_MS).toBe(60)
      expect(typeof ANIMATION_DURATION).toBe('number')
      expect(typeof PALETTE_CARD_ANIMATION_DELAY_MS).toBe('number')
    })

    it('should have valid ripple scale factor', () => {
      expect(RIPPLE_SCALE_FACTOR).toBe(1.2)
      expect(RIPPLE_SCALE_FACTOR).toBeGreaterThan(1)
    })
  })

  describe('UI Dimensions', () => {
    it('should have valid color swatch height', () => {
      expect(COLOR_SWATCH_HEIGHT).toBe(140)
      expect(typeof COLOR_SWATCH_HEIGHT).toBe('number')
      expect(COLOR_SWATCH_HEIGHT).toBeGreaterThan(0)
    })
  })

  describe('Color Extraction Constants', () => {
    it('should have valid extraction constants', () => {
      expect(IMAGE_SAMPLING_STEP).toBe(6)
      expect(MAX_IMAGE_DIMENSION).toBe(250)
      expect(KMEANS_MAX_ITERATIONS).toBe(12)
      expect(KMEANS_COLOR_EXTRACTION_ITERATIONS).toBe(14)
      expect(typeof IMAGE_SAMPLING_STEP).toBe('number')
    })

    it('should ensure sampling step is positive', () => {
      expect(IMAGE_SAMPLING_STEP).toBeGreaterThan(0)
      expect(MAX_IMAGE_DIMENSION).toBeGreaterThan(0)
    })
  })

  describe('Canvas Export Constants', () => {
    it('should have valid PNG export dimensions', () => {
      expect(PNG_SWATCH_WIDTH).toBe(180)
      expect(PNG_PADDING).toBe(20)
      expect(PNG_HEIGHT_OFFSET).toBe(80)
      expect(PNG_SWATCH_WIDTH).toBeGreaterThan(0)
      expect(PNG_PADDING).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Color Formats', () => {
    it('should have all required color format keys', () => {
      expect(COLOR_FORMATS).toHaveProperty('HEX')
      expect(COLOR_FORMATS).toHaveProperty('RGB')
      expect(COLOR_FORMATS).toHaveProperty('HSL')
    })

    it('should have valid color format values', () => {
      expect(COLOR_FORMATS.HEX).toBe('hex')
      expect(COLOR_FORMATS.RGB).toBe('rgb')
      expect(COLOR_FORMATS.HSL).toBe('hsl')
    })
  })

  describe('Storage Keys', () => {
    it('should have all required storage keys', () => {
      expect(STORAGE_KEYS).toHaveProperty('PALETTE')
      expect(STORAGE_KEYS).toHaveProperty('LOCKS')
      expect(STORAGE_KEYS).toHaveProperty('FAVORITES')
      expect(STORAGE_KEYS).toHaveProperty('SETTINGS')
      expect(STORAGE_KEYS).toHaveProperty('HELP_ON_START')
    })

    it('should have valid storage key values', () => {
      expect(typeof STORAGE_KEYS.PALETTE).toBe('string')
      expect(STORAGE_KEYS.PALETTE).toBe('palette:current')
      expect(STORAGE_KEYS.LOCKS).toBe('palette:locks')
      expect(STORAGE_KEYS.FAVORITES).toBe('palette:favs')
      expect(STORAGE_KEYS.SETTINGS).toBe('palette:settings')
      expect(STORAGE_KEYS.HELP_ON_START).toBe('palette:showHelp')
    })

    it('should have unique storage key values', () => {
      const values = Object.values(STORAGE_KEYS)
      const uniqueValues = new Set(values)
      expect(uniqueValues.size).toBe(values.length)
    })
  })

  describe('Consistency Checks', () => {
    it('should ensure palette count constraints are logically consistent', () => {
      expect(MIN_PALETTE_COUNT).toBeLessThan(DEFAULT_PALETTE_COUNT)
      expect(DEFAULT_PALETTE_COUNT).toBeLessThan(MAX_PALETTE_COUNT)
      expect(MIN_PALETTE_COUNT).toBeGreaterThan(0)
    })

    it('should ensure animation delays are positive', () => {
      expect(ANIMATION_DURATION).toBeGreaterThan(0)
      expect(PALETTE_CARD_ANIMATION_DELAY_MS).toBeGreaterThan(0)
      expect(RIPPLE_DURATION).toBeGreaterThan(0)
    })
  })
})
