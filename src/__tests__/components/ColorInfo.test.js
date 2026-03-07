import React from 'react'
import { render, screen } from '@testing-library/react'
import ColorInfo from '../../components/ColorInfo'

const originalError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalError
})

describe('ColorInfo PropTypes Validation', () => {
  const validProps = {
    color: '#FF0000',
    primary: true,
    showCMYK: true,
  }

  it('should render with valid props', () => {
    render(<ColorInfo {...validProps} />)
    expect(screen.getByText(/FF0000/i)).toBeInTheDocument()
  })

  it('should warn when color prop is missing', () => {
    const invalidProps = { ...validProps }
    delete invalidProps.color
    console.error.mockClear()
    render(<ColorInfo {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })

  it('should warn when color is not a string', () => {
    const invalidProps = { ...validProps, color: 12345 }
    console.error.mockClear()
    render(<ColorInfo {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })

  it('should warn when primary is not a boolean', () => {
    const invalidProps = { ...validProps, primary: 'yes' }
    console.error.mockClear()
    render(<ColorInfo {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })

  it('should warn when showCMYK is not a boolean', () => {
    const invalidProps = { ...validProps, showCMYK: 'yes' }
    console.error.mockClear()
    render(<ColorInfo {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })

  it('should accept HSL values via props', () => {
    const hslProps = {
      color: '#FF0000',
      h: 0,
      s: 100,
      l: 50,
      primary: true,
      showCMYK: true,
    }
    render(<ColorInfo {...hslProps} />)
    expect(screen.getByText(/FF0000/i)).toBeInTheDocument()
  })

  it('should warn when h is not a number', () => {
    const invalidProps = { ...validProps, h: 'zero' }
    console.error.mockClear()
    render(<ColorInfo {...invalidProps} />)
    expect(console.error).toHaveBeenCalled()
  })

  it('should use default props correctly', () => {
    const minimalProps = { color: '#FF0000' }
    render(<ColorInfo {...minimalProps} />)
    expect(screen.getByText(/FF0000/i)).toBeInTheDocument()
  })
})
