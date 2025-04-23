import { create } from 'zustand';

export interface OrderData {
  OrderId: number;
  items: { title: string; price: number; quantity: number }[]; // Order items
  Total: number;
  Date: Date;
  Status: 'Queued' | 'Completed' | 'Voided'; // Status of the order
}

interface HistoryStore {
  orderHistory: OrderData[]; // Holds order history
  updateOrderStatus: (orderId: number, status: 'Queued' | 'Completed' | 'Voided') => void;
  addOrder: (order: OrderData) => void;
  revertOrder: (orderId: number) => void; // Revert an order back to 'Queued'
  clearOrderHistory: () => void; // Clear all order history (optional)
  previousStatus: Record<number, 'Queued' | 'Completed' | 'Voided' | null | undefined>;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  orderHistory: [],
  previousStatus: {},

  updateOrderStatus: (orderId, status) =>
    set((state) => {
      const prevStatus = state.orderHistory.find((order) => order.OrderId === orderId)?.Status;
      return {
        orderHistory: state.orderHistory.map((order) =>
          order.OrderId === orderId ? { ...order, Status: status } : order
        ),
        previousStatus: {
          ...state.previousStatus,
          [orderId]: prevStatus ?? 'Queued', // Ensure there's a valid previous status
        },
      };
    }),

    revertOrder: (orderId: number) => {
        set((state) => {
          const orderToRevert = state.orderHistory.find(
            (order) => order.OrderId === orderId && order.Status !== 'Queued'
          );
      
          if (orderToRevert) {
            const prevStatus = state.previousStatus[orderId] ?? 'Queued'; // Fallback to 'Queued' if null/undefined
            return {
              orderHistory: state.orderHistory.map((order) =>
                order.OrderId === orderId ? { ...order, Status: prevStatus } : order
              ),
              previousStatus: {
                ...state.previousStatus,
                [orderId]: prevStatus, // Keep the previous status even after reverting
              },
            };
          }
      
          return state;
        });
    },

    addOrder: (order: OrderData) => {
        set((state) => {
          // Check if the order already exists in orderHistory
          const isDuplicate = state.orderHistory.some((existingOrder) => existingOrder.OrderId === order.OrderId);
          if (isDuplicate) {
            console.log(`Order ${order.OrderId} is already in order history.`);
            return state; // Don't add if it's a duplicate
          }
      
          return {
            orderHistory: [...state.orderHistory, order],
          };
        });
      },

  clearOrderHistory: () => set({ orderHistory: [], previousStatus: {} }),
}));
