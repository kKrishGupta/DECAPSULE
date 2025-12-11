module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(220, 12%, 18%)",
        input: "hsl(220, 12%, 18%)",
        ring: "hsl(188, 90%, 60%)",
        background: "hsl(220, 17%, 10%)",
        foreground: "hsl(0, 0%, 95%)",
        primary: {
          DEFAULT: "hsl(188, 90%, 60%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        secondary: {
          DEFAULT: "hsl(188, 75%, 45%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        tertiary: {
          DEFAULT: "hsl(308, 75%, 60%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 75%, 58%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        muted: {
          DEFAULT: "hsl(220, 10%, 25%)",
          foreground: "hsl(220, 10%, 60%)",
        },
        accent: {
          DEFAULT: "hsl(308, 75%, 60%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        popover: {
          DEFAULT: "hsl(220, 16%, 15%)",
          foreground: "hsl(0, 0%, 95%)",
        },
        card: {
          DEFAULT: "hsl(220, 16%, 15%)",
          foreground: "hsl(0, 0%, 95%)",
        },
        success: "hsl(163, 70%, 45%)",
        warning: "hsl(43, 90%, 55%)",
        error: "hsl(0, 75%, 58%)",
        gray: {
          50: "hsl(220, 10%, 95%)",
          100: "hsl(220, 10%, 90%)",
          200: "hsl(220, 10%, 80%)",
          300: "hsl(220, 10%, 60%)",
          400: "hsl(220, 10%, 45%)",
          500: "hsl(220, 10%, 35%)",
          600: "hsl(220, 10%, 25%)",
          700: "hsl(220, 12%, 20%)",
          800: "hsl(220, 16%, 15%)",
          900: "hsl(220, 17%, 10%)",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        tech: ["Geist", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      spacing: {
        '4': '1rem',
        '8': '2rem',
        '12': '3rem',
        '16': '4rem',
        '24': '6rem',
        '32': '8rem',
        '48': '12rem',
        '64': '16rem',
      },
      backgroundImage: {
        'gradient-1': 'linear-gradient(135deg, hsl(188, 90%, 60%) 0%, hsl(308, 75%, 60%) 100%)',
        'gradient-2': 'linear-gradient(180deg, hsl(220, 20%, 18%) 0%, hsl(220, 17%, 10%) 100%)',
        'button-border-gradient': 'linear-gradient(90deg, hsla(188, 90%, 60%, 0.5), hsla(308, 75%, 60%, 0.5))',
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "slide-in": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 1.2s ease-in-out infinite",
        "slide-in": "slide-in 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
}
