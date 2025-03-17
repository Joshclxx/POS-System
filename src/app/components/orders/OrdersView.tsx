"use client";

import React, { useState } from "react";
import SectionContainer from "../SectionContainer";
import Button from "../Button";
import Image from "next/image";

const OrdersView = () => {
  const [selectedOption, setSelectedOption] = useState("DINE IN");
  const [isOpen, setIsOpen] = useState(false);

  const options = ["DINE IN", "TAKE OUT"];

  return (
    <SectionContainer background="mt-1 w-full max-w-[428px] h-[914px]">
      {/* DELETE & DINE IN */}
      <div className="flex gap-[4px] w-full">
        <Button variant="primary" className="flex-1">
          DELETE
        </Button>
        <div className="relative w-[212px]">
          <button
            className="flex items-center justify-between p-2 bg-colorBlue w-full h-[60px] text-white font-semibold"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="text-lg">{selectedOption}</span>
            <Image
              src="/icon/dropdown.svg"
              alt="DropDown"
              height={15}
              width={15}
            />
          </button>
          {isOpen && (
            <div className="absolute top-full left-0 w-full bg-primary border border-primaryGray shadow-lg z-10">
              {options.map((option) => (
                <button
                  key={option}
                  className={`w-full text-left p-2 text-black hover:bg-gray-200 ${
                    selectedOption === option ? "font-bold" : ""
                  }`}
                  onClick={() => {
                    setSelectedOption(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
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
        <div className="container bg-primary w-[279px] menu-total flex items-center text-[24px] px-2">
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
