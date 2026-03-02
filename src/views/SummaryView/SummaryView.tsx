import { BackdropSummary } from '@/components/checkout/BackdropSummary'
import { toast } from '@/components/ui/Toaster'
import { apiClient, tokenizeCard } from '@/lib/api'
import { useAppDispatch, useAppSelector } from '@/store'
import { goToStep, setLoading, setTransactionResult } from '@/store/slices/checkoutSlide'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function SummaryView() {
    const navigate = useAppDispatch()

    // Guardia — si falta estado, volver al inicio
    const shouldRedirect = !selectedProduct || !summary || !card || !customer || !delivery

    useEffect(() => {
        if (shouldRedirect) {
            dispatch(goToStep(1))
        }
    }, [shouldRedirect, dispatch])

    if (shouldRedirect) {
        return null
    }

    const handleConfirm = async () => {
        if (processing) return
        setProcessing(true)
        dispatch(setLoading(true))

        try {
            // 1. Tokenizar tarjeta directo al gateway (nunca pasan por nuestro backend)
            const cardToken = await tokenizeCard({
                number: card.cardNumber.replace(/\s/g, ''),
                exp_month: card.expiryMonth,
                exp_year: card.expiryYear,
                cvc: card.cvv,
                card_holder: card.cardHolder,
            })

            // 2. Enviar token a nuestro backend — el backend procesa el cobro
            const idempotencyKey = `${selectedProduct.id}-${customer.email}-${Date.now()}`
            const { data } = await apiClient.post(
                '/transactions',
                {
                    productId: selectedProduct.id,
                    cardToken: cardToken.id,
                    customerEmail: customer.email,
                    customerName: customer.name,
                    customerPhone: customer.phone,
                    deliveryAddress: delivery.address,
                    deliveryCity: delivery.city,
                    deliveryDepartment: delivery.department,
                },
                { headers: { 'X-Idempotency-Key': idempotencyKey } }
            )

            dispatch(setTransactionResult({
                id: data.data.transactionId,
                reference: data.data.reference,
                status: data.data.status,
                gatewayId: data.data.gatewayId,
                amount: data.data.amountInCents,
            }))
        } catch (e: any) {
            toast.error(e?.message ?? 'Error procesando el pago')
            dispatch(setTransactionResult({
                id: 'error', reference: '', status: 'ERROR', gatewayId: null, amount: summary.total,
            }))
        } finally {
            setProcessing(false)
            dispatch(setLoading(false))
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-10 border-b border-border bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
                    <button onClick={() => dispatch(goToStep(2))} disabled={processing}
                        className="flex size-9 items-center justify-center rounded-xl border border-border bg-white hover:bg-muted transition-colors disabled:opacity-40">
                        <ArrowLeft className="size-4" />
                    </button>
                    <div className="flex-1">
                        <p className="text-sm font-semibold">Confirmar pago</p>
                        <p className="text-xs text-muted-foreground">Paso 3 de 3</p>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3].map((s) => <div key={s} className="h-1.5 w-6 rounded-full bg-primary" />)}
                    </div>
                </div>
            </header>

            {/* Fondo fantasma para que el backdrop tenga algo detrás */}
            <div className="mx-auto max-w-lg px-4 py-6 opacity-30 pointer-events-none select-none">
                <div className="h-40 rounded-3xl bg-muted" />
            </div>

            <BackdropSummary
                product={selectedProduct}
                summary={summary}
                isLoading={processing || isLoading}
                onConfirm={handleConfirm}
                onBack={() => !processing && dispatch(goToStep(2))}
            />
        </div>
    )
}