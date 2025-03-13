import React from "react";
import Button from "../Button";
import SectionContainer from "../SectionContainer";

const OrdersQueue = () => {
  return (
    <SectionContainer background="mt-1 w-[200px] h-[914px]">
      {/* ORDER QUEUE HEADER */}
      <div className="bg-primary w-[200px] h-[60px] flex items-center justify-center menu-total text-[18px]">
        ORDER QUEUE
      </div>

      {/* Order List */}
      <div className="relative bg-colorDirtyWhite w-[200px] h-[741px] mt-[4px] p-2 ">
        {/* CLEAR BUTTON */}
        <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 flex items-center">
          <Button variant="clear" className="w-[192px]">
            CLEAR
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
};

export default OrdersQueue;
