import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ["dark"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			colors: {
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				background: "hsl(var(--background) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)"
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)"
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)"
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)"
				},
				base_color1: "white",
				base_color2: "black",
				light_emerald: "#0C8762",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)"
			},
			fontFamily: {
				sans: [...fontFamily.sans],
				quicksand: ['Quicksand', 'sans-serif'],
				manrope: ['Manrope', 'sans-serif'], 
			},
			animation: {
				snackbar: 'slideInUp 0.5s ease-out forwards',
				progress: 'progressBar 3s linear infinite',
				mobileBox: 'slideOutLeft .3s ease-in-out forwards'
			  },
			keyframes: {
				slideInUp: {
				  '0%': { transform: 'translateY(100%)', opacity: '0' },
				  '100%': { transform: 'translateY(0)', opacity: '1' },
				},
				progressBar: {
				  '0%': { width: '0%' },
				  '100%': { width: '100%' },
				},
				slideOutLeft: {
					'0%': { transform: 'translateX(0)', opacity: '1', width: '100%' },
					'100%': { transform: 'translateX(-100%)', opacity: '0', width: '0%' },
				}
			},
			backgroundImage: {
				'add-column-light': 'linear-gradient(rgb(233, 239, 250), rgba(233, 239, 250, 0.5))',
				'add-column-dark': 'linear-gradient(#2b2c37, #1b1c22)',
			}
		}
	},
}


export default config;