import React from 'react'
import { render, screen } from '@testing-library/react'
import PaletteCard from '../../components/PaletteCard'

const originalError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalError
})

describe('PaletteCard PropTypes Validation', () => {
  const validProps = {
    color: '#FF0000',
    locked: false,
    onToggleLock: jest.fn(),
    onCopy: jest.fn(),
    onColorChange: jest.fn(),
    delay: 0,
    settings: { showCMYK: true, defaultCopy: 'hex', reducedMotion: false },
  }

  it('should render with valid props', () => {
    render(<PaletteCard {...validProps} />)
    expect(screen.getByText(/FF0000/i)).toBeInTheDocument()
  })

  it('should warn when color prop is missing', () => {
    const invalidProps = { ...validProps }
    delete invalidProps.color
    console.error.mockClear()
    render(<PaletteCard {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })

  it('should warn when onToggleLock is missing', () => {
    const invalidProps = { ...validProps }
    delete invalidProps.onToggleLock
    console.error.mockClear()
    render(<PaletteCard {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })

  it('should warn when onCopy is missing', () => {
    const invalidProps = { ...validProps }
    delete invalidProps.onCopy
    console.error.mockClear()
    render(<PaletteCard {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })

  it('should warn when onColorChange is missing', () => {
    const invalidProps = { ...validProps }
    delete invalidProps.onColorChange
    console.error.mockClear()
    render(<PaletteCard {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })

  it('should warn when locked is not a boolean', () => {
    const invalidProps = { ...validProps, locked: 'yes' }
    console.error.mockClear()
    render(<PaletteCard {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })

  it('should warn when delay is not a number', () => {
    const invalidProps = { ...validProps, delay: '100' }
    console.error.mockClear()
    render(<PaletteCard {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })

  it('should use default props correctly', () => {
    const minimalProps = {
      color: '#FF0000',
      onToggleLock: jest.fn(),
      onCopy: jest.fn(),
      onColorChange: jest.fn(),
    }
    render(<PaletteCard {...minimalProps} />)
    expect(screen.getByText(/FF0000/i)).toBeInTheDocument()
  })
})
