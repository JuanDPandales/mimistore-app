import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { DeliveryForm } from './DeliveryForm'

describe('DeliveryForm', () => {
    const mockCustomer = { name: '', email: '', phone: '' }
    const mockDelivery = { address: '', city: '', department: '' }

    it('renders all person fields', () => {
        render(<DeliveryForm customer={mockCustomer} delivery={mockDelivery} onCustomerChange={() => { }} onDeliveryChange={() => { }} errors={{}} />)

        expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument()
    })

    it('renders all delivery fields', () => {
        render(<DeliveryForm customer={mockCustomer} delivery={mockDelivery} onCustomerChange={() => { }} onDeliveryChange={() => { }} errors={{}} />)

        expect(screen.getByLabelText(/Dirección/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Ciudad/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Departamento/i)).toBeInTheDocument()
    })

    it('handles input changes', () => {
        const onCustomerChangeMock = jest.fn()
        render(<DeliveryForm customer={mockCustomer} delivery={mockDelivery} onCustomerChange={onCustomerChangeMock} onDeliveryChange={() => { }} errors={{}} />)

        const input = screen.getByLabelText(/Nombre completo/i)
        fireEvent.change(input, { target: { value: 'Juan' } })

        expect(onCustomerChangeMock).toHaveBeenCalledWith(expect.objectContaining({ name: 'Juan' }))
    })

    it('handles department selection', () => {
        const onDeliveryChangeMock = jest.fn()
        render(<DeliveryForm customer={mockCustomer} delivery={mockDelivery} onCustomerChange={() => { }} onDeliveryChange={onDeliveryChangeMock} errors={{}} />)

        const select = screen.getByLabelText(/Departamento/i)
        fireEvent.change(select, { target: { value: 'Antioquia' } })

        expect(onDeliveryChangeMock).toHaveBeenCalledWith(expect.objectContaining({ department: 'Antioquia' }))
    })

    it('displays error messages', () => {
        render(<DeliveryForm customer={mockCustomer} delivery={mockDelivery} onCustomerChange={() => { }} onDeliveryChange={() => { }} errors={{ name: 'Required' }} />)
        expect(screen.getByText('Required')).toBeInTheDocument()
    })
})
