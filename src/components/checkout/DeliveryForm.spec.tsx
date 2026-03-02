import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { DeliveryForm } from './DeliveryForm'

describe('DeliveryForm', () => {
    const mockCustomer = { name: '', email: '', phone: '' }
    const mockDelivery = { address: '', city: '', department: '' }

    it('renders all person fields', () => {
        render(<DeliveryForm customer={mockCustomer} delivery={mockDelivery} onCustomerChange={() => { }} onDeliveryChange={() => { }} errors={{}} />)
        // Use placeholder text since labels don't have htmlFor
        expect(screen.getByPlaceholderText('Juan García')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('juan@email.com')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('3001234567')).toBeInTheDocument()
    })

    it('renders all delivery fields', () => {
        render(<DeliveryForm customer={mockCustomer} delivery={mockDelivery} onCustomerChange={() => { }} onDeliveryChange={() => { }} errors={{}} />)
        expect(screen.getByPlaceholderText(/Calle 100/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Bogotá')).toBeInTheDocument()
        expect(screen.getByText('Selecciona un departamento')).toBeInTheDocument()
    })

    it('handles name input change', () => {
        const onCustomerChangeMock = jest.fn()
        render(<DeliveryForm customer={mockCustomer} delivery={mockDelivery} onCustomerChange={onCustomerChangeMock} onDeliveryChange={() => { }} errors={{}} />)
        const input = screen.getByPlaceholderText('Juan García')
        fireEvent.change(input, { target: { value: 'Juan', name: 'name' } })
        expect(onCustomerChangeMock).toHaveBeenCalled()
    })

    it('handles email input change', () => {
        const onCustomerChangeMock = jest.fn()
        render(<DeliveryForm customer={mockCustomer} delivery={mockDelivery} onCustomerChange={onCustomerChangeMock} onDeliveryChange={() => { }} errors={{}} />)
        const input = screen.getByPlaceholderText('juan@email.com')
        fireEvent.change(input, { target: { value: 'test@email.com', name: 'email' } })
        expect(onCustomerChangeMock).toHaveBeenCalled()
    })

    it('handles address input change', () => {
        const onDeliveryChangeMock = jest.fn()
        render(<DeliveryForm customer={mockCustomer} delivery={mockDelivery} onCustomerChange={() => { }} onDeliveryChange={onDeliveryChangeMock} errors={{}} />)
        const input = screen.getByPlaceholderText(/Calle 100/i)
        fireEvent.change(input, { target: { value: 'Calle 50 #10', name: 'address' } })
        expect(onDeliveryChangeMock).toHaveBeenCalled()
    })

    it('handles city input change', () => {
        const onDeliveryChangeMock = jest.fn()
        render(<DeliveryForm customer={mockCustomer} delivery={mockDelivery} onCustomerChange={() => { }} onDeliveryChange={onDeliveryChangeMock} errors={{}} />)
        const input = screen.getByPlaceholderText('Bogotá')
        fireEvent.change(input, { target: { value: 'Medellín', name: 'city' } })
        expect(onDeliveryChangeMock).toHaveBeenCalled()
    })

    it('handles department selection', () => {
        const onDeliveryChangeMock = jest.fn()
        render(<DeliveryForm customer={mockCustomer} delivery={mockDelivery} onCustomerChange={() => { }} onDeliveryChange={onDeliveryChangeMock} errors={{}} />)
        const select = screen.getByRole('combobox')
        fireEvent.change(select, { target: { value: 'Antioquia', name: 'department' } })
        expect(onDeliveryChangeMock).toHaveBeenCalled()
    })

    it('displays error messages for customer fields', () => {
        render(<DeliveryForm customer={mockCustomer} delivery={mockDelivery} onCustomerChange={() => { }} onDeliveryChange={() => { }} errors={{ name: 'El nombre es requerido', email: 'Correo inválido' }} />)
        expect(screen.getByText('El nombre es requerido')).toBeInTheDocument()
        expect(screen.getByText('Correo inválido')).toBeInTheDocument()
    })

    it('displays error messages for delivery fields', () => {
        render(<DeliveryForm customer={mockCustomer} delivery={mockDelivery} onCustomerChange={() => { }} onDeliveryChange={() => { }} errors={{ address: 'Dirección requerida', department: 'Selecciona departamento' }} />)
        expect(screen.getByText('Dirección requerida')).toBeInTheDocument()
        expect(screen.getByText('Selecciona departamento')).toBeInTheDocument()
    })
})
