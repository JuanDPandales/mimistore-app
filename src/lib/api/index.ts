import axios from 'axios'

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 15_000,
})

apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        const message =
            error?.response?.data?.message ?? error.message ?? 'Network error'
        return Promise.reject(new Error(message))
    },
)

const GATEWAY_PUB_KEY = import.meta.env.VITE_GATEWAY_PUB_KEY ?? ''
const GATEWAY_BASE_URL = import.meta.env.VITE_GATEWAY_BASE_URL ?? ''

export interface TokenizeCardPayload {
    number: string
    exp_month: string
    exp_year: string
    cvc: string
    card_holder: string
}

export interface CardToken {
    id: string
    created_at: string
    brand: string
    name: string
    last_four: string
    exp_year: string
    exp_month: string
    card_holder: string
    status: string
}

export async function tokenizeCard(payload: TokenizeCardPayload): Promise<CardToken> {
    const { data } = await axios.post(
        `${GATEWAY_BASE_URL}/tokens/cards`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${GATEWAY_PUB_KEY}`,
                'Content-Type': 'application/json',
            },
        },
    )
    return data.data
}

export async function getAcceptanceToken(): Promise<string> {
    const { data } = await axios.get(
        `${GATEWAY_BASE_URL}/merchants/${GATEWAY_PUB_KEY}`,
    )
    return data.data.presigned_acceptance.acceptance_token
}