/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "../common/src/**/*.{ts,tsx,js,jsx}",
  ],
  plugins: ["tailwindcss-animate"],
    theme: {
    	extend: {
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {},
        backgroundImage: {
          brandgradient: 'linear-gradient(131deg, #FEFAF5 15.01%, #FFFAFF 50.04%, #FAFBFF 85.06%)',
        },
    	}
    }
}
