import { create } from "zustand";

interface ShiftData {
  isShiftActive: boolean; // true: shift closed (show OPEN), false: shift open (show CLOSE)
  startingCash: number;
  totalSales: number;
  totalPicked: number;
  voidRefund: number;
}

interface ShiftState extends ShiftData {
  openShift: (start: number) => void;
  addSale: (amt: number) => void;
  pickCash: (amt: number) => void;
  recordVoidRefund: (amount: number) => void;
  closeShift: () => void;
}

const LOCAL_KEY = "shiftData";

function readInitial(): ShiftData {
  if (typeof window === "undefined") {
    return {
      isShiftActive: true,
      startingCash: 0,
      totalSales: 0,
      totalPicked: 0,
      voidRefund: 0,
    };
  }
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw) {
    return {
      isShiftActive: true,
      startingCash: 0,
      totalSales: 0,
      totalPicked: 0,
      voidRefund: 0,
    };
  }
  return JSON.parse(raw) as ShiftData;
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
        voidRefund: 0, // reset refund on new shift
      };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      set(next);
    },

    addSale: (amt) => {
      const s = get();
      const next: ShiftData = {
        ...s,
        totalSales: s.totalSales + amt,
      };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      set(next);
    },

    pickCash: (amt) => {
      const s = get();
      const next: ShiftData = {
        ...s,
        totalPicked: s.totalPicked + amt,
      };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      set(next);
    },

    recordVoidRefund: (amount) => {
      const s = get();
      const next: ShiftData = {
        ...s,
        voidRefund: s.voidRefund + amount,
      };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      set(next);
    },

    closeShift: () => {
      const reset: ShiftData = {
        isShiftActive: true,
        startingCash: 0,
        totalSales: 0,
        totalPicked: 0,
        voidRefund: 0,
      };
      localStorage.removeItem(LOCAL_KEY);
      set(reset);
    },
  };
});

// import { create } from "zustand";

// interface ShiftData {
//   isShiftOpen: boolean; // Renamed for clarity - true means shift is OPEN
//   startingCash: number;
//   totalSales: number;
//   totalPicked: number;
//   voidRefund: number;
// }

// interface ShiftState extends ShiftData {
//   openShift: (start: number) => void;
//   addSale: (amt: number) => void;
//   pickCash: (amt: number) => void;
//   recordVoidRefund: (amount: number) => void;
//   closeShift: () => void;
// }

// const LOCAL_KEY = "shiftData";

// function readInitial(): ShiftData {
//   if (typeof window === "undefined") {
//     return {
//       isShiftOpen: false, // Default to shift being closed
//       startingCash: 0,
//       totalSales: 0,
//       totalPicked: 0,
//       voidRefund: 0,
//     };
//   }
//   const raw = localStorage.getItem(LOCAL_KEY);
//   if (!raw) {
//     return {
//       isShiftOpen: false, // Default to shift being closed
//       startingCash: 0,
//       totalSales: 0,
//       totalPicked: 0,
//       voidRefund: 0,
//     };
//   }
//   return JSON.parse(raw) as ShiftData;
// }

// export const useShiftStore = create<ShiftState>((set, get) => {
//   const initial = readInitial();

//   return {
//     ...initial,

//     openShift: (start) => {
//       const next: ShiftData = {
//         isShiftOpen: true, // Now true means shift is open
//         startingCash: start,
//         totalSales: 0,
//         totalPicked: 0,
//         voidRefund: 0,
//       };
//       localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
//       set(next);
//     },

//     addSale: (amt) => {
//       const s = get();
//       const next: ShiftData = {
//         ...s,
//         totalSales: s.totalSales + amt,
//       };
//       localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
//       set(next);
//     },

//     pickCash: (amt) => {
//       const s = get();
//       const next: ShiftData = {
//         ...s,
//         totalPicked: s.totalPicked + amt,
//       };
//       localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
//       set(next);
//     },

//     recordVoidRefund: (amount) => {
//       const s = get();
//       const next: ShiftData = {
//         ...s,
//         voidRefund: s.voidRefund + amount,
//       };
//       localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
//       set(next);
//     },

//     closeShift: () => {
//       const reset: ShiftData = {
//         isShiftOpen: false, // Now false means shift is closed
//         startingCash: 0,
//         totalSales: 0,
//         totalPicked: 0,
//         voidRefund: 0,
//       };
//       localStorage.removeItem(LOCAL_KEY);
//       set(reset);
//     },
//   };
// });
