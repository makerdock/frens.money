const colors = require("tailwindcss/colors");

module.exports = {
	mode: "jit",
	purge: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			screens: {
				xs: { max: "425px" },
				sm: { max: "768px" },
				'max-lg': { max: "1024px" }
			},
			animation: {
				"animate-alt-spin": "spin 1s linear infinite reverse",
				"spin-slow": "spin 3s linear infinite",
			},
			height: {
				'154': '38rem',
			},
			colors: {
				transparent: "transparent",
				current: "currentColor",
				red: '#ff7b5f',
				pink: '#ffa3e0',
				yellow: '#ffe5a3',
				purple: '#7b61ff',
				'dark-yellow': '#ffd233',
				orange: '#ff7b5f',
				'dark-grey': '#231f20',
				'light-blue': '#dfeaef',
				'grey': ['#f9f9fb', '#e6e7e8', '#c4c4c4'],
				white: '#ffffff',

			},
		},
		fontFamily: {
			space: ["'Space Grotesk'"],
		},

	},
	variants: {
		extend: {},
	},
	plugins: [require("@tailwindcss/forms")],
};
