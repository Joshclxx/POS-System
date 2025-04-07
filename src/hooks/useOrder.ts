import { create } from "zustand";

interface EspressoItem {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string;
  price: {
    PT: number;
    RG: number;
    GR: number;
  };
  size: "PT" | "RG" | "GR";
  quantity?: number;
}

interface OrderStore {
  [x: string]: any;
  selectedProducts: EspressoItem[];
  addProduct: (item: EspressoItem) => void;
  clearProducts: () => void;
  removeProduct: (index: number) => void;

  // OREDER QUEUE MANAGEMENT
  ordersQueue: { id: number; items: string[]; confirmedAt: number }[];
  nextOrderNumber: number;
  addOrderToQueue: (confirmedAt: number) => void; // ACCEPT TIME STAMP
  bumpOrder: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  selectedProducts: [],
  addProduct: (item) => {
    const currentItems = get().selectedProducts;
    const index = currentItems.findIndex(
      (i) => i.imageTitle === item.imageTitle && i.size === item.size
    );

    if (index !== -1) {
      const updatedItems = [...currentItems];
      const existingItem = updatedItems[index];
      updatedItems[index] = {
        ...existingItem,
        quantity: (existingItem.quantity || 1) + 1,
      };
      set({ selectedProducts: updatedItems });
    } else {
      set({
        selectedProducts: [...currentItems, { ...item, quantity: 1 }],
      });
    }
  },
  clearProducts: () => set({ selectedProducts: [] }),

  removeProduct: (index) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.filter((_, i) => i !== index),
    })),

  ordersQueue: [],
  nextOrderNumber: 30000,
  addOrderToQueue: (confirmedAt) => {
    console.log("confirmedAt:", confirmedAt);
    const currentOrder = get().selectedProducts;
    const items = currentOrder.map(
      (item) => `${item.imageTitle} (${item.size})`
    );

    const next = get().nextOrderNumber + 1;
    set((state) => ({
      ordersQueue: [...state.ordersQueue, { id: next, items, confirmedAt }],
      nextOrderNumber: next,
    }));
  },
  bumpOrder: () =>
    set((state) => ({
      ordersQueue: state.ordersQueue.slice(1),
    })),
}));
