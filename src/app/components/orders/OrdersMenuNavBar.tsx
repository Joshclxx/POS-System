"use client";

import React from "react";
import { ORDERS_NAV_LINKS } from "@/app/constants";
import Button from "../Button";

interface Props {
  activeKey: string;
  setActiveKey: (key: string) => void;
}

const OrdersMenuNavBar = ({ activeKey, setActiveKey }: Props) => {
  return (
    <nav className="bg-colorDirtyWhite w-full h-[60px] flex items-center mt-[12px]">
      <div className="w-full max-w-[1280px] mx-auto flex justify-between items-center px-4">
        <ul className="flex gap-2">
          {ORDERS_NAV_LINKS.map((link) => (
            <li key={link.key}>
              <Button
                variant="order-navbar"
                isActive={activeKey === link.key}
                onClick={() => setActiveKey(link.key)}
              >
                {link.label}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default OrdersMenuNavBar;
