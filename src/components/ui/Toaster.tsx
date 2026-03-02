import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error'

interface Toast { id: number; message: string; type: ToastType }

let toastId = 0
const listeners: Array<(t: Toast) => void> = []

export function toast(message: string, type: ToastType = 'success') {
    const t = { id: ++toastId, message, type }
    listeners.forEach((fn) => fn(t))
}
toast.success = (msg: string) => toast(msg, 'success')
toast.error = (msg: string) => toast(msg, 'error')

export function Toaster() {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((t: Toast) => {
        setToasts((prev) => [...prev, t])
        setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 3500)
    }, [])

    useEffect(() => {
        listeners.push(addToast)
        return () => { const i = listeners.indexOf(addToast); if (i > -1) listeners.splice(i, 1) }
    }, [addToast])

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-3 shadow-lg text-sm font-medium animate-slide-up
            ${t.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'}`}
                >
                    {t.type === 'success'
                        ? <CheckCircle className="size-4 shrink-0 text-green-500" />
                        : <XCircle className="size-4 shrink-0 text-red-500" />}
                    {t.message}
                    <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))} className="ml-1">
                        <X className="size-3" />
                    </button>
                </div>
            ))}
        </div>
    )
}