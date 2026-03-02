import { detectCardType, formatCardNumber } from '@/lib/card'
import { CardInfo } from '@/types'
import { CreditCard } from 'lucide-react'
import { useState } from 'react'

interface CreditCardFormProps {
    value: Partial<CardInfo>
    onChange: (card: Partial<CardInfo>) => void
    errors: Partial<Record<keyof CardInfo, string>>
}

// ─── Logos inline ────────────────────────────────────────────────────────────
const VisaLogo = () => (
    <svg viewBox="0 0 48 16" className="h-5 w-auto" fill="none">
        <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1A1F71">VISA</text>
    </svg>
)
const MastercardLogo = () => (
    <svg viewBox="0 0 38 24" className="h-5 w-auto">
        <circle cx="13" cy="12" r="12" fill="#EB001B" />
        <circle cx="25" cy="12" r="12" fill="#F79E1B" />
        <path d="M19 5.5a12 12 0 0 1 0 13A12 12 0 0 1 19 5.5z" fill="#FF5F00" />
    </svg>
)

const inputCls = (error?: string) =>
    `w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20
   ${error ? 'border-red-400 bg-red-50' : 'border-border bg-white'}`

export function CreditCardForm({ value, onChange, errors }: CreditCardFormProps) {
    const [flipped, setFlipped] = useState(false)
    const cardType = detectCardType(value.cardNumber ?? '')

    const set = (field: keyof CardInfo, val: string) =>
        onChange({ ...value, [field]: val, cardType: detectCardType(field === 'cardNumber' ? val : (value.cardNumber ?? '')) })

    const handleExpiry = (raw: string) => {
        const clean = raw.replace(/\D/g, '').slice(0, 4)
        onChange({ ...value, expiryMonth: clean.slice(0, 2), expiryYear: clean.slice(2), cardType })
    }

    const expiryDisplay = `${value.expiryMonth ?? ''}${(value.expiryYear ?? '').length > 0 ? '/' : ''}${value.expiryYear ?? ''}`
    const CardLogo = cardType === 'VISA' ? VisaLogo : cardType === 'MASTERCARD' ? MastercardLogo : null

    return (
        <div className="space-y-5">
            {/* Tarjeta visual */}
            {/* Tarjeta visual */}
            <div className="relative mx-auto w-full max-w-sm" style={{ perspective: '2000px' }}>
                <div className={`card-flip relative aspect-[1.586/1] w-full ${flipped ? 'flipped' : ''}`}>
                    {/* Frente */}
                    <div className="card-front absolute inset-0 rounded-[1.25rem] bg-gradient-to-br from-slate-800 via-slate-900 to-black p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
                        {/* Glassmorphism effect overlay */}
                        <div className="absolute inset-0 bg-white/[0.03] pointer-events-none" />
                        <div className="absolute -top-24 -right-24 size-48 rounded-full bg-white/[0.05] blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div className="flex items-start justify-between">
                                {/* Realist Chip */}
                                <div className="relative h-10 w-14 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[1px] shadow-inner overflow-hidden">
                                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-[2px] p-2 opacity-40">
                                        {[...Array(6)].map((_, i) => <div key={i} className="border border-black/20 rounded-sm" />)}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-full w-px bg-black/10 mx-auto" />
                                        <div className="h-px w-full bg-black/10 my-auto absolute" />
                                    </div>
                                </div>
                                {CardLogo ? <CardLogo /> : <CreditCard className="size-8 text-white/20" />}
                            </div>

                            <div className="mt-auto">
                                <div className="font-mono text-xl tracking-[0.2em] text-white/90 drop-shadow-md">
                                    {value.cardNumber || '•••• •••• •••• ••••'}
                                </div>

                                <div className="mt-6 flex items-end justify-between">
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-medium">Titular</p>
                                        <p className="mt-0.5 text-sm font-bold uppercase tracking-wide truncate max-w-[180px]">
                                            {value.cardHolder || 'NOMBRE APELLIDO'}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-medium">Vence</p>
                                        <p className="mt-0.5 text-sm font-bold tracking-wider">{expiryDisplay || 'MM/AA'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Reverso */}
                    <div className="card-back absolute inset-0 rounded-[1.25rem] bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 shadow-2xl overflow-hidden border border-white/5">
                        <div className="mt-8 h-12 w-full bg-black/90" />
                        <div className="mx-6 mt-6">
                            <p className="text-[8px] text-white/40 uppercase tracking-widest mb-1.5 px-1">Firma autorizada</p>
                            <div className="flex items-center">
                                <div className="flex-1 h-10 rounded-sm bg-slate-200/90 flex items-center px-3 italic font-serif text-slate-400 pointer-events-none overflow-hidden whitespace-nowrap opacity-80">
                                    {value.cardHolder || '...................................................'}
                                </div>
                                <div className="ml-3 flex h-9 w-14 items-center justify-center rounded bg-white text-slate-900 font-mono font-bold text-sm shadow-inner">
                                    {value.cvv || '•••'}
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-6 text-[8px] text-white/20 font-medium">
                            ESTA TARJETA ES INTRANSFERIBLE
                        </div>
                    </div>
                </div>
            </div>

            {/* Número */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Número de tarjeta</label>
                <div className="relative">
                    <input type="text" inputMode="numeric" placeholder="1234 5678 9012 3456"
                        value={value.cardNumber ?? ''}
                        onChange={(e) => set('cardNumber', formatCardNumber(e.target.value))}
                        className={inputCls(errors.cardNumber) + ' pr-12 font-mono'} />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {CardLogo ? <CardLogo /> : <CreditCard className="size-5 text-muted-foreground/40" />}
                    </div>
                </div>
                {errors.cardNumber && <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>}
            </div>

            {/* Titular */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nombre del titular</label>
                <input type="text" placeholder="Como aparece en la tarjeta"
                    value={value.cardHolder ?? ''}
                    onChange={(e) => set('cardHolder', e.target.value.toUpperCase())}
                    className={inputCls(errors.cardHolder)} />
                {errors.cardHolder && <p className="mt-1 text-xs text-red-500">{errors.cardHolder}</p>}
            </div>

            {/* Vencimiento + CVV */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Vencimiento</label>
                    <input type="text" inputMode="numeric" placeholder="MM/AA"
                        value={expiryDisplay}
                        onChange={(e) => handleExpiry(e.target.value.replace('/', ''))}
                        className={inputCls(errors.expiryMonth) + ' font-mono'} />
                    {errors.expiryMonth && <p className="mt-1 text-xs text-red-500">{errors.expiryMonth}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">CVV</label>
                    <input type="text" inputMode="numeric" placeholder="123" maxLength={4}
                        value={value.cvv ?? ''}
                        onFocus={() => setFlipped(true)}
                        onBlur={() => setFlipped(false)}
                        onChange={(e) => set('cvv', e.target.value.replace(/\D/g, ''))}
                        className={inputCls(errors.cvv) + ' font-mono'} />
                    {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>}
                </div>
            </div>
        </div>
    )
}