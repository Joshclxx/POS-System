"use client";

import { useState, useEffect } from "react";
import React from "react";
import Button from "../Button";
import SectionContainer from "../SectionContainer";
// import { useOrderStore } from "@/hooks/useOrder";
// import { useHistoryStore } from "@/hooks/useOrderHistory";
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
  status: "queue" | "completed" | "voided"
};

type OrderQueuesItem = {
  id: number,
  items: {
    title: string
    price: number
    quantity: number
  }[]
}



const OrdersQueue = () => {
  // const ordersQueue = useOrderStore((state) => state.ordersQueue);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  // const updateOrderStatus = useHistoryStore((state) => state.updateOrderStatus);
  // const addOrderToHistory = useHistoryStore((state) => state.addOrder); // Added to handle adding orders to history

  const [ordersQueue, setOrdersQueue] = useState<OrderQueuesItem[]>([]);
  const { data: orderdata, refetch } = useQuery(GET_ALL_ORDERS);
  const [ updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS);

  // LOAD ALL ORDERS WITH STATUS QUEUE
  useEffect(() => {

    console.log(orderdata?.getAllOrders)
    if (orderdata?.getAllOrders) {
      const orderQueueFormat = orderdata.getAllOrders
      .filter((order: OrderRawData) => order.status === "queue") //only show the order wth qeue
      .map((order: OrderRawData) => {

        const items = order.items.map((item) => ({
          title: item.productVariant.product.name,
          price: item.productVariant.price,
          quantity: item.quantity,
        }));


        return {
          id: order.id,
          items,
        };


      })

      setOrdersQueue(orderQueueFormat);
    }
  }, [orderdata]);

  const bumpSelectedOrder = async () => {

    const orderToBump = ordersQueue.find(
      (order) => order.id === selectedOrder
    );

    if (selectedOrder !== null) {
      try {
        await updateOrderStatus({
          variables: {
            data: {
              id: orderToBump?.id,
              status: "completed"
            }
          }
        });
        refetch();
        toast.success(`Oder #${selectedOrder} Served!`);
      } catch(error) {
        console.error(error) // simpl error for now
      }

      // updateOrderStatus(selectedOrder, "Completed");

      // const orderToBump = ordersQueue.find(
      //   (order) => order.id === selectedOrder
      // );
      // if (orderToBump) {
      //   addOrderToHistory({
      //     OrderId: orderToBump.id,
      //     Status: "Completed",
      //     items: orderToBump.items,
      //     Total: orderToBump.items.reduce(
      //       (acc, item) => acc + item.price * item.quantity,
      //       0
      //     ),
      //     Date: new Date(),
      //   });
      // }

      // useOrderStore.setState((state) => ({
      //   ordersQueue: state.ordersQueue.filter((o) => o.id !== selectedOrder),
      // }));

      setSelectedOrder(null);
    }
  };

  return (
    <SectionContainer background="mt-1 w-[235px] h-[914px]">
      <Toaster position="top-center" />
      {/* ORDER QUEUE HEADER */}
      <div className="bg-primary w- h-[60px] flex items-center justify-center menu-total text-[18px]">
        ORDER QUEUE
      </div>

      {/* Order List */}
      <div className="bg-colorDirtyWhite w-full h-[674px] mt-[4px] p-2 overflow-y-auto">
        <div className="flex flex-col gap-3 text-center">
          {ordersQueue.map((order) => (
            <div
              key={order.id}
              className={`py-1 px-2 rounded cursor-pointer ${
                selectedOrder === order.id ? "bg-[#ceb395]" : ""
              }`}
              onClick={() =>
                setSelectedOrder((prev) =>
                  prev === order.id ? null : order.id
                )
              }
            >
              <p className="primary-title">{order.id}</p>

              {/* Conditionally show items only if this order is selected */}
              {selectedOrder === order.id && (
                <div className="text-[12px] mt-1 text-primary font-medium">
                  {order.items.map((item, idx) => (
                    <p key={idx}>
                      {item.title} - {item.price} x {item.quantity}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BUMP BUTTON OUTSIDE Order List */}
      <div className="relative w-[231px] h-[60px] mt-3">
        <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 flex items-center">
          <Button
            variant="clear"
            className="w-[192px]"
            disabled={selectedOrder === null}
            onClick={bumpSelectedOrder}
          >
            BUMP
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
};

export default OrdersQueue;
