// import { create } from "zustand";

// type ShiftState = {
//   isShiftActive: boolean;
//   setShiftActive: (active: boolean) => void;
// };

// const storedShiftActive =
//   typeof window !== "undefined"
//     ? JSON.parse(localStorage.getItem("isShiftActive") || "true")
//     : true;

// export const useShiftStore = create<ShiftState>((set) => ({
//   isShiftActive: storedShiftActive,

//   setShiftActive: (active: boolean) => {
//     localStorage.setItem("isShiftActive", JSON.stringify(active));
//     set({ isShiftActive: active });
//   },
// }));

import { create } from "zustand";

interface ShiftData {
  isShiftActive: boolean; // true: shift closed (show OPEN), false: shift open (show CLOSE)
  startingCash: number;
  totalSales: number;
  totalPicked: number;
}

interface ShiftState extends ShiftData {
  openShift: (start: number) => void;
  addSale: (amt: number) => void;
  pickCash: (amt: number) => void;
  closeShift: () => void;
}

const LOCAL_KEY = "shiftData";

function readInitial(): ShiftData {
  if (typeof window === "undefined")
    return {
      isShiftActive: true,
      startingCash: 0,
      totalSales: 0,
      totalPicked: 0,
    };
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw)
    return {
      isShiftActive: true,
      startingCash: 0,
      totalSales: 0,
      totalPicked: 0,
    };
  return JSON.parse(raw);
}

export const useShiftStore = create<ShiftState>((set, get) => {
  const initial = readInitial();
  return {
    ...initial,
    openShift: (start) => {
      const next: ShiftData = {
        isShiftActive: false,
        startingCash: start,
        totalSales: 0,
        totalPicked: 0,
      };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      set(next);
    },
    addSale: (amt) => {
      const s = get();
      const next: ShiftData = { ...s, totalSales: s.totalSales + amt };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      set(next);
    },
    pickCash: (amt) => {
      const s = get();
      const next: ShiftData = { ...s, totalPicked: s.totalPicked + amt };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      set(next);
    },
    closeShift: () => {
      const reset: ShiftData = {
        isShiftActive: true,
        startingCash: 0,
        totalSales: 0,
        totalPicked: 0,
      };
      localStorage.removeItem(LOCAL_KEY);
      set(reset);
    },
  };
});
