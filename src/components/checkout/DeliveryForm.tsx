import { Customer, DeliveryInfo } from '@/types'

interface DeliveryFormProps {
    customer: Partial<Customer>
    delivery: Partial<DeliveryInfo>
    onCustomerChange: (c: Partial<Customer>) => void
    onDeliveryChange: (d: Partial<DeliveryInfo>) => void
    errors: Partial<Record<string, string>>
}

const inputCls = (error?: string) =>
    `w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20
   ${error ? 'border-red-400 bg-red-50' : 'border-border bg-white'}`

const Field = ({ label, value, onChange, placeholder, type = 'text', error }: {
    label: string; value: string; onChange: (v: string) => void
    placeholder?: string; type?: string; error?: string
}) => (
    <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
        <input type={type} value={value} placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)} className={inputCls(error)} />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
)

const colombiaDepartments = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas',
    'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca',
    'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño',
    'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés', 'Santander',
    'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada',
]

export function DeliveryForm({ customer, delivery, onCustomerChange, onDeliveryChange, errors }: DeliveryFormProps) {
    return (
        <div className="space-y-5">
            <div className="rounded-2xl bg-primary/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">Datos personales</p>
                <div className="space-y-3">
                    <Field label="Nombre completo" value={customer.name ?? ''} onChange={(v) => onCustomerChange({ ...customer, name: v })} placeholder="Juan García" error={errors.name} />
                    <Field label="Correo electrónico" value={customer.email ?? ''} onChange={(v) => onCustomerChange({ ...customer, email: v })} placeholder="juan@email.com" type="email" error={errors.email} />
                    <Field label="Teléfono" value={customer.phone ?? ''} onChange={(v) => onCustomerChange({ ...customer, phone: v })} placeholder="3001234567" type="tel" error={errors.phone} />
                </div>
            </div>

            <div className="rounded-2xl bg-primary/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">Dirección de entrega</p>
                <div className="space-y-3">
                    <Field label="Dirección" value={delivery.address ?? ''} onChange={(v) => onDeliveryChange({ ...delivery, address: v })} placeholder="Calle 100 #15-20, Apto 301" error={errors.address} />
                    <Field label="Ciudad" value={delivery.city ?? ''} onChange={(v) => onDeliveryChange({ ...delivery, city: v })} placeholder="Bogotá" error={errors.city} />
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Departamento</label>
                        <select value={delivery.department ?? ''} onChange={(e) => onDeliveryChange({ ...delivery, department: e.target.value })}
                            className={inputCls(errors.department) + ' bg-white'}>
                            <option value="">Selecciona un departamento</option>
                            {colombiaDepartments.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                        {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}