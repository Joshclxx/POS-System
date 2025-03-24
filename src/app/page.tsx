"use client";

import { useState } from "react";
import OrdersMenu from "./components/orders/OrdersMenu";
import OrdersMenuNavBar from "./components/orders/OrdersMenuNavBar";
import OrdersQueue from "./components/orders/OrdersQueue";
import OrdersView from "./components/orders/OrdersView";
import SectionContainer from "./components/SectionContainer";

export default function Home() {
  const [activeKey, setActiveKey] = useState("espresso");

  return (
    <SectionContainer background="w-full h-[914px] flex items-center">
      <div className="bg-bgWhite p-[4px] flex justify-center w-full">
        <div className="flex gap-4 w-full max-w-[1280px]">
          <OrdersView />
          <div className="flex flex-col gap-1">
            <OrdersMenuNavBar
              activeKey={activeKey}
              setActiveKey={setActiveKey}
            />
            <OrdersMenu activeKey={activeKey} />
          </div>
          <OrdersQueue />
        </div>
      </div>
    </SectionContainer>
  );
}
