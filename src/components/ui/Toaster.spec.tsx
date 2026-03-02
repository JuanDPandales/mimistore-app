import '@testing-library/jest-dom'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Toaster, toast } from './Toaster'

describe('Toaster', () => {
    it('shows toast when called', () => {
        render(<Toaster />)

        act(() => {
            toast('Hello World')
        })

        expect(screen.getByText('Hello World')).toBeInTheDocument()
    })

    it('removes toast when clicking X', () => {
        render(<Toaster />)

        act(() => {
            toast('Close Me')
        })

        const closeButton = screen.getByRole('button')
        fireEvent.click(closeButton)

        expect(screen.queryByText('Close Me')).not.toBeInTheDocument()
    })

    it('handles success and error types', () => {
        render(<Toaster />)

        act(() => {
            toast.success('Success')
        })
        expect(screen.getByText('Success')).toBeInTheDocument()

        act(() => {
            toast.error('Error')
        })
        expect(screen.getByText('Error')).toBeInTheDocument()
    })
})
