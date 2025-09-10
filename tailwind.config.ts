import { Config } from 'tailwindcss';

export default {
    content: ['./src/**/*.{vue,js,ts,jsx,tsx}', './docs/**/*.{vue,js,ts,jsx,tsx,md}'],
    theme: {
        extend: {
            colors: {
                'am-dark': '#1b1b1f',
            },
        },
    },
    plugins: [],
} as Config;
