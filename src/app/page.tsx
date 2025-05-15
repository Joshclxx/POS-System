"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrdersMenu from "@/components/orders/OrdersMenu";
import OrdersMenuNavBar from "@/components/orders/OrdersMenuNavBar";
import OrdersQueue from "@/components/orders/OrdersQueue";
import OrdersView from "@/components/orders/OrdersView";
import SectionContainer from "@/components/SectionContainer";
import Payment from "@/components/orders/Payment";
import { useOrderStore } from "@/hooks/useOrder";
import { useUserStore } from "@/hooks/useUserSession";

export default function Home() {
  const [activeKey, setActiveKey] = useState("espresso");
  const [isPaying, setIsPaying] = useState(false);
  const [amountType, setAmountType] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { userRole } = useUserStore.getState();

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("loggedIn") === "true";
      if (!isLoggedIn) {
        router.replace("/login?redirect=/");
      } else {
        setLoading(false);
      }
    }
  }, []);

  //check if the userRole is cashier if not it will go to login
  useEffect(() => {
    if (userRole !== "cashier") {
      useUserStore.getState().logout();
      router.push("/login");
    }
  }, []);

  const handleConfirmPayment = () => {
    useOrderStore.getState().addOrderToQueue(Date.now());
    useOrderStore.getState().clearProducts();
    setIsPaying(false);
  };

  if (loading) {
    return <div>Loading...</div>; // Show when checking login
  }

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
