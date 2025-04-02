import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type MenuItem = {
  id: string;
  name: string;
  menu: string;
  prices: {
    PT: number;
    RG: number;
    GR: number;
  };
};

export type GlobalConfigState = {
  updateMenuItem: (id: string, updatedItem: Partial<MenuItem>) => void;
  showDrawer: boolean;
  setShowDrawer: (val: boolean) => void;

  selectedItem: MenuItem | null;
  setSelectedItem: (item: MenuItem | null) => void;

  menus: string[];
  addMenu: (menu: string) => void;
  removeMenu: (menu: string) => void;
  updateMenu: (oldMenu: string, newMenu: string) => void;

  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  removeMenuItem: (id: string) => void;
  removeMenuItemsByMenu: (menuName: string) => void;
  updateMenuItemsByMenu: (oldMenu: string, newMenu: string) => void;
};

const useGlobal = create<GlobalConfigState>()(
  devtools(
    persist(
      (set) => ({
        // New function to update a single menu item by id
        updateMenuItem: (id: string, updatedItem: Partial<MenuItem>) =>
          set((state) => ({
            menuItems: state.menuItems.map((item) =>
              item.id === id ? { ...item, ...updatedItem } : item
            ),
          })),

        showDrawer: false,
        setShowDrawer: (val) => set({ showDrawer: val }),

        selectedItem: null,
        setSelectedItem: (item) => set({ selectedItem: item }),

        menus: [],
        addMenu: (menu) => set((state) => ({ menus: [...state.menus, menu] })),
        removeMenu: (menu) =>
          set((state) => ({
            menus: state.menus.filter((m) => m !== menu),
          })),
        updateMenu: (oldMenu, newMenu) =>
          set((state) => ({
            menus: state.menus.map((menu) =>
              menu === oldMenu ? newMenu : menu
            ),
          })),

        menuItems: [],
        addMenuItem: (item) =>
          set((state) => ({ menuItems: [...state.menuItems, item] })),
        removeMenuItem: (id: string) =>
          set((state) => ({
            menuItems: state.menuItems.filter((item) => item.id !== id),
          })),
        removeMenuItemsByMenu: (menuName: string) =>
          set((state) => ({
            menuItems: state.menuItems.filter((item) => item.menu !== menuName),
          })),
        updateMenuItemsByMenu: (oldMenu, newMenu) =>
          set((state) => ({
            menuItems: state.menuItems.map((item) =>
              item.menu === oldMenu ? { ...item, menu: newMenu } : item
            ),
          })),
      }),
      {
        name: "ZEN - Global config",
      }
    )
  )
);

export default useGlobal;
