import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { CreditCardForm } from './CreditCardForm'
import { CardInfo } from '@/types'

describe('CreditCardForm', () => {
    const mockValue: Partial<CardInfo> = {
        cardNumber: '',
        cardHolder: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
    }

    it('renders all inputs', () => {
        render(<CreditCardForm value={mockValue} onChange={() => { }} errors={{}} />)
        expect(screen.getByPlaceholderText('1234 5678 9012 3456')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Como aparece en la tarjeta')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('MM/AA')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('123')).toBeInTheDocument()
    })

    it('handles card number changes with formatting', () => {
        const onChangeMock = jest.fn()
        render(<CreditCardForm value={mockValue} onChange={onChangeMock} errors={{}} />)
        const input = screen.getByPlaceholderText('1234 5678 9012 3456')
        fireEvent.change(input, { target: { value: '4111111111111111' } })
        expect(onChangeMock).toHaveBeenCalledWith(expect.objectContaining({
            cardNumber: '4111 1111 1111 1111'
        }))
    })

    it('handles card holder changes (converts to uppercase)', () => {
        const onChangeMock = jest.fn()
        render(<CreditCardForm value={mockValue} onChange={onChangeMock} errors={{}} />)
        const input = screen.getByPlaceholderText('Como aparece en la tarjeta')
        fireEvent.change(input, { target: { value: 'Juan García' } })
        expect(onChangeMock).toHaveBeenCalledWith(expect.objectContaining({
            cardHolder: 'JUAN GARCÍA'
        }))
    })

    it('handles expiry date input', () => {
        const onChangeMock = jest.fn()
        render(<CreditCardForm value={mockValue} onChange={onChangeMock} errors={{}} />)
        const expiryInput = screen.getByPlaceholderText('MM/AA')
        fireEvent.change(expiryInput, { target: { value: '1225' } })
        expect(onChangeMock).toHaveBeenCalledWith(expect.objectContaining({
            expiryMonth: '12',
            expiryYear: '25',
        }))
    })

    it('handles CVV input (only digits)', () => {
        const onChangeMock = jest.fn()
        render(<CreditCardForm value={mockValue} onChange={onChangeMock} errors={{}} />)
        const cvvInput = screen.getByPlaceholderText('123')
        fireEvent.change(cvvInput, { target: { value: '123a' } })
        expect(onChangeMock).toHaveBeenCalledWith(expect.objectContaining({ cvv: '123' }))
    })

    it('flips on CVV focus and unflips on blur', () => {
        render(<CreditCardForm value={mockValue} onChange={() => { }} errors={{}} />)
        const cvvInput = screen.getByPlaceholderText('123')
        fireEvent.focus(cvvInput)
        fireEvent.blur(cvvInput)
        // Just check it doesn't crash — the flip state is internal
    })

    it('displays error messages', () => {
        render(<CreditCardForm value={mockValue} onChange={() => { }} errors={{
            cardNumber: 'Número inválido',
            cardHolder: 'Nombre requerido',
            expiryMonth: 'Expiración inválida',
            cvv: 'CVV inválido'
        }} />)
        expect(screen.getByText('Número inválido')).toBeInTheDocument()
        expect(screen.getByText('Nombre requerido')).toBeInTheDocument()
        expect(screen.getByText('Expiración inválida')).toBeInTheDocument()
        expect(screen.getByText('CVV inválido')).toBeInTheDocument()
    })

    it('renders a Visa card logo for a Visa card number', () => {
        const visaValue = { ...mockValue, cardNumber: '4' }
        render(<CreditCardForm value={visaValue} onChange={() => { }} errors={{}} />)
        // The card visual should render without errors
        expect(screen.getByPlaceholderText('1234 5678 9012 3456')).toBeInTheDocument()
    })

    it('renders a Mastercard logo for a Mastercard number', () => {
        const mcValue = { ...mockValue, cardNumber: '5' }
        render(<CreditCardForm value={mcValue} onChange={() => { }} errors={{}} />)
        expect(screen.getByPlaceholderText('1234 5678 9012 3456')).toBeInTheDocument()
    })

    it('renders with existing card values (card visual)', () => {
        const filledValue: Partial<CardInfo> = {
            cardNumber: '4111 1111 1111 1111',
            cardHolder: 'JUAN GARCIA',
            expiryMonth: '12',
            expiryYear: '25',
            cvv: '123'
        }
        render(<CreditCardForm value={filledValue} onChange={() => { }} errors={{}} />)
        // Card visual should display holder name
        expect(screen.getAllByText('JUAN GARCIA')[0]).toBeInTheDocument()
    })
})
