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
  type: OrderTypeEnum;
  items: { title: string; price: number; quantity: number }[];
  confirmedAt: number;
}

type OrderTypeEnum = "dine_in" | "take_out";

interface OrderStore {
  selectedProducts: EspressoItem[];
  addProduct: (item: EspressoItem) => void;
  clearProducts: () => void;
  removeProduct: (index: number) => void;
  ordersQueue: OrderQueueItem[];
  nextOrderNumber: number;
  addOrderToQueue: (
    confirmedAt: number,
    type: "dine_in" | "take_out"
  ) => number;
  bumpOrder: () => void;
  orderType: OrderTypeEnum;
  setOrderType: (type: OrderTypeEnum) => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orderType: "dine_in",
  setOrderType: (type) => {
    set({ orderType: type });
  },

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

  addOrderToQueue: (confirmedAt, type) => {
    const current = get().selectedProducts;
    const items = current.map((it) => ({
      title: it.imageTitle,
      price: it.price[it.size],
      quantity: it.quantity || 1,
    }));

    const orderId = get().nextOrderNumber;

    set((state) => ({
      ordersQueue: [
        ...state.ordersQueue,
        { id: orderId, type, items, confirmedAt },
      ],
      nextOrderNumber: orderId + 1,
    }));

    return orderId;
  },

  bumpOrder: () => {
    set((state) => {
      const orderToBump = state.ordersQueue[0];
      if (orderToBump) {
        return {
          ordersQueue: state.ordersQueue.slice(1),
        };
      }

      return state;
    });
  },
}));
