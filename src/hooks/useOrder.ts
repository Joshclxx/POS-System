import { create } from "zustand";

interface EspressoItem {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string;
  price: { PT: number; RG: number; GR: number };
  size: "PT" | "RG" | "GR";
  quantity?: number;
}

interface OrderQueueItem {
  id: number;
  items: string[];
  confirmedAt: number;
}

interface OrderStore {
  selectedProducts: EspressoItem[];
  addProduct: (item: EspressoItem) => void;
  clearProducts: () => void;
  removeProduct: (index: number) => void;
  ordersQueue: OrderQueueItem[];
  nextOrderNumber: number;
  addOrderToQueue: (confirmedAt: number) => void;
  bumpOrder: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  selectedProducts: [],
  addProduct: (item) => {
    const items = get().selectedProducts;
    const idx = items.findIndex(
      (i) => i.imageTitle === item.imageTitle && i.size === item.size
    );

    if (idx >= 0) {
      const updated = [...items];
      const existing = updated[idx];
      updated[idx] = {
        ...existing,
        quantity: (existing.quantity || 1) + 1,
      };
      set({ selectedProducts: updated });
    } else {
      set({ selectedProducts: [...items, { ...item, quantity: 1 }] });
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
    const current = get().selectedProducts;
    const items = current.map((it) => `${it.imageTitle} (${it.size})`);
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
