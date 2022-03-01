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
				"max-lg": { max: "1024px" },
			},
			animation: {
				"animate-alt-spin": "spin 1s linear infinite reverse",
				"spin-slow": "spin 3s linear infinite",
			},
			height: {
				154: "38rem",
			},
			colors: {
				transparent: "transparent",
				current: "currentColor",
				red: "#ff7b5f",
				pink: "#D5A0FF",
				yellow: "#ffe5a3",
				purple: "#7D8AFF",
				"dark-yellow": "#ffd233",
				orange: "#ff7b5f",
				green: "#24CA49",
				"light-blue": "#dfeaef",
				grey: ["#f9f9fb", "#e6e7e8", "#c4c4c4"],
				white: "#ffffff",
				"lighter-gray": "#F2F3F7",
				"dark-gray": "#16161e",
				"light-gray": "#1e1e24",
				"sea-green": "#15FFAB",
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
