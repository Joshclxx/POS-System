"use client";

import SectionContainer from "../../SectionContainer";
import React from "react";

const VoidOrder = () => {
  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <div className="grid grid-cols-12 mt-4">
        <div className="container bg-colorDirtyWhite w-[1280] h-[914px] flex flex-row p-[10px]">
          <div className="order-queue-panel flex flex-col w-[320] h-[914px]  text-center">
            <h3>ORDER QUEUE</h3>
            <div className="search-container">
              <input type="text" placeholder="Order Id" className="border-black w-[320]"/>
            </div>
            <div className="order-queue-container">

            </div>
            <div>
              <button className="btn btn-primary">VOID</button>
            </div>
          </div>
          <div className="order-history-panel flex flex-col w-[960px] h-[914px] border-black">
            <h3>ORDER HISTORY</h3>
            <div className="search-container flex flex-row max-w-[960px] ">
             <input type="text" placeholder="Order Id" className="w-[85%]"/>
             <button>PRINT RECEIPT</button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Item</th>
                    <th>QTY</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>

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
