import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zh from "./locales/zh.json";

export const SUPPORTED_LOCALES = ["zh", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh";
export const FALLBACK_LOCALE: Locale = "zh";

export const RESOURCES = {
  zh: { translation: zh },
  en: { translation: en },
} as const;

export type Resources = typeof RESOURCES;

void i18n.use(initReactI18next).init({
  resources: RESOURCES,
  lng: DEFAULT_LOCALE,
  fallbackLng: FALLBACK_LOCALE,
  defaultNS: "translation",
  ns: ["translation"],
  interpolation: { escapeValue: false },
  returnNull: false,
  debug: false,
  react: { useSuspense: false },
});

export { i18n };
export default i18n;
