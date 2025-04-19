import {create} from 'zustand';

interface OrderData {
  OrderId: number;
  ProductName: string;
  Price: number;
  Qty: number;
  Total: number;
  Date: Date;
  Status: 'Queued' | 'Completed' | 'Voided';
}

interface HistoryStore {
  orderHistory: OrderData[];
  updateOrderStatus: (orderId: number, status: 'Queued' | 'Completed' | 'Voided') => void;
  addOrder: (order: OrderData) => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
    orderHistory: [
        {
            OrderId: 1,
            ProductName: "test",
            Price: 123,
            Qty: 12,
            Total: 123 * 12,
            Date: new Date(),
            Status: "Queued"
        },
    ],
    updateOrderStatus: (orderId, status) => {
        set((state) => ({
            orderHistory: state.orderHistory.map((order) =>
            order.OrderId === orderId ? { ...order, Status: status } : order),
        }));
    },

    addOrder: (order) => {
        set((state) => ({
            orderHistory: [...state.orderHistory, order],
        }));
    },
}));
