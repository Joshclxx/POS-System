// This component allows verified managers to void or revert voided orders.
// Managers can search orders by ID and filter by date range. Once voided, orders can only be reverted during the session.

"use client";

import SectionContainer from "@/components/SectionContainer";
import { useState, useEffect } from "react";
import { GET_ALL_ORDERS } from "@/app/graphql/query";
import { UPDATE_ORDER_STATUS } from "@/app/graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";
import ManagerLogin from "@/components/admin/ManagerLogin";
import { useManagerAuth } from "@/hooks/useManagerAuth";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useShiftStore } from "@/hooks/useShiftStore";
import Button from "@/components/Button";
import { formatType } from "@/app/utils/capitalized";

// Define order data types
type OrderRawData = {
  id: number;
  items: {
    productName: string;
    productSize: "pt" | "rg" | "gr";
    productPrice: number;
    quantity: number;
  }[];
  total: number;
  status: "queue" | "completed" | "voided";
  createdAt: string;
};

type Orders = {
  id: number;
  items: {
    title: string;
    price: number;
    quantity: number;
  }[];
  status: "queue" | "completed" | "voided";
  total: number;
  createdAt: string;
};

// Modal to confirm voiding an order
const ConfirmationModal = ({
  onConfirm,
  onCancel,
  orderId,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  orderId: number;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-secondaryGray p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4 text-primary">
          Confirm Void Order
        </h2>
        <p className="text-primary">
          Are you sure you want to void Order #{orderId}?
          <br />
          <br />
          <span className="font-semibold">Important:</span>
          <br />
          Once you void this order, it can only be reverted here. If you
          navigate away from this page, you won’t be able to undo the action.
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-primary py-1 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded"
          >
            Confirm Void
          </button>
        </div>
      </div>
    </div>
  );
};

