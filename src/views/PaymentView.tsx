import { CreditCardForm } from '@/components/checkout/CreditCardForm'
import { DeliveryForm } from '@/components/checkout/DeliveryForm'
import { toast } from '@/components/ui/Toaster'
import { detectCardType, validateLuhn } from '@/lib/card'
import { useAppDispatch, useAppSelector } from '@/store'
import { goToStep, setPaymentInfo } from '@/store/slices/checkoutSlide'
import { CardInfo, Customer, DeliveryInfo } from '@/types'
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react'
import { useState } from 'react'

type Tab = 'card' | 'delivery'

const ProgressBar = ({ step }: { step: number }) => (
    <div className="flex gap-1">
        {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 w-6 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
        ))}
    </div>
)

export default function PaymentView() {
    const dispatch = useAppDispatch()
    const { selectedProduct } = useAppSelector((s) => s.checkout)
    const [tab, setTab] = useState<Tab>('card')
    const [card, setCard] = useState<Partial<CardInfo>>({})
    const [customer, setCustomer] = useState<Partial<Customer>>({})
    const [delivery, setDelivery] = useState<Partial<DeliveryInfo>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validate = (): boolean => {
        const e: Record<string, string> = {}
        const rawNumber = (card.cardNumber ?? '').replace(/\s/g, '')
        if (!rawNumber || rawNumber.length < 16 || !validateLuhn(rawNumber)) e.cardNumber = 'Número de tarjeta inválido'
        if (!card.cardHolder || card.cardHolder.trim().length < 3) e.cardHolder = 'Ingresa el nombre del titular'
        if (!card.expiryMonth || !card.expiryYear || card.expiryMonth.length < 2 || card.expiryYear.length < 2) e.expiryMonth = 'Fecha de vencimiento inválida'
        if (!card.cvv || card.cvv.length < 3) e.cvv = 'CVV inválido'
        if (!customer.name || customer.name.trim().length < 3) e.name = 'Ingresa tu nombre completo'
        if (!customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) e.email = 'Correo inválido'
        if (!customer.phone || customer.phone.replace(/\D/g, '').length < 7) e.phone = 'Teléfono inválido'
        if (!delivery.address || delivery.address.trim().length < 5) e.address = 'Ingresa tu dirección completa'
        if (!delivery.city || delivery.city.trim().length < 2) e.city = 'Ingresa la ciudad'
        if (!delivery.department) e.department = 'Selecciona el departamento'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleContinue = () => {
        if (!validate()) {
            const hasCardErrors = ['cardNumber', 'cardHolder', 'expiryMonth', 'cvv'].some((f) => errors[f])
            setTab(hasCardErrors ? 'card' : 'delivery')
            toast.error('Por favor completa todos los campos')
            return
        }
        dispatch(setPaymentInfo({
            customer: customer as Customer,
            delivery: delivery as DeliveryInfo,
            card: { ...card, cardType: detectCardType(card.cardNumber ?? '') } as CardInfo,
        }))
    }

    const cardErrors = ['cardNumber', 'cardHolder', 'expiryMonth', 'cvv'].some((f) => errors[f])
    const delivErrors = ['name', 'email', 'phone', 'address', 'city', 'department'].some((f) => errors[f])

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-10 border-b border-border bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
                    <button onClick={() => dispatch(goToStep(1))}
                        className="flex size-9 items-center justify-center rounded-xl border border-border bg-white hover:bg-muted transition-colors">
                        <ArrowLeft className="size-4" />
                    </button>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">Datos de pago</p>
                        <p className="text-xs text-muted-foreground">Paso 2 de 3</p>
                    </div>
                    <ProgressBar step={2} />
                </div>
            </header>

            <main className="mx-auto max-w-lg px-4 py-6">
                {/* Preview producto seleccionado */}
                {selectedProduct && (
                    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                        <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="size-12 rounded-xl object-cover bg-muted" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{selectedProduct.name}</p>
                            <p className="text-xs text-muted-foreground">{selectedProduct.category}</p>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-5 flex gap-1 rounded-2xl bg-muted p-1">
                    {([['card', 'Tarjeta', CreditCard, cardErrors], ['delivery', 'Entrega', MapPin, delivErrors]] as const).map(([id, label, Icon, hasError]) => (
                        <button key={id} onClick={() => setTab(id)}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium transition-all
                ${tab === id ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                            <Icon className="size-3.5" />
                            {label}
                            {hasError && <span className="size-1.5 rounded-full bg-red-500" />}
                        </button>
                    ))}
                </div>

                {tab === 'card' && <div className="animate-fade-in"><CreditCardForm value={card} onChange={setCard} errors={errors} /></div>}
                {tab === 'delivery' && <div className="animate-fade-in"><DeliveryForm customer={customer} delivery={delivery} onCustomerChange={setCustomer} onDeliveryChange={setDelivery} errors={errors} /></div>}

                <div className="mt-6 space-y-2">
                    <button onClick={handleContinue}
                        className="w-full rounded-2xl bg-primary py-4 text-base font-bold text-white transition-all hover:bg-primary-500 active:scale-95">
                        Ver resumen del pago →
                    </button>
                    <p className="text-center text-xs text-muted-foreground">🔒 Tus datos están seguros y encriptados</p>
                </div>
            </main>
        </div>
    )
}