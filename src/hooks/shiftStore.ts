import { create } from "zustand";

type ShiftState = {
  isShiftActive: boolean;
  setShiftActive: (active: boolean) => void;
};

const storedShiftActive =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("isShiftActive") || "true")
    : true;

export const useShiftStore = create<ShiftState>((set) => ({
  isShiftActive: storedShiftActive,

  setShiftActive: (active: boolean) => {
    localStorage.setItem("isShiftActive", JSON.stringify(active));
    set({ isShiftActive: active });
  },
}));


