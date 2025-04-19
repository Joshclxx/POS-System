"use client";

import SectionContainer from "../../SectionContainer";
// import { useHistoryStore } from "@/hooks/useOrderHistory";
// import { format } from "date-fns";

const VoidOrder = () => {
  // const { orderHistory, updateOrderStatus } = useHistoryStore();

  // const voidOrder = (orderId: number) => {
  //   // Change order status to "Voided"
  //   updateOrderStatus(orderId, "Voided");
  // };

  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <div className="grid grid-cols-12 mt-4">
        <div className="container bg-colorDirtyWhite w-[1280px] flex flex-row p-[10px]">

          <div className="order-history-panel flex flex-col basis-[100%] h-[914px] ">
            {/* heading */}
            <div className="heading flex h-[52px] items-center bg-[#000000] border rounded-[8px] mb-[5px] "> 
              <p className="text-colorDirtyWhite font-bold text-[24px] px-[10px]">VOID ORDER</p>
            </div>

            {/* table */}
            <div className="flex-1 overflow-y-auto hide-scrollbar mt-[5px] px-[10px]">
              <table className="w-full table-auto border-separate border-spacing-0 shadow-[0_0_20px_rgba(0,0,0,0.15)] ">
                <thead className="bg-secondaryGray text-primary text-left sticky top-0 z-20 pr-[10px]">
                  <tr>
                    <th className="px-[12px] py-[15px] ">Order ID</th>
                    <th className="px-[12px] py-[15px]">Product Name</th>
                    <th className="px-[12px] py-[15px] ">Price</th>
                    <th className="px-[12px] py-[15px] ">Qty</th>
                    <th className="px-[12px] py-[15px] ">Total</th>
                    <th className="px-[12px] py-[15px] ">Date</th>
                    <th className="px-[12px] py-[15px] ">Status</th>
                  </tr>
                </thead>

                <tbody className="">
                  <tr className="border-b hover:bg-secondaryGray/50">
                    <td className="px-[12px] py-[12px] ">Test</td>
                    <td className="px-[12px] py-[12px] ">Test</td>
                    <td className="px-[12px] py-[12px] ">Test</td>
                    <td className="px-[12px] py-[12px] ">Test</td>
                    <td className="px-[12px] py-[12px] ">10</td>
                    <td className="px-[12px] py-[12px] ">100</td>
                    <td className="px-[12px] py-[12px] ">Test</td>
                  </tr>
                  <tr className="border-b hover:bg-secondaryGray/50">
                  {}
                  </tr>
                </tbody>

              </table>
            </div>

          </div>
          
        </div>
      </div>
    </SectionContainer>
  );
};

export default VoidOrder;
