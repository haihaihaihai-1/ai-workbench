import { DEFAULT_LOCALE, type Locale, i18n } from "@/i18n";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type LocaleStore = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
};

const applyLocale = (locale: Locale) => {
  if (i18n.isInitialized && i18n.language !== locale) {
    void i18n.changeLanguage(locale);
  }
};

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set, get) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => {
        applyLocale(locale);
        set({ locale });
      },
      toggle: () => {
        const next: Locale = get().locale === "zh" ? "en" : "zh";
        applyLocale(next);
        set({ locale: next });
      },
    }),
    {
      name: "ai-workbench-locale",
      onRehydrateStorage: () => (state) => {
        if (state?.locale) {
          applyLocale(state.locale);
        }
      },
    },
  ),
);
