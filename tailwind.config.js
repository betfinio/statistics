/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	important: '.statistics',
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
