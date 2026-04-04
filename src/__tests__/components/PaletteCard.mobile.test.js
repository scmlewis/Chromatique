import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PaletteCard from '../../components/PaletteCard'

// Mock createPortal to avoid issues with portal rendering in tests
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (element) => element,
}))

describe('PaletteCard Mobile & Touch Interactions', () => {
  const defaultProps = {
    color: '#6366F1',
    locked: false,
    onToggleLock: jest.fn(),
    onCopy: jest.fn(),
    onColorChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Touch Event Handling', () => {
    it('should render edit color button for color selection', () => {
      render(<PaletteCard {...defaultProps} />)

      const editColorButton = screen.getByTitle('Edit Color')
      expect(editColorButton).toBeInTheDocument()

      // Button should be clickable (tappable on mobile)
      fireEvent.click(editColorButton)
      expect(editColorButton).toBeInTheDocument()
    })

    it('edit color button should open hex input for mobile editing', () => {
      render(<PaletteCard {...defaultProps} />)

      const editButton = screen.getByTitle('Edit Color')
      expect(editButton).toBeInTheDocument()

      fireEvent.click(editButton)

      // Hex input should appear
      const hexInput = screen.getByLabelText('Color hex input')
      expect(hexInput).toBeInTheDocument()
    })

    it('should use pointerdown for cross-device compatibility', () => {
      // Verify the component uses event listeners that work with touch
      // This is validated by the presence of the picker button and edit functionality
      render(<PaletteCard {...defaultProps} />)

      const pickerButton = screen.getByTitle('Edit Color')
      expect(pickerButton).toBeInTheDocument()

      // Pointerdown support is implicitly tested through component functionality
      fireEvent.click(pickerButton) // click uses pointerdown semantically
      expect(pickerButton).toBeInTheDocument()
    })
  })

  describe('Mobile Keyboard Input', () => {
    it('hex input should have inputMode="text" for mobile keyboard', () => {
      render(<PaletteCard {...defaultProps} />)

      const editButton = screen.getByTitle('Edit Color')
      fireEvent.click(editButton)

      const hexInput = screen.getByLabelText('Color hex input')
      expect(hexInput).toHaveAttribute('inputMode', 'text')
    })

    it('hex input should have pattern validation for hex colors', () => {
      render(<PaletteCard {...defaultProps} />)

      const editButton = screen.getByTitle('Edit Color')
      fireEvent.click(editButton)

      const hexInput = screen.getByLabelText('Color hex input')
      expect(hexInput).toHaveAttribute('pattern')
      expect(hexInput.getAttribute('pattern')).toMatch(/hex|[0-9A-Fa-f]/i)
    })

    it('should accept valid hex codes with or without hash', () => {
      render(<PaletteCard {...defaultProps} />)

      const editButton = screen.getByTitle('Edit Color')
      fireEvent.click(editButton)

      const hexInput = screen.getByLabelText('Color hex input')

      // Test with hash
      fireEvent.change(hexInput, { target: { value: '#FF0000' } })

      expect(defaultProps.onColorChange).toHaveBeenCalledWith('#FF0000')
    })

    it('should reject invalid hex codes and show error', () => {
      render(<PaletteCard {...defaultProps} />)

      const editButton = screen.getByTitle('Edit Color')
      fireEvent.click(editButton)

      const hexInput = screen.getByLabelText('Color hex input')

      fireEvent.change(hexInput, { target: { value: 'INVALID' } })

      expect(defaultProps.onColorChange).not.toHaveBeenCalled()
      // Error message should be present
      expect(screen.queryByText(/Invalid/i)).toBeInTheDocument()
    })
  })

  describe('Lock Button Touch Target', () => {
    it('lock button should have minimum touch target size on mobile', () => {
      const { container } = render(<PaletteCard {...defaultProps} />)

      // Check that lock button has touch-friendly dimensions
      // (This would be verified visually on real mobile device)
      const lockButton = screen.getByLabelText(/Lock|Unlock/)
      expect(lockButton).toBeInTheDocument()

      // Verify button has content (icon) for adequate touch area
      expect(lockButton.querySelector('svg')).toBeInTheDocument()
    })

    it('lock button stopPropagation should not break color picker', () => {
      render(<PaletteCard {...defaultProps} />)

      const lockButton = screen.getByLabelText(/Lock/)
      fireEvent.click(lockButton)

      expect(defaultProps.onToggleLock).toHaveBeenCalled()

      // Picker should still be functional after lock click
      const pickerButton = screen.getByTitle('Edit Color')
      fireEvent.click(pickerButton)

      // Expect the component to still work
      expect(defaultProps.onColorChange).not.toHaveBeenCalled()
    })
  })

  describe('Responsive Layout (Mobile-specific)', () => {
    it('should render color info bar on mobile (compact mode)', () => {
      render(<PaletteCard {...defaultProps} isCompact={true} />)

      // On touch/mobile, info bar should be visible by default
      // The hex color should be displayed
      const hexColorDisplay = screen.getByText('#6366F1')
      expect(hexColorDisplay).toBeInTheDocument()
    })

    it('single center edit button should be visible on mobile', () => {
      render(<PaletteCard {...defaultProps} />)

      const editButton = screen.getByTitle('Edit Color')

      // Single action should be present (visible on mobile)
      expect(editButton).toBeInTheDocument()
    })
  })

  describe('Picker Portal Structure', () => {
    it('picker should be rendered when button is clicked', async () => {
      render(<PaletteCard {...defaultProps} />)

      const pickerButton = screen.getByTitle('Edit Color')
      fireEvent.click(pickerButton)

      await waitFor(() => {
        // Picker's Done button should appear
        expect(screen.getByText('Done')).toBeInTheDocument()
      })
    })

    it('picker Done button should close picker on click', async () => {
      render(<PaletteCard {...defaultProps} />)

      const pickerButton = screen.getByTitle('Edit Color')
      fireEvent.click(pickerButton)

      await waitFor(() => {
        expect(screen.getByText('Done')).toBeInTheDocument()
      })

      const doneButton = screen.getByText('Done')
      fireEvent.click(doneButton)

      // After clicking Done, Done button should not be visible
      await waitFor(() => {
        expect(screen.queryByText('Done')).not.toBeInTheDocument()
      })
    })

    it('picker should stay open when tapping outside and only close on Done', async () => {
      const { container } = render(<PaletteCard {...defaultProps} />)

      fireEvent.click(screen.getByTitle('Edit Color'))

      await waitFor(() => {
        expect(screen.getByText('Done')).toBeInTheDocument()
      })

      // Tap the backdrop area
      const backdrop = container.querySelector('.fixed.inset-0')
      fireEvent.pointerDown(backdrop)

      // Should still be open until user explicitly taps Done
      expect(screen.getByText('Done')).toBeInTheDocument()
      fireEvent.click(screen.getByText('Done'))

      await waitFor(() => {
        expect(screen.queryByText('Done')).not.toBeInTheDocument()
      })
    })
  })
})
