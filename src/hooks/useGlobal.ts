import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type MenuItem = {
  name: string;
  price: number;
};

export type GlobalConfigState = {
  showDrawer: boolean;
  setShowDrawer: (val: boolean) => void;
  selectedItem: MenuItem | null;
  setSelectedItem: (item: MenuItem | null) => void;
};

const useGlobal = create<GlobalConfigState>()(
  devtools(
    persist(
      (set) => ({
        showDrawer: false,
        setShowDrawer: (val) => set({ showDrawer: val }),
        selectedItem: null,
        setSelectedItem: (item) => set({ selectedItem: item }),
      }),
      {
        name: "ZEN - Global config",
      }
    ),
    { name: "ZEN - Global config" }
  )
);

export default useGlobal;
