import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		fontFamily: {
			sans: ['Montserrat', 'sans-serif'],
			serif: ['PT Serif', 'serif']
		  },
		colors: {
			'primary': {
				'50': '#ecf0ff',
				'100': '#dce4ff',
				'200': '#c0ccff',
				'300': '#9aaaff',
				'400': '#727cff',
				'500': '#5251ff',
				'600': '#4432f9',
				'700': '#3926dc',
				'800': '#2f22b1',
				'900': '#2a248b',
				'950': '#181349',
			},
			'secondary': {
				'50': '#eff6ff',
				'100': '#dbe9fe',
				'200': '#bed9ff',
				'300': '#98c5fe',
				'400': '#5fa0fb',
				'500': '#397cf8',
				'600': '#235ced',
				'700': '#1b47da',
				'800': '#1d3bb0',
				'900': '#1d378b',
				'950': '#162355',
			},
			'accent': {
				'50': '#f8ffe5',
				'100': '#edffc8',
				'200': '#e1ffa9',
				'300': '#c0fb5b',
				'400': '#a6f229',
				'500': '#86d80a',
				'600': '#67ad03',
				'700': '#4e8308',
				'800': '#40670d',
				'900': '#365710',
				'950': '#1a3102',
			},
		  },
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
