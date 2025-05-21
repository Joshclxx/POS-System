"use client";

import React from "react";
import Button from "../Button";
import useGlobal from "@/hooks/useGlobal";

interface Props {
  activeKey: string;
  setActiveKey: (key: string) => void;
}

const OrdersMenuNavBar = ({ activeKey, setActiveKey }: Props) => {
  const { menus } = useGlobal();

  return (
    <nav className="bg-colorDirtyWhite w-[585px] h-[60px] flex items-center mt-[12px]">
      <div className="w-full max-w-[1280px] mx-auto flex items-center px-4">
        <div
          className="overflow-x-auto scroll-smooth thin-scrollbar"
          style={{ scrollSnapType: "x mandatory" }}
        >
          <ul className="flex gap-2 flex-nowrap min-w-max">
            {menus.map((menu, index) => (
              <li key={index} style={{ scrollSnapAlign: "start" }}>
                <Button
                  variant="order-navbar"
                  isActive={activeKey === menu}
                  onClick={() => setActiveKey(menu)}
                >
                  {menu}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default OrdersMenuNavBar;
