import { create } from "zustand";
import { useHistoryStore

 } from "./useOrderHistory";
interface EspressoItem {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string; //namesource
  price: { PT: number; RG: number; GR: number };
  size: "PT" | "RG" | "GR";
  quantity?: number;
}

interface OrderQueueItem {
  // id: number;
  // items: string[];
  // confirmedAt: number;
  id: number;
  items: { title: string; price: number; quantity: number; }[];  // Updated structure for items
  confirmedAt: number;
}

interface OrderStore {
  selectedProducts: EspressoItem[];
  addProduct: (item: EspressoItem) => void;
  clearProducts: () => void;
  removeProduct: (index: number) => void;
  ordersQueue: OrderQueueItem[];
  nextOrderNumber: number;
  addOrderToQueue: (confirmedAt: number) => number;
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
  // addOrderToQueue: (confirmedAt) => {
  //   const current = get().selectedProducts;
  //   const items = current.map((it) => `${it.imageTitle} (${it.size})`);
  //   const next = get().nextOrderNumber + 1;
  //   set((state) => ({
  //     ordersQueue: [...state.ordersQueue, { id: next, items, confirmedAt }],
  //     nextOrderNumber: next,
  //   }));
  // },
addOrderToQueue: (confirmedAt) => {
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
        { id: orderId, items, confirmedAt },
      ],
      nextOrderNumber: orderId + 1,
    }));

    // Add to the order history as well
    useHistoryStore.getState().addOrder({
      OrderId: orderId,
      Status: "Queued",
      items,
      Total: items.reduce((acc, item) => acc + item.price * item.quantity, 0), // Assuming Total calculation
      Date: new Date(),
    });

    return orderId; // ✅ return the id used
  },

  bumpOrder: () => {
    set((state) => {
      const orderToBump = state.ordersQueue[0]; // Get the first order in the queue
      if (orderToBump) {
        // Move the order to VoidOrder with "Completed" status
        useHistoryStore.getState().updateOrderStatus(orderToBump.id, 'Completed');

        // Save the order to orderHistory
        useHistoryStore.getState().addOrder({
          OrderId: orderToBump.id,
          Status: 'Completed',
          items: orderToBump.items,
          Total: orderToBump.items.reduce((acc, item) => acc + item.price * item.quantity, 0), // Assuming Total calculation
          Date: new Date(),
        });

        // Remove the order from ordersQueue
        return {
          ordersQueue: state.ordersQueue.slice(1),
        };
      }

      return state;
    });
  },

  revertOrder: () => {
    set((state) => {
      const orderToRevert = useHistoryStore
        .getState()
        .orderHistory.find((order) => order.Status === "Completed");

      if (orderToRevert) {
        // Avoid reversion of voided orders
        if (orderToRevert.Status === "Voided") {
          console.error("This order has already been voided.");
          return state;
        }

        // Convert the items to the correct object format
        const items = orderToRevert.items.map((i) => ({
          title: i.title,
          price: i.price,
          quantity: i.quantity,
        }));

        // Add it back to ordersQueue
        const newOrderQueue = [
          ...state.ordersQueue,
          {
            id: orderToRevert.OrderId,
            items,
            confirmedAt: Date.now(),
          },
        ];

        // Update the order status to "Queued"
        useHistoryStore.getState().updateOrderStatus(orderToRevert.OrderId, "Queued");

        return {
          ordersQueue: newOrderQueue,
        };
      }

      return state; // Return unchanged state if no order is found
    });
  },
}));

