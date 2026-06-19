import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // === 基础语义色（来自 CSS 变量） ===
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          border: "hsl(var(--sidebar-border))",
        },

        // === 借皮 · Linear 品牌色阶（brand-*） ===
        brand: {
          50:  "hsl(var(--brand-50))",
          100: "hsl(var(--brand-100))",
          200: "hsl(var(--brand-200))",
          300: "hsl(var(--brand-300))",
          400: "hsl(var(--brand-400))",
          500: "hsl(var(--brand-500))",
          600: "hsl(var(--brand-600))",
          700: "hsl(var(--brand-700))",
          800: "hsl(var(--brand-800))",
          900: "hsl(var(--brand-900))",
          950: "hsl(var(--brand-950))",
        },

        // === 借皮 · Grafana/Linear 中性色阶（neutral-*） ===
        neutral: {
          0:    "hsl(var(--neutral-0))",
          50:   "hsl(var(--neutral-50))",
          100:  "hsl(var(--neutral-100))",
          200:  "hsl(var(--neutral-200))",
          300:  "hsl(var(--neutral-300))",
          400:  "hsl(var(--neutral-400))",
          500:  "hsl(var(--neutral-500))",
          600:  "hsl(var(--neutral-600))",
          700:  "hsl(var(--neutral-700))",
          800:  "hsl(var(--neutral-800))",
          850:  "hsl(var(--neutral-850))",
          900:  "hsl(var(--neutral-900))",
          950:  "hsl(var(--neutral-950))",
          1000: "hsl(var(--neutral-1000))",
        },

        // === 借皮 · 各家招牌语义色（color-*） ===
        "color-red":     "hsl(var(--color-red-500))",
        "color-orange":  "hsl(var(--color-orange-500))",
        "color-amber":   "hsl(var(--color-amber-500))",
        "color-yellow":  "hsl(var(--color-yellow-500))",
        "color-green":   "hsl(var(--color-green-500))",
        "color-emerald": "hsl(var(--color-emerald-500))",
        "color-teal":    "hsl(var(--color-teal-500))",
        "color-cyan":    "hsl(var(--color-cyan-500))",
        "color-sky":     "hsl(var(--color-sky-500))",
        "color-blue":    "hsl(var(--color-blue-500))",
        "color-indigo":  "hsl(var(--color-indigo-500))",
        "color-violet":  "hsl(var(--color-violet-500))",
        "color-purple":  "hsl(var(--color-purple-500))",
        "color-pink":    "hsl(var(--color-pink-500))",
        "color-rose":    "hsl(var(--color-rose-500))",
      },
      borderRadius: {
        none: "0",
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        notion: "var(--shadow-notion)",
        vercel: "var(--shadow-vercel)",
        linear: "var(--shadow-linear)",
        grafana: "var(--shadow-grafana)",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
        ],
        display: [
          "var(--font-display)",
        ],
        mono: [
          "var(--font-mono)",
        ],
        serif: [
          "var(--font-serif)",
        ],
      },
      transitionTimingFunction: {
        "linear-app": "var(--ease-linear-app)",
        spring: "var(--ease-spring)",
        apple: "var(--ease-apple)",
        vercel: "var(--ease-vercel)",
        chatgpt: "var(--ease-chatgpt)",
      },
      transitionDuration: {
        instant: "50ms",
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
        slower: "500ms",
        vercel: "600ms",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".3" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fade-in var(--duration-base) var(--ease-out) both",
        "slide-up": "slide-up var(--duration-slow) var(--ease-spring) both",
        "scale-in": "scale-in var(--duration-base) var(--ease-spring) both",
      },
    },
  },
  plugins: [animate],
};
