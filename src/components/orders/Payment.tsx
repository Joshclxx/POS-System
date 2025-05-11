"use client";

import React, { useState } from "react";
import SectionContainer from "../SectionContainer";
import { useShiftStore } from "@/hooks/shiftStore";
import { useOrderStore } from "@/hooks/useOrder";
// import { useHistoryStore } from "@/hooks/useOrderHistory";
import toast, { Toaster } from "react-hot-toast";
import { CREATE_ORDER } from "@/app/graphql/mutations";
import {
  GET_PRODUCT,
  GET_PRODUCT_VARIANT,
  GET_ALL_ORDERS,
} from "@/app/graphql/query";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

type PaymentProps = {
  amountType: string;
  setAmountType: React.Dispatch<React.SetStateAction<string>>;
  itemAmount: number;
  onBackToOrders: () => void;
};

const Payment = ({
  amountType,
  setAmountType,
  itemAmount,
  onBackToOrders,
}: PaymentProps) => {
  const addSale = useShiftStore((s) => s.addSale);
  const [finalAmount, setFinalAmount] = useState<number | null>(null);
  const [change, setChange] = useState<number>(0);
  const [okPressed, setOkPressed] = useState(false);
  // const { addOrder } = useHistoryStore();
  const { selectedProducts, clearProducts, nextOrderNumber } = useOrderStore();

  const handleKeyClick = (key: string) => {
    if (key === "←") {
      setAmountType((prev) => prev.slice(0, -1));
    } else if (key === "Exact Amount") {
      setAmountType(itemAmount.toFixed(2));
    } else if (key === "1000" || key === "500") {
      setAmountType(key);
    } else if (!isNaN(Number(key)) || key === ".") {
      setAmountType((prev) => (prev === "0.00" ? key : prev + key));
    }
  };

  const handleConfirm = () => {
    const amount = parseFloat(amountType);
    if (!isNaN(amount)) {
      setFinalAmount(amount);
      setChange(amount - itemAmount);
      setAmountType("0.00");
      setOkPressed(true);
      addSale(amount);
    }
  };

  const getButtonStyles = (key: string) => {
    switch (key) {
      case "Exact Amount":
        return "bg-secondary text-white text-md";
      case "1000":
        return "bg-colorBlue text-white text-md";
      case "500":
        return "bg-colorOrange text-white text-md";
      case "OK":
        return "bg-colorGreen text-white text-md";
      default:
        return "bg-primaryGray text-primary text-xl";
    }
  };

  //mutatation
  const [createOrder] = useMutation(CREATE_ORDER);
  const [getProduct] = useLazyQuery(GET_PRODUCT);
  const [getProductVariant] = useLazyQuery(GET_PRODUCT_VARIANT);
  const { refetch } = useQuery(GET_ALL_ORDERS);

  return (
    <SectionContainer background="mt-1 w-[900px] h-auto">
      <Toaster position="top-center" />
      <div className="flex flex-col w-full bg-colorDirtyWhite p-4 gap-6">
        {/* Details Container */}
        <div className="bg-colorDirtyWhite border border-primary w-full rounded-lg p-4">
          <div className="flex flex-col gap-3">
            {["Item Purchased", "Amount", "Discount", "Payment", "Change"].map(
              (label, idx) => (
                <div
                  key={label}
                  className={`flex justify-between ${
                    idx === 0 || idx === 3
                      ? "border-b border-primaryGray pb-2"
                      : ""
                  }`}
                >
                  <p className="primary-title">{label}</p>
                  <p className="primary-title">
                    {label === "Item Purchased" && itemAmount.toFixed(2)}
                    {label === "Amount" &&
                      (finalAmount !== null ? finalAmount.toFixed(2) : "0.00")}
                    {label === "Discount" && "0.00"}
                    {label === "Payment" && "Cash"}
                    {label === "Change" &&
                      (change > 0 ? change.toFixed(2) : "0.00")}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Amount & Discount */}
        <div className="flex gap-6">
          <div className="border-2 border-primary rounded-lg w-[560px] h-[84px] px-4 flex items-center justify-between">
            <p className="primary-title">Amount</p>
            <p className="primary-title">{amountType || "0.00"}</p>
          </div>
          <button className="bg-secondary text-white rounded-lg w-[200px] h-[84px] font-semibold shadow hover:bg-primary-dark">
            DISCOUNT
          </button>
        </div>

        {/* Keypad */}
        <div className="flex gap-6">
          <div className="border-2 border-primary rounded-lg w-[560px] h-[405px] p-4 grid grid-cols-4 gap-3">
            {[
              "1",
              "2",
              "3",
              "Exact Amount",
              "4",
              "5",
              "6",
              "1000",
              "7",
              "8",
              "9",
              "500",
              ".",
              "0",
              "←",
              "OK",
            ].map((key) => (
              <button
                key={key}
                onClick={() =>
                  key === "OK" ? handleConfirm() : handleKeyClick(key)
                }
                className={`rounded-md font-bold shadow border hover:bg-opacity-80 ${getButtonStyles(
                  key
                )}`}
              >
                {key}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {["BANK", "GCASH", "MAYA", "CONFIRM"].map((label) => (
              <button
                key={label}
                onClick={async () => {
                  if (label === "CONFIRM") {
                    if (!okPressed) return;

                    const itemInputs = await Promise.all(
                      selectedProducts.map(async (item) => {
                        const { data: productData } = await getProduct({
                          variables: { name: item.imageTitle },
                        });
                        const productId = productData?.getProduct?.id;
                        const { data: variantData } = await getProductVariant({
                          variables: {
                            data: {
                              productId: productId,
                              size: item.size,
                            },
                          },
                        });
                        const variantId = variantData?.getProductVariant?.id;
                        const price = item.price[item.size];
                        const quantity = item.quantity ?? 1;
                        const subtotal = price * quantity;

                        return {
                          productVariantId: variantId,
                          quantity,
                          subtotal,
                        };
                      })
                    );

                    console.log(itemInputs);

                    const totalAmount = itemInputs.reduce(
                      (acc, item) => acc + item.subtotal,
                      0
                    );
                    try {
                      const orderId = nextOrderNumber;
                      await createOrder({
                        variables: {
                          data: {
                            items: itemInputs,
                            total: totalAmount,
                            status: "QUEUE",
                            userId: "f22efa5c-899c-4bad-ba78-5270a1622aaa", //for testing only 733a5559-b2b8-49c5-92ce-66ebb3af13d8 / Josh f22efa5c-899c-4bad-ba78-5270a1622aaa
                          },
                        },
                      });
                      refetch(); //refetch the Orders to get the latest update
                      clearProducts();
                      setOkPressed(false); // Reset after confirmation
                      toast.success(`Order #${orderId} Payment Confirmed.`);
                      onBackToOrders();
                    } catch (error) {
                      console.error(error); //simple error for now
                    }
                    //NOT NEEDED for now
                    // const orderId = nextOrderNumber;
                    // const items = selectedProducts.map((item) => ({
                    //   title: `${item.imageTitle} (${item.size})`,
                    //   price: item.price[item.size],
                    //   quantity: item.quantity ?? 1,
                    // }));

                    // const newOrder = {
                    //   OrderId: orderId,
                    //   items,
                    //   Total: itemAmount,
                    //   Date: new Date(),
                    //   Status: "Queued" as const,
                    // };

                    // addOrder(newOrder);
                  } else {
                    handleKeyClick(label);
                  }
                }}
                className={`rounded-lg w-[200px] h-[90px] font-semibold shadow ${
                  label === "CONFIRM"
                    ? okPressed
                      ? "bg-colorGreen text-white"
                      : "bg-secondary text-white"
                    : "bg-secondary text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Payment;
