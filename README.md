# Pawsome Store — Frontend

SPA de checkout de 4 pasos construida con **React 18 + TypeScript + Redux Toolkit + Tailwind CSS**.

---

## Stack

| Categoría | Tecnología |
|---|---|
| Framework | React 18 + Vite 5 |
| Lenguaje | TypeScript 5 (strict) |
| Estado global | Redux Toolkit 2 |
| Estilos | Tailwind CSS 3 |
| HTTP | Axios 1.7 |
| Iconos | Lucide React |
| Tests | Jest 29 + Testing Library |
| Package manager | pnpm |

---

## Prerrequisitos

| Herramienta | Versión mínima | Verificar |
|---|---|---|
| Node.js | 20.x | `node -v` |
| pnpm | 9.x | `pnpm -v` |

---

## Instalación y arranque

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Iniciar en modo desarrollo
pnpm dev
```

La app queda disponible en **http://localhost:3000**.

> El servidor de desarrollo incluye un proxy que redirige `/api/*` → `http://localhost:4000`,
> por lo que el backend debe estar corriendo antes de hacer cualquier llamada.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo con HMR |
| `pnpm build` | Build de producción (`tsc && vite build`) |
| `pnpm preview` | Preview del build de producción |
| `pnpm test` | Ejecutar todos los tests |
| `pnpm test:cov` | Tests con reporte de cobertura |
| `pnpm lint` | Análisis estático con ESLint |

---

## Variables de entorno

Crea un archivo `.env` en la raíz del frontend copiando `.env.example`:

```env
# URL base del backend (el proxy de Vite la usa en desarrollo)
VITE_API_URL=http://localhost:4000/api

# Clave pública del payment gateway (para tokenizar la tarjeta en el navegador)
VITE_GATEWAY_PUB_KEY=pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7

# URL base del gateway (tokenización directa, sin pasar por nuestro backend)
VITE_GATEWAY_BASE_URL=https://api-sandbox.co.uat.sandbox.dev/v1
```

> **Seguridad:** los datos de tarjeta nunca pasan por el backend.
> El frontend tokeniza la tarjeta directamente con el gateway usando `VITE_GATEWAY_PUB_KEY`
> y solo envía el token resultante a nuestra API.

---

## Estructura del proyecto

```
frontend/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── .env.example
└── src/
    ├── main.tsx                  # Entry point — monta Provider + App
    ├── App.tsx                   # Enrutador por step (1→2→3→4)
    ├── index.css                 # Tailwind base + animaciones personalizadas
    │
    ├── types/
    │   └── index.ts              # Interfaces globales del dominio
    │
    ├── lib/
    │   ├── api.ts                # Axios client + función tokenizeCard()
    │   ├── card.ts               # Luhn, formato, detección de tipo
    │   └── card.spec.ts
    │
    ├── store/
    │   ├── index.ts              # configureStore + typed hooks
    │   └── slices/
    │       ├── checkoutSlice.ts  # Máquina de estados del flujo de compra
    │       ├── checkoutSlice.spec.ts
    │       └── productsSlice.ts  # Fetch de productos + stock
    │
    ├── components/
    │   ├── ui/
    │   │   └── Toaster.tsx       # Sistema de toasts (singleton imperativo)
    │   ├── product/
    │   │   ├── ProductCard.tsx
    │   │   ├── StockBadge.tsx
    │   │   └── StockBadge.spec.tsx
    │   └── checkout/
    │       ├── CreditCardForm.tsx    # Tarjeta visual con flip 3D al enfocar CVV
    │       ├── DeliveryForm.tsx      # Datos del cliente + 32 departamentos de Colombia
    │       └── BackdropSummary.tsx   # Bottom sheet con fondo borroso
    │
    └── views/                    # Un componente por step del checkout
        ├── ProductView.tsx       # Step 1 — catálogo con filtros por categoría
        ├── PaymentView.tsx       # Step 2 — tarjeta y datos de entrega (tabs)
        ├── SummaryView.tsx       # Step 3 — resumen y confirmación del pago
        └── ResultView.tsx        # Step 4 — resultado (aprobado / rechazado / error)
```

---

## Flujo de compra

El estado global en Redux controla en qué paso se encuentra el usuario. No hay rutas — `App.tsx` renderiza condicionalmente según `checkout.currentStep`.

```
Step 1 — ProductView
  El usuario selecciona un producto.
  → dispatch(selectProduct) → step 2

Step 2 — PaymentView
  El usuario ingresa datos de tarjeta y dirección.
  Validación local: Luhn + regex + campos requeridos.
  → dispatch(setPaymentInfo) → step 3

Step 3 — SummaryView
  Se muestra el desglose de costos (producto + cargo base + envío).
  Al confirmar:
    1. tokenizeCard() → gateway directo desde el navegador
    2. POST /api/transactions con el token + X-Idempotency-Key
  → dispatch(setTransactionResult) → step 4

Step 4 — ResultView
  Muestra el resultado del pago.
  Dispara refreshStock() para actualizar el inventario.
  → dispatch(resetFlow) → step 1
```

---

## Estado global (Redux)

### `checkoutSlice`

Gestiona todo el ciclo de vida de una compra.

| Propiedad | Tipo | Persiste en localStorage |
|---|---|---|
| `currentStep` | `1 \| 2 \| 3 \| 4` | ✅ |
| `selectedProduct` | `Product \| null` | ✅ |
| `customer` | `Customer \| null` | ✅ |
| `delivery` | `DeliveryInfo \| null` | ✅ |
| `card` | `CardInfo \| null` | ❌ solo en memoria |
| `summary` | `PaymentSummary \| null` | ✅ |
| `transaction` | `Transaction \| null` | ✅ (solo id + status) |

> Los datos de tarjeta se guardan en memoria para el flujo de pago y se eliminan
> del estado al recibir el resultado de la transacción (`setTransactionResult`).
> Nunca se escriben en `localStorage`.

### `productsSlice`

| Acción | Descripción |
|---|---|
| `fetchProducts` | Thunk — carga catálogo con stock desde `/api/products` |
| `refreshStock` | Thunk — actualiza stock de un producto desde `/api/stock/:id` |
| `updateStockLocally` | Reducer síncrono para actualizar el mapa de stock en UI |

---

## Decisiones de diseño

**Tokenización en el frontend.** Los datos de tarjeta nunca llegan al backend propio. El navegador llama directamente al gateway con la clave pública, recibe un token opaco, y solo ese token se envía a nuestra API. Esto reduce el alcance de PCI-DSS.

**Sin router.** Con 4 pasos lineales y sin URL compartible, el estado en Redux es suficiente. Añadir React Router agregaría complejidad sin beneficio para este flujo.

**Persistencia selectiva.** El slice serializa el estado de checkout en `localStorage` en cada cambio, excepto los datos de tarjeta. Si el usuario recarga en medio del flujo, recupera su posición sin tener que empezar desde cero.

**Validación con algoritmo de Luhn.** `validateLuhn()` en `src/lib/card.ts` valida el número de tarjeta en el cliente antes de intentar tokenizar, evitando llamadas innecesarias al gateway por números claramente inválidos.

---

## Paleta de colores y tipografía

| Token | Valor | Uso |
|---|---|---|
| `primary` | `#E07B39` | CTA, precios, acentos |
| `background` | `#FAFAF8` | Fondo general |
| `foreground` | `#1A1A18` | Texto principal |
| `muted` | `#F4F4F0` | Fondos secundarios, skeletons |
| `border` | `#E8E8E2` | Separadores, bordes de inputs |

| Fuente | Uso |
|---|---|
| Outfit (sans) | Texto general, labels, botones |
| Playfair Display (serif) | Títulos, precios |

Ambas fuentes se cargan desde Google Fonts en `index.html`.

---

## Tests

Cobertura objetivo: **≥ 80%** en branches, functions, lines y statements.

| Archivo | Qué cubre |
|---|---|
| `lib/card.spec.ts` | `detectCardType`, `formatCardNumber`, `validateLuhn`, `formatCurrency` |
| `components/product/StockBadge.spec.tsx` | Renderizado para quantity=0, ≤3 y >3 |
| `store/slices/checkoutSlice.spec.ts` | Todos los reducers: navegación, cálculo de summary, limpieza de tarjeta, reset |

```bash
# Ejecutar con reporte de cobertura
pnpm test:cov
```

---

## Build de producción

```bash
pnpm build
```

Genera la carpeta `dist/` con los assets compilados y optimizados.

```bash
# Preview local del build
pnpm preview
```

> Para producción configura `VITE_API_URL` apuntando al backend desplegado.
> En desarrollo el proxy de Vite maneja el CORS; en producción el backend
> debe tener configurado el header `Access-Control-Allow-Origin` correctamente.