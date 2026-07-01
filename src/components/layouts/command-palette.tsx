import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import type { CurrentUser } from "@/stores/auth-store";
import type { UserRole } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCommandPalette } from "./command-palette-context";
import { commandPaletteItems } from "./nav-config";

function hasRole(user: CurrentUser | null, allowed: UserRole[] | undefined): boolean {
  if (!allowed) return true;
  if (!user) return false;
  return allowed.includes(user.role);
}

export function CommandPalette() {
  const open = useCommandPalette((s) => s.open);
  const setOpen = useCommandPalette((s) => s.setOpen);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

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
        {commandPaletteItems.map((group) => {
          if (!hasRole(user, group.roles)) return null;
          const visibleItems = group.items.filter((item) => hasRole(user, item.roles));
          if (visibleItems.length === 0) return null;
          return (
            <CommandGroup key={group.groupKey} heading={t(group.groupKey)}>
              {visibleItems.map((item) => {
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
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
