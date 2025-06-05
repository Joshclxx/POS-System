import React from "react";
import SectionContainer from "../SectionContainer";
import OrderMenuItems from "./OrderMenuItems";
interface OrdersMenuProps {
  activeKey: string;
}

const OrdersMenu = ({ activeKey }: OrdersMenuProps) => {
  return (
    <SectionContainer background="mt-[4px] w-full h-auto">
      <OrderMenuItems activeMenu={activeKey} />
    </SectionContainer>
  );
};

export default OrdersMenu;
