import React from 'react'
import { render, screen } from '@testing-library/react'
import TabNav from '../../components/TabNav'

// Suppress console.error for propTypes validation testing
const originalError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalError
})

describe('TabNav PropTypes Validation', () => {
  const validProps = {
    tabs: [
      { key: 'hsl', label: 'HSL' },
      { key: 'palette', label: 'Swatches' },
    ],
    current: 'hsl',
    onChange: jest.fn(),
  }

  it('should render with valid props', () => {
    render(<TabNav {...validProps} />)
    expect(screen.getByText('HSL')).toBeInTheDocument()
    expect(screen.getByText('Swatches')).toBeInTheDocument()
  })

  it('should warn when tabs prop is missing', () => {
    const invalidProps = { ...validProps }
    delete invalidProps.tabs
    render(<TabNav {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })

  it('should warn when current prop is missing', () => {
    const invalidProps = { ...validProps }
    delete invalidProps.current
    render(<TabNav {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })

  it('should warn when onChange prop is missing', () => {
    const invalidProps = { ...validProps }
    delete invalidProps.onChange
    render(<TabNav {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })

  it('should handle tab with missing key property', () => {
    const invalidProps = {
      tabs: [{ label: 'HSL' }], // Missing key
      current: 'hsl',
      onChange: jest.fn(),
    }
    render(<TabNav {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })

  it('should handle tab with missing label property', () => {
    const invalidProps = {
      tabs: [{ key: 'hsl' }], // Missing label
      current: 'hsl',
      onChange: jest.fn(),
    }
    render(<TabNav {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })
})
