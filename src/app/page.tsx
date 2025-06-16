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
import { useLogout } from "./utils/handleLogout";
export default function Home() {
  const [activeKey, setActiveKey] = useState("espresso");
  const [isPaying, setIsPaying] = useState(false);
  const [amountType, setAmountType] = useState("");
  const [total, setTotal] = useState(0);
  const { userRole, loggedIn, hasHydrated, logout } = useUserStore();
  const { data } = useQuery(GET_ALL_USERS);
  const router = useRouter();
  const { handleLogout } = useLogout();
  console.log("Hydrated:", hasHydrated);
  console.log("Logged In:", loggedIn);
  console.log("Role:", userRole);

  useEffect(() => {
    if (!hasHydrated) return;
    // logout(); force logout
    if (!loggedIn || userRole !== "cashier") {
      router.replace("/login?redirect=/");
    }
  }, [hasHydrated, loggedIn, userRole, router, data]);

  const handleConfirmPayment = () => {
    useOrderStore.getState().clearProducts();
    setIsPaying(false);
  };

  // Show loading until hydration is done
  if (!hasHydrated) {
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
