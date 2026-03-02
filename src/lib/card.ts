export type CardType = 'VISA' | 'MASTERCARD' | 'UNKNOWN'

export function detectCardType(number: string): CardType {
    const clean = number.replace(/\s/g, '')
    if (/^4/.test(clean)) return 'VISA'
    if (/^5[1-5]/.test(clean) || /^2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720)/.test(clean))
        return 'MASTERCARD'
    return 'UNKNOWN'
}

export function formatCardNumber(value: string): string {
    const clean = value.replace(/\D/g, '').slice(0, 16)
    return clean.replace(/(.{4})/g, '$1 ').trim()
}

export function validateLuhn(number: string): boolean {
    const clean = number.replace(/\s/g, '')
    let sum = 0, shouldDouble = false
    for (let i = clean.length - 1; i >= 0; i--) {
        let digit = parseInt(clean[i], 10)
        if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9 }
        sum += digit
        shouldDouble = !shouldDouble
    }
    return sum % 10 === 0
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0,
    }).format(amount)
}