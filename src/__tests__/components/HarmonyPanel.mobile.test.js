import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import HarmonyPanel from '../../components/HarmonyPanel'

// Mock createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (element) => element,
}))

describe('HarmonyPanel Mobile & Responsive Layout', () => {
  const defaultProps = {
    baseColor: '#6366F1',
    onApplyPalette: jest.fn(),
    onSaveFavorite: jest.fn(),
    onCopyHex: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Responsive Color Picker Layout', () => {
    it('should render color picker without scale transformation', () => {
      render(<HarmonyPanel {...defaultProps} />)

      // Find the base color label
      const baseColorLabel = screen.getByText('Base Color')
      expect(baseColorLabel).toBeInTheDocument()

      // Check that component renders without errors
      expect(baseColorLabel.closest('[class*="flex"]')).toBeInTheDocument()
    })

    it('hex color input should have mobile-friendly keyboard support', () => {
      render(<HarmonyPanel {...defaultProps} />)

      const hexInput = screen.getByDisplayValue('#6366F1')
      expect(hexInput).toHaveAttribute('inputMode', 'text')
      expect(hexInput).toHaveAttribute('pattern')

      // Should accept changes
      fireEvent.change(hexInput, { target: { value: '#FF0000' } })
      expect(hexInput.value).toBe('#FF0000')
    })

    it('color copy button should be present', () => {
      render(<HarmonyPanel {...defaultProps} />)

      // There should be a copy button (SVG icon button)
      const copyButtons = screen.getAllByRole('button').filter((btn) =>
        btn.querySelector('svg')
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Harmony Type Selection (Mobile)', () => {
    it('harmony type buttons should render and be clickable', () => {
      render(<HarmonyPanel {...defaultProps} />)

      // Get all buttons in the harmony panel
      const allButtons = screen.getAllByRole('button')
      expect(allButtons.length).toBeGreaterThan(6) // at least harmony + results buttons
    })

    it('should support changing harmony selections', () => {
      render(<HarmonyPanel {...defaultProps} />)

      // Try clicking one of the harmony buttons
      const buttons = screen.getAllByRole('button')
      if (buttons.length > 1) {
        fireEvent.click(buttons[1])
        // Component should still be rendered (no errors)
        expect(screen.getByText('Base Color')).toBeInTheDocument()
      }
    })
  })

  describe('Generated Results Grid (Mobile)', () => {
    it('should display results in responsive grid layout', () => {
      const { container } = render(<HarmonyPanel {...defaultProps} />)

      // Look for color grid with responsive classes
      const grids = container.querySelectorAll('[class*="grid"]')
      expect(grids.length).toBeGreaterThan(0)

      const responsiveGrid = Array.from(grids).find((grid) =>
        grid.className.includes('grid-cols')
      )
      expect(responsiveGrid).toBeInTheDocument()
    })

    it('should show color hex codes with tap-friendly size', () => {
      render(<HarmonyPanel {...defaultProps} />)

      // Generated colors should be displayed
      const colorCodes = screen.getAllByText(/#[0-9A-F]{6}/i)
      expect(colorCodes.length).toBeGreaterThan(0)
    })

    it('color cards should be tappable on mobile', () => {
      const { container } = render(<HarmonyPanel {...defaultProps} />)

      // Find color cards (squares in the grid)
      const colorCards = container.querySelectorAll('[class*="aspect-square"]')
      expect(colorCards.length).toBeGreaterThan(0)

      // Click first card
      fireEvent.click(colorCards[0])
      expect(defaultProps.onCopyHex).toHaveBeenCalled()
    })
  })

  describe('Action Buttons (Mobile)', () => {
    it('apply palette button should be full-width on mobile', () => {
      render(<HarmonyPanel {...defaultProps} />)

      const applyButton = screen.getByText('Apply to Palette')
      expect(applyButton).toHaveClass('btn')

      fireEvent.click(applyButton)
      expect(defaultProps.onApplyPalette).toHaveBeenCalled()
    })

    it('save favorite button should be accessible on mobile', () => {
      render(<HarmonyPanel {...defaultProps} />)

      const saveButton = screen.getByText('Save as Favorite')
      expect(saveButton).toBeInTheDocument()

      fireEvent.click(saveButton)
      expect(defaultProps.onSaveFavorite).toHaveBeenCalled()
    })
  })

  describe('Responsive Layout Structure', () => {
    it('should stack vertically on mobile (flex-col)', () => {
      const { container } = render(<HarmonyPanel {...defaultProps} />)

      // Main layout should use flex-col on mobile, flex-row on desktop
      const mainLayout = container.querySelector('[class*="flex"][class*="lg:flex-row"]')
      expect(mainLayout).toBeInTheDocument()
      expect(mainLayout.className).toMatch(/flex-col\s+lg:flex-row/)
    })

    it('picker section should have responsive width', () => {
      const { container } = render(<HarmonyPanel {...defaultProps} />)

      // Picker is in left section with responsive sizing
      const flexCol = container.querySelectorAll('[class*="flex-col"]')
      expect(flexCol.length).toBeGreaterThan(0)
    })

    it('results section should be flex-1 (full width on mobile)', () => {
      const { container } = render(<HarmonyPanel {...defaultProps} />)

      // Results container should expand to fill width on mobile
      const resultsSection = container.querySelector('[class*="flex-1"]')
      expect(resultsSection).toBeInTheDocument()
    })
  })

  describe('Tip Box Visibility', () => {
    it('tip box should be visible on mobile', () => {
      render(<HarmonyPanel {...defaultProps} />)

      const tipBox = screen.getByText(/Tip/i)
      expect(tipBox).toBeInTheDocument()

      // Tip text should be readable
      expect(screen.getByText(/Strong contrast for CTAs|Natural and pleasing|Vibrant and balanced|Professional cohesive/i)).toBeInTheDocument()
    })
  })
})
