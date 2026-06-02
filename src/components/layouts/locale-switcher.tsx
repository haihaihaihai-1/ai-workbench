import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Locale } from "@/i18n";
import { cn } from "@/lib/utils";
import { useLocaleStore } from "@/stores/locale-store";
import { Check, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type LocaleOption = {
  value: Locale;
  labelKey: "locale.zh" | "locale.en";
  flag: string;
};

const OPTIONS: LocaleOption[] = [
  { value: "zh", labelKey: "locale.zh", flag: "🇨🇳" },
  { value: "en", labelKey: "locale.en", flag: "🇺🇸" },
];

export function LocaleSwitcher() {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const active = OPTIONS.find((o) => o.value === locale) ?? OPTIONS[0];

  const handleSelect = (next: Locale) => {
    if (next === locale) return;
    setLocale(next);
    const label = t(next === "zh" ? "locale.zh" : "locale.en");
    toast.success(t("locale.changed", { lang: label }));
  };

  return (
    <Popover>
      <PopoverTrigger
        aria-label={t("locale.switch")}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium",
          "transition-all hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        )}
      >
        <Languages className="h-4 w-4" />
        <span className="text-base leading-none">{active.flag}</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-2">
        <div className="px-2 pb-2 pt-1 text-xs font-medium text-muted-foreground">
          {t("locale.switch")}
        </div>
        <div className="flex flex-col gap-1" role="radiogroup" aria-label={t("locale.switch")}>
          {OPTIONS.map((opt) => {
            const checked = opt.value === locale;
            return (
              <label
                key={opt.value}
                className={cn(
                  "group flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring",
                  checked && "bg-accent/60",
                )}
              >
                <input
                  type="radio"
                  name="locale"
                  value={opt.value}
                  checked={checked}
                  onChange={() => handleSelect(opt.value)}
                  className="sr-only"
                />
                <span className="text-base leading-none">{opt.flag}</span>
                <span className="flex-1 font-medium">{t(opt.labelKey)}</span>
                {checked && <Check className="h-4 w-4 shrink-0 text-primary" />}
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
