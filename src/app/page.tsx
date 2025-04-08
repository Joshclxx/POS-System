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

export default function Home() {
  const [activeKey, setActiveKey] = useState("espresso");
  const [isPaying, setIsPaying] = useState(false);
  const [amountType, setAmountType] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // Check if user is "logged in"

    if (typeof window !== "undefined") { //to make sure we are onmm client side
      const isLoggedIn = localStorage.getItem("loggedIn") === "true";
      console.log("Logged In Status: ", isLoggedIn);  // testing natin if working

      if (!isLoggedIn) {
        router.push("/login");  // Redirect to the login page if not logged in
      } else {
        setLoading(false);
      }
    }
  }, [router]);

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
