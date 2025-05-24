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
import { GET_ALL_USERS } from "./graphql/query";
import { useQuery } from "@apollo/client";


export default function Home() {
  const [activeKey, setActiveKey] = useState("espresso");
  const [isPaying, setIsPaying] = useState(false);
  const [amountType, setAmountType] = useState("");
  const [total, setTotal] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  // const [loading, setLoading] = useState(true);
  const { userRole, loggedIn } = useUserStore();
  const {data} = useQuery(GET_ALL_USERS)
  // .getState --> useUserStore.getState();
  const router = useRouter();

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     if (!loggedIn) {
  //       router.replace("/login?redirect=/");
  //     } else {
  //       setLoading(false);
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   if (userRole !== "cashier" || !useUserStore.getState().loggedIn) {
  //     useUserStore.getState().logout();
  //     router.push("/login");
  //   }
  // }, []);

  // const handleConfirmPayment = () => {
  //   // useOrderStore.getState().addOrderToQueue(Date.now()); //Connent for now
  //   useOrderStore.getState().clearProducts();
  //   setIsPaying(false);
  // };

  // if (loading) {
  //   return <div>Loading...</div>; // Show when checking login
  // }

  // Wait for Zustand to hydrate from localStorage
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Redirect only after Zustand state is hydrated
  useEffect(() => {
    if (!hydrated) return;

    if(!data || !data.getAllUsers) {
      useUserStore.getState().logout();
      router.replace("/login?redirect=/");
    }

    if (!loggedIn || userRole !== "cashier") {
      router.replace("/login?redirect=/");
    }
  }, [hydrated, loggedIn, userRole, router]);

  const handleConfirmPayment = () => {
    useOrderStore.getState().clearProducts();
    setIsPaying(false);
  };

  // Show loading until hydration is done
  if (!hydrated) {
    return <div>Loading...</div>;
  }

  //simple loading if aready logIn
  if (userRole !== "cashier") return <div>Loading...</div>;
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
