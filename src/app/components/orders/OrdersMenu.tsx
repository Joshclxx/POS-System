import React from "react";
import SectionContainer from "../SectionContainer";
import Espresso from "./orderMenu/Espresso";
import IcedCoffee from "./orderMenu/IcedCoffee";

interface OrdersMenuProps {
  activeKey: string;
}

const OrdersMenu = ({ activeKey }: OrdersMenuProps) => {
  const renderMenu = () => {
    switch (activeKey) {
      case "espresso":
      default:
        return <Espresso />;
      case "icedCoffee":
        return <IcedCoffee />;
    }
  };

  return (
    <SectionContainer background="mt-[4px] w-full h-auto">
      {renderMenu()}
    </SectionContainer>
  );
};

export default OrdersMenu;
