import React from "react";
import SectionContainer from "../SectionContainer";
import Espresso from "./orderMenu/Espresso";
import IcedCoffee from "./orderMenu/IcedCoffee";
import Cake from "./orderMenu/Cake";
import Cookies from "./orderMenu/Cookies";
import Sandwich from "./orderMenu/Sandwich";
import Tea from "./orderMenu/Tea";

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
      case "tea":
        return <Tea />;
      case "sandwich":
        return <Sandwich />;
      case "cookies":
        return <Cookies />;
      case "cake":
        return <Cake />;
    }
  };

  return (
    <SectionContainer background="mt-[4px] w-full h-auto">
      {renderMenu()}
    </SectionContainer>
  );
};

export default OrdersMenu;