const VoidOrder = () => {
  // States for search, selection, filtering, and login
  const [searchId, setSearchId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [previousStatus, setPreviousStatus] = useState<
    Record<number, "queue" | "completed" | "voided">
  >({});
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [orders, setOrders] = useState<Orders[]>([]);

  // GraphQL & store hooks
  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS);
  const { data: orderData, refetch } = useQuery(GET_ALL_ORDERS);
  const { recordVoidRefund } = useShiftStore();
  const router = useRouter();

  // Manager login check
  // login, ---> removed for a while
  const { logout, login } = useManagerAuth();
  const [isManagerVerified, setIsManagerVerified] = useState(false);

  //validates the manager account
  const handleLoginSuccess = async (email: string, password: string) => {
    const loggedInAt = "void order";

    const success = await login(email, password, loggedInAt);

    if (success) {
      setIsManagerVerified(true);
    }
  };

  // Transform raw order data into usable format
  useEffect(() => {
    if (orderData?.getAllOrders) {
      const ordersFormat = orderData.getAllOrders.map((order: OrderRawData) => {
        const items = order.items.map((item) => ({
          title: item.productName,
          price: item.productPrice,
          quantity: item.quantity,
        }));

        return {
          id: order.id,
          items,
          status: order.status,
          total: order.total,
          createdAt: order.createdAt,
        };
      });

      setOrders(ordersFormat);
    }
  }, [orderData]);

  // Void selected order and record refund
  const voidOrder = async (orderId: number) => {
    const orderToVoid = orders.find((order) => order.id === orderId);
    if (!orderToVoid) {
      console.log(`Order with Id ${orderId} not found.`);
      return;
    }

    try {
      setPreviousStatus((prev) => ({
        ...prev,
        [orderId]: orderToVoid.status,
      }));

      await updateOrderStatus({
        variables: {
          data: { id: orderId, status: "voided" },
        },
      });

      recordVoidRefund(orderToVoid.total);
      refetch();
    } catch (error) {
      console.error(error);
    }
    setIsConfirmationVisible(false);
  };

  // Revert voided order to previous status
  const revertOrder = (orderId: number) => {
    const statusToRevert = previousStatus[orderId];
    if (!statusToRevert) {
      toast.error(`Revert failed: Order #${orderId}’s status has expired.`, {
        id: "notif-message",
      });
      setSelectedOrder(null);
      return;
    }

    try {
      updateOrderStatus({
        variables: {
          data: { id: orderId, status: statusToRevert },
        },
      });
      toast.success(`Successfully reverted order #${orderId}.`, {
        id: "notif-message",
      });
      setSelectedOrder(null);
    } catch (error) {
      toast.error(`${error}`, { id: "notif-message" });
    }
  };

  // Filter orders by ID and date range
  const filteredOrders = orders.filter((order) => {
    const matchesId = order.id.toString().includes(searchId);
    const orderDate = new Date(order.createdAt);
    const afterStart = startDate
      ? orderDate >= new Date(new Date(startDate).toISOString())
      : true;
    const beforeEnd = endDate
      ? orderDate <= new Date(new Date(endDate).toISOString())
      : true;
    return matchesId && afterStart && beforeEnd;
  });

  const handleVoidClick = () => {
    if (!selectedOrder) return;
    if (selectedOrder.status === "voided") {
      toast.error(`Order #${selectedOrder.id} is already voided.`, {
        id: "notif-message",
      });
      return;
    }
    setIsConfirmationVisible(true);
  };

  const truncateItemName = (
    itemName: string = "No Item",
    maxLength: number = 10
  ) => {
    return itemName.length > maxLength
      ? `${itemName.substring(0, maxLength)}...`
      : itemName;
  };

  // If manager not verified, show login screen
  if (!isManagerVerified) {
    return (
      <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px] bg-colorDirtyWhite">
        <Toaster />
        <ManagerLogin onLoginSuccess={handleLoginSuccess} />
      </SectionContainer>
    );
  }

  // Main UI: Void Order Panel
  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <div className="grid grid-cols-12 mt-4">
        <div className="container bg-colorDirtyWhite w-[1280px] min-h-[914px] p-2.5 rounded-xl shadow flex flex-col">
          {/* Header */}
          <div className="order-history-panel flex flex-col basis-full h-full">
            <div className="heading flex h-[52px] items-center bg-primary border rounded-lg mb-1.5 shadow-sm px-4">
              <p className="text-colorDirtyWhite font-bold text-2xl">
                VOID ORDER
              </p>
            </div>

            {/* Search Filters */}
            <div className="grid grid-cols-9 gap-4">
              <div className="col-span-5 mt-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Search Order ID..."
                  className="border border-primary rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition w-full"
                />
              </div>
              <div className="col-span-2 mt-2">
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-primary rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition w-full"
                />
              </div>
              <div className="col-span-2 mt-2">
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-primary rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition w-full"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="mt-1.5 px-2.5 h-[650px] overflow-y-auto hide-scrollbar">
              <table className="w-full table-auto border-separate border-spacing-0 shadow-md">
                <thead className="bg-secondaryGray text-primary text-left sticky top-0 z-20">
                  <tr>
                    <th className="px-3 py-3">Order ID</th>
                    <th className="px-3 py-3">Items</th>
                    <th className="px-3 py-3">Total</th>
                    <th className="px-3 py-3">Date & Time</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="border-b hover:bg-secondaryGray/30 cursor-pointer transition"
                    >
                      <td className="px-3 py-3">{order.id}</td>
                      <td className="px-3 py-3">
                        {truncateItemName(
                          order.items.length > 0
                            ? order.items.map((item) => item.title).join(",")
                            : "No Items"
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                        }).format(order.total)}
                      </td>
                      <td className="px-3 py-3">{order.createdAt}</td>
                      <td className="px-3 py-3">{formatType(order.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-secondaryGray p-6 rounded-2xl shadow-xl w-[400px]">
                  <h2 className="text-xl font-bold mb-4 text-primary">
                    Order Details
                  </h2>
                  <p>
                    <strong>Order ID:</strong> {selectedOrder.id}
                  </p>
                  <div>
                    <strong>Items:</strong>
                    <ul>
                      {selectedOrder.items.map((item, index) => (
                        <li key={index}>
                          {item.title} - {item.price} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p>
                    <strong>Total Price:</strong> {selectedOrder.total}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedOrder.status}
                  </p>

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-4 rounded-md transition"
                    >
                      Close
                    </button>
                    {selectedOrder.status === "voided" ? (
                      <button
                        onClick={() => revertOrder(selectedOrder.id)}
                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded-md transition"
                      >
                        Revert Void
                      </button>
                    ) : (
                      <button
                        onClick={handleVoidClick}
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-md transition"
                      >
                        Void Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="pt-4 px-2 mt-auto flex justify-end">
            <Button
              variant="universal"
              onClick={() => {
                logout();
                router.replace("/");
              }}
              className="w-[140px] h-auto bg-colorBlue text-tertiary rounded-full p-4 text-lg font-regular shadow-md hover:opacity-90 transition"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Voiding */}
      {isConfirmationVisible && selectedOrder && (
        <ConfirmationModal
          orderId={selectedOrder.id}
          onConfirm={() => {
            voidOrder(selectedOrder.id);
            setSelectedOrder(null);
          }}
          onCancel={() => setIsConfirmationVisible(false)}
        />
      )}
    </SectionContainer>
  );
};

export default VoidOrder;
