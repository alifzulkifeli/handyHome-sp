const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = ({
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	darkMode: ['class', 'class'],
	plugins: [require('tailwindcss-safe-area'), require("tailwindcss-animate")],
    theme: {
    	extend: {
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {}
    	}
    }
})
