/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#E07B39',
                    50: '#FDF3EC', 100: '#FAE3CF', 200: '#F5C49F',
                    300: '#EFA470', 400: '#E07B39', 500: '#C4621E',
                    600: '#9D4D18',
                    foreground: '#FFFFFF',
                },
                background: '#FAFAF8',
                foreground: '#1A1A18',
                muted: { DEFAULT: '#F4F4F0', foreground: '#78786E' },
                card: { DEFAULT: '#FFFFFF', foreground: '#1A1A18' },
                border: '#E8E8E2',
            },
            fontFamily: {
                sans: ['Outfit', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
        },
    },
    plugins: [],
}