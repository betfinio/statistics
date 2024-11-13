/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	important: '.template',
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
