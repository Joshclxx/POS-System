"use client";

import { useState, useEffect } from "react";
import React from "react";
import Button from "../Button";
import SectionContainer from "../SectionContainer";
import toast, { Toaster } from "react-hot-toast";
import { GET_ALL_ORDERS } from "@/app/graphql/query";
import { UPDATE_ORDER_STATUS } from "@/app/graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { formatType } from "@/app/utils/capitalized";
import { handleGraphQLError } from "@/app/utils/handleGraphqlError";

type OrderRawData = {
  id: number;
  items: {
    productName: string;
    productSize: "pt" | "rg" | "gr";
    productPrice: number;
    quantity: number;
  }[];
  type: "dine_in" | "take_out";
  status: "queue" | "completed" | "voided";
};

type OrderQueuesItem = {
  id: number;
  type: "dine_in" | "take_out";
  items: {
    title: string;
    size: "pt" | "rg" | "gr";
    price: number;
    quantity: number;
  }[];
};

const OrdersQueue = () => {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [ordersQueue, setOrdersQueue] = useState<OrderQueuesItem[]>([]);
  const { data: orderdata, refetch } = useQuery(GET_ALL_ORDERS);
  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS);

  // LOAD ALL ORDERS WITH STATUS QUEUE
  useEffect(() => {
    if (orderdata?.getAllOrders) {
      const orderQueueFormat = orderdata.getAllOrders
        .filter((order: OrderRawData) => order.status === "queue")
        .map((order: OrderRawData) => {
          const items = order.items.map((item) => ({
            title: item.productName,
            size: item.productSize,
            price: item.productPrice,
            quantity: item.quantity,
          }));

          return {
            id: order.id,
            type: order.type,
            items,
          };
        });
      setOrdersQueue(orderQueueFormat);
    }
  }, [orderdata]);

  const bumpSelectedOrder = async () => {
    const orderToBump = ordersQueue.find((order) => order.id === selectedOrder);

    if (selectedOrder !== null) {
      try {
        await updateOrderStatus({
          variables: {
            data: {
              id: orderToBump?.id,
              status: "completed",
            },
          },
        });
        refetch();
        toast.success(`Order #${selectedOrder} Served!`, {
          id: "notif-message",
        });
      } catch (error) {
        handleGraphQLError(error);
      }

      setSelectedOrder(null);
    }
  };

  return (
    <SectionContainer background="mt-1 w-[235px] h-[700px]">
      <Toaster position="top-center" />
      {/* ORDER QUEUE HEADER */}
      <div className="bg-primary w-full h-[60px] flex items-center justify-center menu-total text-[18px]">
        ORDER QUEUE
      </div>

      {/* Order List */}
      <div className="bg-colorDirtyWhite w-full h-[600px] mt-[4px] p-2 overflow-y-auto">
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
              <div className="flex justify-between px-14">
                <p className="primary-title">{order.id}</p>
                <p className="primary-title">{formatType(order.type)}</p>
              </div>

              {/* Conditionally show items only if this order is selected */}
              {selectedOrder === order.id && (
                <div className="text-[12px] mt-1 text-primary font-medium">
                  {order.items.map((item, idx) => (
                    <p key={idx}>
                      {item.title} {item.size} - {item.price} x {item.quantity}
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
