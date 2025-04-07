import React from "react";
import useGlobal from "@/hooks/useGlobal";
import SectionContainer from "../SectionContainer";
import OrderMenuItems from "./OrderMenuItems";
interface OrdersMenuProps {
  activeKey: string;
}

const OrdersMenu = ({ activeKey }: OrdersMenuProps) => {
  const { menuItems } = useGlobal();
  // get all menuitems then FILTER MENU ITEMS BY menu

  return (
    <SectionContainer background="mt-[4px] w-full h-auto">
      <OrderMenuItems activeMenu={activeKey} />
    </SectionContainer>
  );
};

export default OrdersMenu;
