import { create } from "zustand";

type ShiftState = {
  // When true, the navbar is disabled (manager login / pre-shift)
  isShiftActive: boolean;
  setShiftActive: (active: boolean) => void;
};

export const useShiftStore = create<ShiftState>((set) => ({
  // By default, assume you’re in shift/login mode (navbar disabled)
  isShiftActive: true,
  setShiftActive: (active: boolean) => set({ isShiftActive: active }),
}));
