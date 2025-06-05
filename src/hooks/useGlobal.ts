import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type MenuItem = {
  id: number;
  name: string;
  menu: string;
  prices: {
    PT: number;
    RG: number;
    GR: number;
  };
};

export type GlobalConfigState = {
  updateMenuItem: (id: number, updatedItem: Partial<MenuItem>) => void;
  showDrawer: boolean;
  setShowDrawer: (val: boolean) => void;

  selectedItem: MenuItem | null;
  setSelectedItem: (item: MenuItem | null) => void;

  menus: string[];
  setMenus: (menus: string[]) => void;
  addMenu: (menu: string) => void;
  removeMenu: (menu: string) => void;
  updateMenu: (oldMenu: string, newMenu: string) => void;

  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  addMenuItem: (item: MenuItem) => void;
  removeMenuItem: (id: number) => void;
  removeMenuItemsByMenu: (menuName: string) => void;
  updateMenuItemsByMenu: (oldMenu: string, newMenu: string) => void;
};

const useGlobal = create<GlobalConfigState>()(
  devtools(
    persist(
      (set) => ({
        // Update a single menu item by id
        updateMenuItem: (id: number, updatedItem: Partial<MenuItem>) =>
          set((state) => ({
            menuItems: state.menuItems.map((item) =>
              item.id === id ? { ...item, ...updatedItem } : item
            ),
          })),

        showDrawer: false,
        setShowDrawer: (val: boolean) => set({ showDrawer: val }),

        selectedItem: null,
        setSelectedItem: (item: MenuItem | null) => set({ selectedItem: item }),

        menus: [],
        setMenus: (menus: string[]) => set({ menus }),
        addMenu: (menu: string) =>
          set((state) => ({ menus: [...state.menus, menu] })),
        removeMenu: (menu: string) =>
          set((state) => ({
            menus: state.menus.filter((m) => m !== menu),
          })),
        updateMenu: (oldMenu: string, newMenu: string) =>
          set((state) => ({
            menus: state.menus.map((menu) =>
              menu === oldMenu ? newMenu : menu
            ),
          })),

        menuItems: [],
        setMenuItems: (items: MenuItem[]) => {
          set({ menuItems: items });
        },
        addMenuItem: (item: MenuItem) =>
          set((state) => ({ menuItems: [...state.menuItems, item] })),
        removeMenuItem: (id: number) =>
          set((state) => ({
            menuItems: state.menuItems.filter((item) => item.id !== id),
          })),
        removeMenuItemsByMenu: (menuName: string) =>
          set((state) => ({
            menuItems: state.menuItems.filter((item) => item.menu !== menuName),
          })),
        updateMenuItemsByMenu: (oldMenu: string, newMenu: string) =>
          set((state) => ({
            menuItems: state.menuItems.map((item) =>
              item.menu === oldMenu ? { ...item, menu: newMenu } : item
            ),
          })),
      }),
      {
        name: "ZEN-Global-Config",
      }
    )
  )
);

export default useGlobal;
