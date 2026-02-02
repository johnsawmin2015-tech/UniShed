/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
            },
            colors: {
                // Year 1: Sand Gold (Foundation) - Warm, welcoming, solid
                sand: {
                    50: '#f9f6f1',
                    100: '#f0e8db',
                    200: '#e0d0b2',
                    300: '#cfb586',
                    400: '#bf9b5f',
                    500: '#a68244', // Main Brand Gold
                    600: '#8c6b36',
                    700: '#73552d',
                    800: '#5e4528',
                    900: '#4d3923',
                    950: '#2b1f12',
                },
                // Year 2: Muted Bronze (History/Gravity) - Earthy, established
                bronze: {
                    50: '#faf7f5',
                    100: '#f0e8e1',
                    200: '#e0c9b7',
                    300: '#cdaa8e',
                    400: '#b48a6b',
                    500: '#966d4f', // Main Bronze
                    600: '#7a553b',
                    700: '#634430',
                    800: '#4f382a',
                    900: '#423026',
                    950: '#231913',
                },
                // Year 3: Warm Platinum (Precision/Science) - Sophisticated, cool but warm
                platinum: {
                    50: '#f7f7f8',
                    100: '#ececee',
                    200: '#d7d7dc',
                    300: '#b9b9c1',
                    400: '#9898a3',
                    500: '#7b7b87', // Main Platinum
                    600: '#64646f',
                    700: '#53535b',
                    800: '#46464d',
                    900: '#3d3d41',
                    950: '#262629',
                },
                // Year 4: Deep Champagne (Achievement) - Rich, celebrational, deeper gold
                champagne: {
                    50: '#fbf8f3',
                    100: '#f5ecd9',
                    200: '#ebdaa9',
                    300: '#dec275',
                    400: '#d1a74d',
                    500: '#b88d35', // Main Champagne
                    600: '#997029',
                    700: '#7d5624',
                    800: '#694625',
                    900: '#583b23',
                    950: '#322010',
                },
                // Year 5: Royal Antique Gold (Masters/Elite) - Aged, brassy, prestigious
                royal: {
                    50: '#fbf6f1',
                    100: '#f5e8d6',
                    200: '#ebd1ac',
                    300: '#dfb77f',
                    400: '#d19d55',
                    500: '#b58136', // Main Royal
                    600: '#99672b',
                    700: '#7d5025',
                    800: '#694223',
                    900: '#563820',
                    950: '#301d10',
                },

                // Base Neutrals - Light Mode
                ivory: {
                    50: '#ffffff', // Pure White surface
                    100: '#fafaf9', // Subtle warmth
                    200: '#e7e5e4', // Stone-200
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917',
                    950: '#0c0a09',
                },

                // Base Neutrals - Dark Mode
                graphite: {
                    50: '#f7f7f7',
                    100: '#ebebeb',
                    200: '#d4d4d4',
                    300: '#a3a3a3',
                    400: '#737373',
                    500: '#525252',
                    600: '#404040',
                    700: '#262626',
                    800: '#171717',
                    900: '#0a0a0a', // True Dark
                    950: '#050505', // Deepest Obsidian
                },
            },
            boxShadow: {
                // Soft, airy shadows (Light Mode)
                'luxury': '0 4px 24px -2px rgba(166, 130, 68, 0.08)',
                'luxury-lg': '0 8px 40px -4px rgba(166, 130, 68, 0.12)',
                // Etched Glows (Dark Mode/Accents)
                'glow-gold': '0 0 15px rgba(212, 166, 102, 0.2)',
                'glow-gold-lg': '0 0 35px rgba(212, 166, 102, 0.3)',
                'glow-bronze': '0 0 15px rgba(150, 109, 79, 0.2)',
                'glow-platinum': '0 0 15px rgba(123, 123, 135, 0.2)',
            },
            backgroundImage: {
                'gradient-sand': 'linear-gradient(135deg, #cfb586 0%, #a68244 100%)',
                'gradient-bronze': 'linear-gradient(135deg, #cdaa8e 0%, #966d4f 100%)',
                'gradient-platinum': 'linear-gradient(135deg, #b9b9c1 0%, #7b7b87 100%)',
                'gradient-champagne': 'linear-gradient(135deg, #d1a74d 0%, #b88d35 100%)',
                'gradient-royal': 'linear-gradient(135deg, #d19d55 0%, #99672b 100%)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'slide-down': 'slideDown 0.4s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(212, 166, 102, 0.3)' },
                    '50%': { boxShadow: '0 0 30px rgba(212, 166, 102, 0.5)' },
                },
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
        },
    },
    plugins: [],
}
