import React from "react";
import SectionContainer from "../SectionContainer";
import Button from "../Button";

const OrdersView = () => {
  return (
    <SectionContainer background="mt-1 w-full max-w-[428px] h-[914px]">
      {/* DELETE & DINE IN */}
      <div className="flex gap-[4px] w-full">
        <Button variant="primary" className="flex-1">
          DELETE
        </Button>
        <Button variant="dine-out" className="flex-1">
          DINE IN ⌄
        </Button>
      </div>

      {/* Order List */}
      <div className="bg-colorDirtyWhite w-full max-w-[428px] h-[677px] mt-1 p-2">
        <div className="bg-primary w-full h-[40px] flex items-center">
          <div className="text-tertiary flex justify-between px-2 w-full">
            <p className="w-1/2">ITEMS</p>
            <p className="w-1/4 text-center">QTY</p>
            <p className="w-1/4 text-right">PRICE</p>
          </div>
        </div>
      </div>

      {/* TOTAL & PAY */}
      <div className="flex gap-[4px] w-full mt-1">
        <div className="container bg-primary w-[279px] menu-total flex items-center text-[24px]">
          Total
        </div>
        <Button variant="pay" className="flex-1">
          PAY
        </Button>
      </div>
    </SectionContainer>
  );
};

export default OrdersView;
