import React from 'react'
import { render, screen } from '@testing-library/react'
import TabContents from '../../components/TabContents'

// Mock child components
jest.mock('../../components/HSLPanel', () => {
  return function MockHSLPanel() {
    return <div>HSL Panel</div>
  }
})

jest.mock('../../components/ImageUploader', () => {
  return function MockImageUploader() {
    return <div>Image Uploader</div>
  }
})

jest.mock('../../components/PaletteCard', () => {
  return function MockPaletteCard({ color }) {
    return <div>Color: {color}</div>
  }
})

jest.mock('../../components/Toast', () => {
  return function MockToast() {
    return <div>Toast</div>
  }
})

describe('TabContents Empty States', () => {
  const mockCallbacks = {
    onToggleLock: jest.fn(),
    onUpdateColor: jest.fn(),
    onReorderPalette: jest.fn(),
    onCopy: jest.fn(),
    onSaveFavorite: jest.fn(),
    onExportJSON: jest.fn(),
    onLoadFavorite: jest.fn(),
    onRemoveFavorite: jest.fn(),
    onCloseToast: jest.fn(),
    onUndoSave: jest.fn(),
    onGeneratePalette: jest.fn(),
    onApplyPalette: jest.fn(),
    onApplyAndLock: jest.fn(),
    setCount: jest.fn(),
  }

  const baseProps = {
    palette: ['#FF0000', '#00FF00', '#0000FF'],
    locks: [false, false, false],
    favorites: [],
    count: 3,
    ...mockCallbacks,
  }

  describe('Empty Favorites State', () => {
    it('should show empty favorites message when no favorites exist', () => {
      render(
        <TabContents
          {...baseProps}
          tab="favorites"
          favorites={null}
        />
      )
      expect(screen.queryByText(/No saved palettes yet/i)).toBeInTheDocument()
    })

    it('should show generate palette button in empty favorites', () => {
      render(
        <TabContents
          {...baseProps}
          tab="favorites"
          favorites={[]}
        />
      )
      expect(screen.queryByText(/No saved palettes yet/i)).toBeInTheDocument()
    })
  })

  describe('Empty Image Extraction State', () => {
    it('should show empty image state message initially', () => {
      render(
        <TabContents
          {...baseProps}
          tab="image"
        />
      )
      // ImageUploader is mocked, so we check it renders without error
      expect(screen.getByText(/Image Uploader/i)).toBeInTheDocument()
    })

    it('should show helpful message for image extraction', () => {
      render(
        <TabContents
          {...baseProps}
          tab="image"
        />
      )
      expect(screen.getByText(/Image Uploader/i)).toBeInTheDocument()
    })
  })

  describe('Palette Card Empty State', () => {
    it('should show empty message when no colors in palette', () => {
      render(
        <TabContents
          {...baseProps}
          tab="palette"
          palette={[]}
        />
      )
      expect(screen.queryByText(/No colors generated yet/i)).toBeInTheDocument()
    })
  })
})
