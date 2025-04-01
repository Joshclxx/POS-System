"use client";

import { useState } from "react";
import OrdersMenu from "@/components/orders/OrdersMenu";
import OrdersMenuNavBar from "@/components/orders/OrdersMenuNavBar";
import OrdersQueue from "@/components/orders/OrdersQueue";
import OrdersView from "@/components/orders/OrdersView";
import SectionContainer from "@/components/SectionContainer";
import Payment from "@/components/orders/Payment";
import { useOrderStore } from "@/hooks/useOrder";

export default function Home() {
  const [activeKey, setActiveKey] = useState("espresso");
  const [isPaying, setIsPaying] = useState(false);
  const [amountType, setAmountType] = useState("");
  const [total, setTotal] = useState(0);

  const handleConfirmPayment = () => {
    useOrderStore.getState().addOrderToQueue(Date.now());
    useOrderStore.getState().clearProducts();
    setIsPaying(false);
  };

  return (
    <SectionContainer background="w-full h-[914px] flex items-center">
      <div className="flex gap-4 w-full max-w-[1280px]">
        <OrdersView
          isPaying={isPaying}
          setIsPaying={setIsPaying}
          setTotal={setTotal}
        />
        {isPaying ? (
          <Payment
            amountType={amountType}
            setAmountType={setAmountType}
            itemAmount={total}
            onBackToOrders={handleConfirmPayment}
          />
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <OrdersMenuNavBar
                activeKey={activeKey}
                setActiveKey={setActiveKey}
              />
              <OrdersMenu activeKey={activeKey} />
            </div>
            <OrdersQueue />
          </>
        )}
      </div>
    </SectionContainer>
  );
}
