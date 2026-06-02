import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCommandPalette } from "./command-palette-context";
import { commandPaletteItems } from "./nav-config";

export function CommandPalette() {
  const open = useCommandPalette((s) => s.open);
  const setOpen = useCommandPalette((s) => s.setOpen);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ⌘K / Ctrl+K 快捷键
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t("command.placeholder")} />
      <CommandList>
        <CommandEmpty>{t("command.empty")}</CommandEmpty>
        {commandPaletteItems.map((group) => (
          <CommandGroup key={group.groupKey} heading={t(group.groupKey)}>
            {group.items.map((item) => {
              const Icon = item.icon;
              const title = t(item.titleKey);
              return (
                <CommandItem
                  key={item.id}
                  value={`${title} ${item.url}`}
                  onSelect={() => {
                    navigate(item.url);
                    setOpen(false);
                  }}
                >
                  <Icon className="text-muted-foreground" />
                  <span>{title}</span>
                  {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
