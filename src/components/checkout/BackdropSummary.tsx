import { formatCurrency } from '@/lib/card'
import { PaymentSummary, Product } from '@/types'
import { ChevronDown, Package, Shield, Truck } from 'lucide-react'

interface BackdropSummaryProps {
    product: Product
    summary: PaymentSummary
    isLoading: boolean
    onConfirm: () => void
    onBack: () => void
}

const Spinner = () => (
    <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
)

export function BackdropSummary({ product, summary, isLoading, onConfirm, onBack }: BackdropSummaryProps) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col">
            {/* Capa trasera — fondo borroso, click para volver */}
            <div className="backdrop-overlay flex-none cursor-pointer" style={{ height: '35%' }} onClick={onBack}>
                <div className="flex h-full items-center justify-center">
                    <div className="text-center text-white/80">
                        <p className="text-sm font-medium">Toca para editar</p>
                        <ChevronDown className="mx-auto mt-1 size-5 animate-bounce" />
                    </div>
                </div>
            </div>

            {/* Sheet principal */}
            <div className="flex-1 overflow-auto rounded-t-3xl bg-background shadow-2xl animate-slide-up">
                <div className="mx-auto max-w-lg px-5 pb-8 pt-5">
                    <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border" />
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-5">Resumen del pago</h2>

                    {/* Producto */}
                    <div className="flex items-center gap-3 rounded-2xl border border-border p-3 mb-4">
                        <img src={product.imageUrl} alt={product.name} className="size-14 rounded-xl object-cover bg-muted" />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                        <span className="font-semibold text-sm">{formatCurrency(summary.productAmount)}</span>
                    </div>

                    {/* Desglose de cargos */}
                    <div className="rounded-2xl bg-muted p-4 space-y-2 mb-5">
                        {[
                            { Icon: Package, label: 'Producto', amount: summary.productAmount },
                            { Icon: Shield, label: 'Cargo base', amount: summary.baseFee },
                            { Icon: Truck, label: 'Envío', amount: summary.deliveryFee },
                        ].map(({ Icon, label, amount }) => (
                            <div key={label} className="flex justify-between text-sm">
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <Icon className="size-3.5" /> {label}
                                </span>
                                <span>{formatCurrency(amount)}</span>
                            </div>
                        ))}
                        <div className="h-px bg-border" />
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span className="text-primary font-serif text-lg">{formatCurrency(summary.total)}</span>
                        </div>
                    </div>

                    {/* Aviso de seguridad */}
                    <div className="flex items-center gap-2 rounded-2xl bg-green-50 border border-green-100 p-3 mb-5">
                        <Shield className="size-4 text-green-600 shrink-0" />
                        <p className="text-xs text-green-700">
                            Pago procesado de forma segura. Tus datos están protegidos con encriptación SSL.
                        </p>
                    </div>

                    {/* CTA */}
                    <button onClick={onConfirm} disabled={isLoading}
                        className="w-full rounded-2xl bg-primary py-4 text-base font-bold text-white transition-all hover:bg-primary-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {isLoading ? <><Spinner /> Procesando pago...</> : `Pagar ${formatCurrency(summary.total)}`}
                    </button>
                </div>
            </div>
        </div>
    )
}