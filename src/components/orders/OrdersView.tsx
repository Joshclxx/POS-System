"use client";

import React, { useState } from "react";
import SectionContainer from "../SectionContainer";
import Button from "../Button";
import Image from "next/image";
import { useOrderStore } from "@/hooks/useOrder";
import { motion } from "framer-motion";

const OrdersView = () => {
  const [selectedOption, setSelectedOption] = useState("DINE IN");
  const [isOpen, setIsOpen] = useState(false);

  const options = ["DINE IN", "TAKE OUT"];

  const selectedProducts = useOrderStore((state) => state.selectedProducts);
  const total = selectedProducts.reduce(
    (acc, item) => acc + item.price[item.size] * (item.quantity || 1),
    0
  );

  // Properly implemented size name converter
  const getSizeName = (size: string) => {
    switch (size) {
      case "PT":
        return "(PT)";
      case "RG":
        return "(RG)";
      case "GR":
        return "(GR)";
      default:
        return size;
    }
  };

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const removeProduct = useOrderStore((state) => state.removeProduct);

  const [isEditingQty, setIsEditingQty] = useState(false);
  const [tempQty, setTempQty] = useState<number | null>(null);

  return (
    <SectionContainer background="mt-1 w-full max-w-[428px] h-[914px]">
      {/* DELETE & DINE IN */}
      <div className="flex gap-[4px] w-full">
        <Button
          variant="view-dlt"
          isSave={selectedIdx !== null}
          className="flex-1"
          onClick={() => {
            if (selectedIdx !== null) {
              removeProduct(selectedIdx);
              setSelectedIdx(null);
              setIsEditingQty(false);
              setTempQty(null);
            }
          }}
        >
          DLT
        </Button>
        <Button
          variant="view-qty"
          isSave={selectedIdx !== null || isEditingQty}
          className="flex-1"
          onClick={() => {
            if (isEditingQty && selectedIdx !== null && tempQty !== null) {
              useOrderStore.setState((state) => {
                const update = [...state.selectedProducts];
                update[selectedIdx].quantity = tempQty;
                return { selectedProducts: update };
              });
              setSelectedIdx(null);
              setIsEditingQty(false);
              setTempQty(null);
            } else if (selectedIdx !== null) {
              setIsEditingQty(true);
              setTempQty(selectedProducts[selectedIdx].quantity || 1);
            }
          }}
        >
          {isEditingQty ? "Save" : "QTY"}
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

      {/* ORDER LIST */}
      <div className="bg-colorDirtyWhite w-full max-w-[428px] h-[677px] mt-1 p-2 overflow-y-auto">
        <div className="bg-primary w-full h-[40px] flex items-center">
          <div className="text-tertiary flex justify-between px-2 w-full">
            <p className="w-1/2">ITEMS</p>
            <p className="w-1/4 text-center">QTY</p>
            <p className="w-1/4 text-right">PRICE</p>
          </div>
        </div>

        <div className="w-full text-left mt-2">
          <p className="text-[16px] font-semibold text-primary px-2">
            {selectedOption}
          </p>
        </div>

        {/* SELECTED ORDERED ITEMS */}
        <div className="divide-y">
          {selectedProducts.map((item, idx) => (
            <motion.div
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIdx(idx);
              }}
              className={`flex justify-between items-center py-2 px-2 text-primary cursor-pointer ${
                selectedIdx === idx ? "bg-[#ceb395]" : ""
              }`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-1/2">
                <div className="flex items-baseline gap-2">
                  <p className="font-medium">{item.imageTitle}</p>
                  <p className="text-sm text-gray-500">
                    <strong className="text-[10px]">
                      {getSizeName(item.size)}
                    </strong>
                  </p>
                </div>
              </div>
              <p className="w-1/4 text-center">
                {isEditingQty && selectedIdx === idx ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <input
                      type="number"
                      min={1}
                      value={tempQty ?? 1}
                      onChange={(e) => setTempQty(Number(e.target.value))}
                      className="w-12 text-center border rounded"
                    />
                  </div>
                ) : (
                  item.quantity
                )}
              </p>
              <p className="w-1/4 text-right">
                {(item.price[item.size] * (item.quantity || 1)).toFixed(2)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* TOTAL & PAY */}
      <div className="flex gap-[4px] w-full mt-1">
        <div className="flex-[3] h-[60px] bg-primary menu-total flex items-center text-[24px] px-2 text-white">
          <div className="flex justify-between w-full">
            <p>Total</p>
            <p>{`₱ ${total.toFixed(2)}`}</p>
          </div>
        </div>

        <Button
          variant="pay"
          className="flex-[1]"
          disabled={selectedProducts.length === 0}
        >
          PAY
        </Button>
      </div>
    </SectionContainer>
  );
};

export default OrdersView;
