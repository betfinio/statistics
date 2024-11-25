/** @type {import('tailwindcss').Config} */
module.exports = {
	presets: [require('@betfinio/components/tailwind-config')],
	darkMode: ['class'],
	important: '.statistics',
	content: ['./src/**/*.{ts,tsx}'],

	plugins: [require('tailwindcss-animate')],
};
