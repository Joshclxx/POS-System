"use client";
  
import SectionContainer from "../../SectionContainer";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { GET_ALL_ORDERS } from "@/app/graphql/query";
import { UPDATE_ORDER_STATUS } from "@/app/graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";


type OrderRawData = {
  id: number;
  items: {
    productVariant: {
      price: number;
      product: {
        name: string;
      };
    };
    quantity: number;
  }[];
  total: number
  status: "QUEUE" | "COMPLETED" | "VOIDED"
  createdAt: string
};

type Orders = {
  id: number
  items: {
    title: string
    price: number
    quantity: number
  }[]
  status: "QUEUE" | "COMPLETED" | "VOIDED"
  total: number
  createdAt: string
}

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
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-primary py-1 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={(onConfirm)}
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
  const [searchId, setSearchId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  // const [previousStatus, setPreviousStatus] = useState<
  //   Record<number, "Queued" | "Completed" | "Voided" | null>
  // >({});

  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS)
  const [orders, setOrders] = useState<Orders[]>([])
  const {data: orderData, refetch} = useQuery(GET_ALL_ORDERS);
  

  useEffect(() => {
    if (orderData?.getAllOrders) {
      const ordersFormat = orderData.getAllOrders.map((order: OrderRawData) => {

        const items = order.items.map((item) => ({
          title: item.productVariant.product.name,
          price: item.productVariant.price,
          quantity: item.quantity,
        }));



        return {
          id: order.id,
          items,
          status: order.status,
          total: order.total,
          createdAt: order.createdAt
        };

      });

      setOrders(ordersFormat)
    }
  }, [orderData]);


  const voidOrder = async (orderId: number) => {

    const orderToVoid = orders.find((order) => order.id === orderId);

    try {
      await updateOrderStatus({
        variables: {
          data: {
            id: orderToVoid?.id,
            status: "VOIDED"
          }
        }
      });
      refetch();
    } catch (error) {
      console.error(error) //simple error for
    }
    setIsConfirmationVisible(false);  
  }

  const filteredOrders = orders.filter((order) =>
    order.id.toString().includes(searchId)
  );

  const handleVoidClick = () => {
    if (!selectedOrder) return;

    if (selectedOrder.status === "VOIDED") {
      toast.error(`Order #${selectedOrder.id} is already voided.`);
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

  const revertOrder = (orderId: number) => {

  }

  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <div className="grid grid-cols-12 mt-4">
        <div className="container bg-colorDirtyWhite w-[1280px] flex flex-row p-[10px]">
          <div className="order-history-panel flex flex-col basis-[100%] h-[914px]">
            <div className="heading flex h-[52px] items-center bg-[#000000] border rounded-[8px] mb-[5px]">
              <p className="text-colorDirtyWhite font-bold text-[24px] px-[10px]">
                VOID ORDER
              </p>
            </div>

            <div className="flex justify-end mb-2 px-[10px]">
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Search Order ID..."
                className="border border-gray-300 rounded-[6px] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all w-[250px]"
              />
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar mt-[5px] px-[10px]">
              <table className="w-full table-auto border-separate border-spacing-0 shadow-[0_0_20px_rgba(0,0,0,0.15)]">
                <thead className="bg-secondaryGray text-primary text-left sticky top-0 z-20 pr-[10px]">
                  <tr>
                    <th className="px-[12px] py-[15px]">Order ID</th>
                    <th className="px-[12px] py-[15px]">Items</th>
                    <th className="px-[12px] py-[15px]">Total</th>
                    <th className="px-[12px] py-[15px]">Date & Time</th>
                    <th className="px-[12px] py-[15px]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="border-b hover:bg-secondaryGray/50 cursor-pointer"
                    >
                      <td className="px-[12px] py-[12px]">{order.id}</td>
                      <td className="px-[12px] py-[12px]">
                        {truncateItemName(
                          order.items.length > 0 ? 
                          order.items.map((item) => item.title).join(",")
                          : "No Items"
                        )}
                      </td>
                      <td className="px-[12px] py-[12px]">
                        {new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP"
                        }).format(order.total)}
                      </td>
                      <td className="px-[12px] py-[12px]">
                        {order.createdAt}
                      </td>
                      <td className="px-[12px] py-[12px]">{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedOrder && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-secondaryGray p-6 rounded-lg shadow-lg w-[400px]">
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
                    <strong>Total Price:</strong>{" "}
                    {selectedOrder.total}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedOrder.status}
                  </p>

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-4 rounded"
                    >
                      Cancel
                    </button>

                    {selectedOrder.status === "VOIDED" ? (
                      <button
                        onClick={() => revertOrder(selectedOrder.id)}
                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded"
                      >
                        Revert Void
                      </button>
                    ) : (
                      <button
                        onClick={handleVoidClick}
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded"
                      >
                        Void Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isConfirmationVisible && selectedOrder && (
        <ConfirmationModal
          orderId={selectedOrder.id}
          onConfirm={() => {voidOrder(selectedOrder.id); setSelectedOrder(null)}}
          onCancel={() => setIsConfirmationVisible(false)}
        />
      )}
    </SectionContainer>
  );
};

export default VoidOrder;
