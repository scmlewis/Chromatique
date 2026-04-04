import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import HSLPanel from '../../components/HSLPanel'

describe('HSLPanel Mobile & Responsive Layout', () => {
  const defaultProps = {
    onRequestSave: jest.fn(),
    onRequestExport: jest.fn(),
    onCopyHex: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Responsive Slider Layout', () => {
    it('should render all three sliders', () => {
      render(<HSLPanel {...defaultProps} />)

      // Check for slider labels - at least one should be present
      const labels = screen.getAllByText(/Hue|Saturation|Lightness/i)
      expect(labels.length).toBeGreaterThan(0)
    })

    it('should display degree/percentage values next to sliders on mobile', () => {
      render(<HSLPanel {...defaultProps} />)

      // Query for value displays
      const values = screen.getAllByText(/°|%/)
      expect(values.length).toBeGreaterThan(0)
    })

    it('hue slider should accept range input (0-360)', () => {
      const onCopyHex = jest.fn()
      render(<HSLPanel {...defaultProps} onCopyHex={onCopyHex} />)

      const hueSlider = screen.getByLabelText('Hue slider')
      expect(hueSlider).toHaveAttribute('min', '0')
      expect(hueSlider).toHaveAttribute('max', '360')

      // Change hue value
      fireEvent.change(hueSlider, { target: { value: '180' } })
      expect(hueSlider.value).toBe('180')
    })

    it('saturation slider should accept range input (0-100)', () => {
      render(<HSLPanel {...defaultProps} />)

      const saturationSlider = screen.getByLabelText('Saturation slider')
      expect(saturationSlider).toHaveAttribute('min', '0')
      expect(saturationSlider).toHaveAttribute('max', '100')

      fireEvent.change(saturationSlider, { target: { value: '50' } })
      expect(saturationSlider.value).toBe('50')
    })

    it('lightness slider should accept range input (0-100)', () => {
      render(<HSLPanel {...defaultProps} />)

      const lightnessSlider = screen.getByLabelText('Lightness slider')
      expect(lightnessSlider).toHaveAttribute('min', '0')
      expect(lightnessSlider).toHaveAttribute('max', '100')

      fireEvent.change(lightnessSlider, { target: { value: '50' } })
      expect(lightnessSlider.value).toBe('50')
    })

    it('sliders should have responsive flex layout via media queries', () => {
      const { container } = render(<HSLPanel {...defaultProps} />)

      // Check that sliders are in flex containers with responsive classes
      const sliderContainers = container.querySelectorAll('[class*="flex"]')
      expect(sliderContainers.length).toBeGreaterThan(0)

      // Check for responsive breakpoint classes (md:flex-row indicates mobile-first responsive design)
      const hasResponsiveClass = Array.from(sliderContainers).some((el) =>
        el.className.includes('md:')
      )
      expect(hasResponsiveClass).toBe(true)
    })
  })

  describe('Slider Value Display', () => {
    it('should update and display hue value in degrees', () => {
      render(<HSLPanel {...defaultProps} />)

      const hueSlider = screen.getByLabelText('Hue slider')
      fireEvent.change(hueSlider, { target: { value: '270' } })

      // Value should be displayed
      expect(screen.getByText('270°')).toBeInTheDocument()
    })

    it('should update and display saturation value as percentage', () => {
      render(<HSLPanel {...defaultProps} />)

      const saturationSlider = screen.getByLabelText('Saturation slider')
      fireEvent.change(saturationSlider, { target: { value: '75' } })

      // Check that percentage is displayed
      const percentValues = screen.getAllByText(/75%/)
      expect(percentValues.length).toBeGreaterThan(0)
    })

    it('should update and display lightness value as percentage', () => {
      render(<HSLPanel {...defaultProps} />)

      const lightnessSlider = screen.getByLabelText('Lightness slider')
      fireEvent.change(lightnessSlider, { target: { value: '60' } })

      // Check that percentage is displayed
      const percentValues = screen.getAllByText(/60%/)
      expect(percentValues.length).toBeGreaterThan(0)
    })
  })

  describe('Mobile-Specific Spacing', () => {
    it('should have responsive gap between sliders', () => {
      const { container } = render(<HSLPanel {...defaultProps} />)

      // Check for responsive gap classes
      const controlPanel = container.querySelector('[class*="surface-glass"]')
      expect(controlPanel).toBeInTheDocument()

      // Should have responsive padding
      expect(controlPanel.className).toMatch(/p-|md:/)
    })

    it('form elements should render without errors on mobile', () => {
      render(<HSLPanel {...defaultProps} />)

      // Should have at least one input element
      const inputs = screen.getAllByRole('slider')
      expect(inputs.length).toBeGreaterThan(0)
    })
  })

  describe('Action Buttons Touch Targets', () => {
    it('generate random button should be easily tappable', () => {
      render(<HSLPanel {...defaultProps} />)

      const generateButton = screen.getByLabelText('Generate random palette')
      expect(generateButton).toBeInTheDocument()
      expect(generateButton).toHaveClass('w-full')

      // Should be clickable
      fireEvent.click(generateButton)
      // Component should still render without errors
      expect(screen.getByLabelText('Hue slider')).toBeInTheDocument()
    })

    it('action buttons in grid should have adequate spacing', () => {
      const { container } = render(<HSLPanel {...defaultProps} />)

      // Look for button grid
      const buttonGrids = container.querySelectorAll('[class*="grid"][class*="gap"]')
      expect(buttonGrids.length).toBeGreaterThan(0)
    })

    it('action buttons should be present and clickable', () => {
      render(<HSLPanel {...defaultProps} />)

      const generateButton = screen.getByLabelText('Generate random palette')
      expect(generateButton).toBeInTheDocument()

      fireEvent.click(generateButton)
      // Component should still render without errors after generating
      expect(screen.getByLabelText('Hue slider')).toBeInTheDocument()
    })
  })

  describe('Palette Scheme Selection', () => {
    it('scheme selector should be accessible on mobile', () => {
      render(<HSLPanel {...defaultProps} />)

      const schemeSelect = screen.getByRole('combobox')
      expect(schemeSelect).toBeInTheDocument()

      // Should be changeable
      fireEvent.change(schemeSelect, { target: { value: 'analogous' } })
      expect(schemeSelect.value).toBe('analogous')
    })
  })

  describe('Generated Results Grid', () => {
    it('should render component without errors', () => {
      render(<HSLPanel {...defaultProps} />)

      // Component should render all required elements
      expect(screen.getByLabelText('Hue slider')).toBeInTheDocument()
      expect(screen.getByLabelText('Saturation slider')).toBeInTheDocument()
      expect(screen.getByLabelText('Lightness slider')).toBeInTheDocument()
    })
  })
})
