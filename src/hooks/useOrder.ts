import { create } from "zustand";
interface EspressoItem {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string; //namesource
  price: { PT: number; RG: number; GR: number };
  size: "PT" | "RG" | "GR";
  quantity?: number;
}

interface OrderQueueItem {
  id: number;
  type: OrderTypeEnum;
  items: { title: string; price: number; quantity: number }[]; // Updated structure for items
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
  orderType: "dine_in", // ✅ Add this default value to the initial state
  setOrderType: (type) => {
    set({ orderType: type }); // ✅ This now works because it's defined above
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
  // addOrderToQueue: (confirmedAt) => {
  //   const current = get().selectedProducts;
  //   const items = current.map((it) => `${it.imageTitle} (${it.size})`);
  //   const next = get().nextOrderNumber + 1;
  //   set((state) => ({
  //     ordersQueue: [...state.ordersQueue, { id: next, items, confirmedAt }],
  //     nextOrderNumber: next,
  //   }));
  // },
  addOrderToQueue: (confirmedAt, type) => {
    const current = get().selectedProducts;
    const items = current.map((it) => ({
      title: it.imageTitle,
      price: it.price[it.size],
      quantity: it.quantity || 1,
    }));

    const orderId = get().nextOrderNumber; // use current value

    set((state) => ({
      ordersQueue: [
        ...state.ordersQueue,
        { id: orderId, type, items, confirmedAt },
      ],
      nextOrderNumber: orderId + 1,
    }));

    // Add to the order history as well

    return orderId; // ✅ return the id used
  },

  bumpOrder: () => {
    set((state) => {
      const orderToBump = state.ordersQueue[0]; // Get the first order in the queue
      if (orderToBump) {
        // Move the order to VoidOrder with "Completed" status
        // useHistoryStore
        //   .getState()
        //   .updateOrderStatus(orderToBump.id, "Completed");

        // Save the order to orderHistory
        // useHistoryStore.getState().addOrder({
        //   OrderId: orderToBump.id,
        //   Status: "Completed",
        //   items: orderToBump.items,
        //   Total: orderToBump.items.reduce(
        //     (acc, item) => acc + item.price * item.quantity,
        //     0
        //   ), // Assuming Total calculation
        //   Date: new Date(),
        // });

        // Remove the order from ordersQueue
        return {
          ordersQueue: state.ordersQueue.slice(1),
        };
      }

      return state;
    });
  },

  
}));
