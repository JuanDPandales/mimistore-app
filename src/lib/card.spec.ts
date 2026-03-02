import { detectCardType, formatCardNumber, validateLuhn, formatCurrency } from './card'


describe('detectCardType', () => {
  it('detects VISA from numbers starting with 4', () => {
    expect(detectCardType('4111111111111111')).toBe('VISA')
  })

  it('detects MASTERCARD from 51-55 range', () => {
    expect(detectCardType('5500005555555559')).toBe('MASTERCARD')
    expect(detectCardType('5100000000000000')).toBe('MASTERCARD')
  })

  it('returns UNKNOWN for empty string', () => {
    expect(detectCardType('')).toBe('UNKNOWN')
  })

  it('returns UNKNOWN for unsupported prefixes', () => {
    expect(detectCardType('6011111111111117')).toBe('UNKNOWN')
    expect(detectCardType('9111111111111111')).toBe('UNKNOWN')
  })

  it('returns UNKNOWN for non numeric input', () => {
    expect(detectCardType('abcd')).toBe('UNKNOWN')
  })

  it('handles null and undefined safely', () => {
    expect(detectCardType(null as any)).toBe('UNKNOWN')
    expect(detectCardType(undefined as any)).toBe('UNKNOWN')
  })
})

describe('formatCardNumber', () => {
  it('formats 16 digits in groups of 4', () => {
    expect(formatCardNumber('4111111111111111'))
      .toBe('4111 1111 1111 1111')
  })

  it('strips non-numeric characters', () => {
    expect(formatCardNumber('4111-1111-1111-1111'))
      .toBe('4111 1111 1111 1111')
  })

  it('truncates to 16 digits max', () => {
    expect(formatCardNumber('41111111111111119999'))
      .toBe('4111 1111 1111 1111')
  })

  it('handles short numbers correctly', () => {
    expect(formatCardNumber('4111')).toBe('4111')
  })

  it('handles empty string', () => {
    expect(formatCardNumber('')).toBe('')
  })

  it('handles only non-numeric input', () => {
    expect(formatCardNumber('abcd')).toBe('')
  })

  it('handles null and undefined safely', () => {
    expect(formatCardNumber(null as any)).toBe('')
    expect(formatCardNumber(undefined as any)).toBe('')
  })
})

describe('validateLuhn', () => {
  it('validates correct Luhn numbers', () => {
    expect(validateLuhn('4111111111111111')).toBe(true)
    expect(validateLuhn('5500005555555559')).toBe(true)
  })

  it('rejects invalid Luhn numbers', () => {
    expect(validateLuhn('4111111111111112')).toBe(false)
  })

  it('ignores spaces', () => {
    expect(validateLuhn('4111 1111 1111 1111')).toBe(true)
  })

  it('rejects empty string', () => {
    expect(validateLuhn('')).toBe(false)
  })

  it('rejects non-numeric input', () => {
    expect(validateLuhn('abcd')).toBe(false)
  })

  it('handles null and undefined safely', () => {
    expect(validateLuhn(null as any)).toBe(false)
    expect(validateLuhn(undefined as any)).toBe(false)
  })
})

describe('formatCurrency', () => {
  it('formats COP currency for positive values', () => {
    const result = formatCurrency(85000)
    expect(result).toContain('85')
    expect(result).toContain('000')
  })

  it('formats zero correctly', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })

  it('formats negative values correctly', () => {
    const result = formatCurrency(-1000)
    expect(result).toContain('1')
    expect(result).toContain('000')
  })

  it('handles large numbers', () => {
    const result = formatCurrency(999999999)
    expect(result).toContain('999')
  })
})