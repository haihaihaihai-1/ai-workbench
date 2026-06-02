import { create } from "zustand";

type CommandPaletteStore = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
};

export const useCommandPalette = create<CommandPaletteStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
}));
