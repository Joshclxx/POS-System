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
  selectedProducts: EspressoItem[];
  addProduct: (item: EspressoItem) => void;
  clearProducts: () => void;
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
}));
