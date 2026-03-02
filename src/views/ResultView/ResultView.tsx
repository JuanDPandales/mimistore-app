import { formatCurrency } from '@/lib/card'
import { useAppDispatch, useAppSelector } from '@/store'
import { resetFlow } from '@/store/slices/checkoutSlide'
import { refreshStock } from '@/store/slices/productSlide'
import { AlertCircle, ArrowRight, CheckCircle, RefreshCw, XCircle } from 'lucide-react'
import { useEffect } from 'react'

export default function ResultView() {
    const dispatch = useAppDispatch()
    const { transaction, selectedProduct, summary, customer, delivery } = useAppSelector((s) => s.checkout)

    useEffect(() => {
        // Actualizar stock del producto comprado al entrar a la pantalla de resultado
        if (selectedProduct) dispatch(refreshStock(selectedProduct.id))
    }, [selectedProduct, dispatch])

    if (!transaction) { dispatch(resetFlow()); return null }

    const isApproved = transaction.status === 'APPROVED'
    const isDeclined = transaction.status === 'DECLINED'
    const isPending = transaction.status === 'PENDING'

    const StatusIcon = isApproved ? CheckCircle : isDeclined ? XCircle : AlertCircle
    const iconColor = isApproved ? 'text-green-500' : isDeclined ? 'text-red-500' : 'text-amber-500'
    const bgColor = isApproved ? 'bg-green-100' : isDeclined ? 'bg-red-100' : 'bg-amber-100'

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
            <div className="mx-auto w-full max-w-sm animate-fade-in">
                {/* Ícono de estado */}
                <div className="mb-6 flex justify-center">
                    <div className={`flex size-24 items-center justify-center rounded-full ${bgColor}`}>
                        <StatusIcon className={`size-12 ${iconColor}`} />
                    </div>
                </div>

                {/* Título */}
                <h1 className="font-serif text-2xl font-bold text-center text-foreground mb-2">
                    {isApproved ? '¡Pago exitoso!' : isDeclined ? 'Pago rechazado' : isPending ? 'Pago en proceso' : 'Error en el pago'}
                </h1>
                <p className="text-center text-sm text-muted-foreground mb-8">
                    {isApproved
                        ? `Tu pedido está confirmado y será enviado a ${delivery?.city ?? 'tu dirección'}.`
                        : isDeclined
                            ? 'Tu tarjeta fue rechazada. Verifica los datos e intenta de nuevo.'
                            : isPending
                                ? 'Tu pago está siendo verificado. Recibirás confirmación en tu correo pronto.'
                                : 'Ocurrió un error procesando el pago. Por favor intenta de nuevo.'}
                </p>

                {/* Recibo */}
                {(isApproved || transaction.reference) && (
                    <div className="rounded-3xl border border-border bg-card p-5 mb-6 space-y-3">
                        {selectedProduct && (
                            <div className="flex items-center gap-3 pb-3 border-b border-border">
                                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="size-12 rounded-xl object-cover bg-muted" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{selectedProduct.name}</p>
                                    <p className="text-xs text-muted-foreground">{selectedProduct.category}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5 text-sm">
                            {transaction.reference && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Referencia</span>
                                    <span className="font-mono text-xs font-medium">{transaction.reference}</span>
                                </div>
                            )}
                            {customer?.email && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Correo</span>
                                    <span className="text-xs truncate max-w-[160px]">{customer.email}</span>
                                </div>
                            )}
                            {summary && (
                                <div className="flex justify-between font-semibold pt-1 border-t border-border">
                                    <span>Total</span>
                                    <span className="text-primary">{formatCurrency(summary.total)}</span>
                                </div>
                            )}
                        </div>

                        <div className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold
              ${isApproved ? 'bg-green-100 text-green-700' : isPending ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            <StatusIcon className="size-3.5" />
                            {transaction.status}
                        </div>
                    </div>
                )}

                {/* Acciones */}
                {isApproved ? (
                    <button onClick={() => dispatch(resetFlow())}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-white hover:bg-primary-500 transition-all active:scale-95">
                        Volver a la tienda <ArrowRight className="size-4" />
                    </button>
                ) : isPending ? (
                    <button onClick={() => dispatch(resetFlow())}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-white hover:bg-primary-500 transition-all active:scale-95">
                        Volver a la tienda <ArrowRight className="size-4" />
                    </button>
                ) : (
                    <div className="space-y-3">
                        <button onClick={() => dispatch(resetFlow())}
                            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-white hover:bg-primary-500 transition-all">
                            <RefreshCw className="size-4" /> Intentar de nuevo
                        </button>
                        <button onClick={() => dispatch(resetFlow())}
                            className="w-full rounded-2xl border border-border py-3 text-sm font-medium text-foreground hover:bg-muted transition-all">
                            Volver a la tienda
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}