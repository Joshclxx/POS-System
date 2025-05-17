"use client";

import React, { useState, useRef, useEffect } from "react";
import SectionContainer from "../SectionContainer";
import Button from "../Button";
import Image from "next/image";
import { useOrderStore } from "@/hooks/useOrder";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";
import toast, { Toaster } from "react-hot-toast";

interface OrdersViewProps {
  isPaying: boolean;
  setIsPaying: Dispatch<SetStateAction<boolean>>;
  setTotal: Dispatch<SetStateAction<number>>;
}

const OrdersView: React.FC<OrdersViewProps> = ({
  isPaying,
  setIsPaying,
  setTotal,
}) => {
  const [selectedOption, setSelectedOption] = useState("DINE IN");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [isEditingQty, setIsEditingQty] = useState(false);
  const [tempQty, setTempQty] = useState<number | null>(null);

  const options = ["DINE IN", "DINE OUT"];
  const selectedProducts = useOrderStore((state) => state.selectedProducts);
  const total = selectedProducts.reduce(
    (acc, item) => acc + item.price[item.size] * (item.quantity || 1),
    0
  );

  // update total in parent
  useEffect(() => {
    setTotal(total);
  }, [total, setTotal]);

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

  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleLongPress = (idx: number) => {
    setSelectedIndexes([idx]);
    setIsEditingQty(true);
    setTempQty(selectedProducts[idx]?.quantity || 1);
  };

  const startLongPress = (idx: number) => {
    longPressTimeout.current = setTimeout(() => handleLongPress(idx), 600);
  };

  const cancelLongPress = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };

  return (
    <SectionContainer background="mt-1 w-full max-w-[428px] h-[914px]">
      <Toaster position="top-center" />
      <AnimatePresence mode="wait">
        <motion.div
          key="dlt"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-[4px] w-full max-w-[428px]">
            <div className="flex justify-between gap-[4px] w-full">
              <Button
                variant="view-dlt"
                isSave={selectedIndexes.length > 0}
                className="flex-1 w-full"
                onClick={() => {
                  if (selectedIndexes.length > 0) {
                    const deletedItems = selectedIndexes
                      .map((i) => selectedProducts[i]?.imageTitle)
                      .filter(Boolean);

                    useOrderStore.setState((state) => {
                      const updated = state.selectedProducts.filter(
                        (_, idx) => !selectedIndexes.includes(idx)
                      );
                      return { selectedProducts: updated };
                    });

                    // Show toast per deleted item or all together
                    toast.success(
                      deletedItems.length === 1
                        ? `${deletedItems[0]} Removed`
                        : `Removed ${deletedItems.length} items`
                    );

                    setSelectedIndexes([]);
                    setIsEditingQty(false);
                    setTempQty(null);
                  }
                }}
              >
                DELETE
              </Button>

              <div className="relative flex-1">
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
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="bg-colorDirtyWhite w-full max-w-[428px] h-[600px] mt-1 p-2 overflow-y-auto">
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

        <div className="divide-y opacity-50 font-semibold">
          {selectedProducts.map((item, idx) => (
            <motion.div
              key={idx}
              onMouseDown={() => startLongPress(idx)}
              onTouchStart={() => startLongPress(idx)}
              onMouseUp={cancelLongPress}
              onMouseLeave={cancelLongPress}
              onTouchEnd={cancelLongPress}
              onClick={(e) => {
                e.stopPropagation();
                if (!isEditingQty) {
                  setSelectedIndexes((prev) =>
                    prev.includes(idx)
                      ? prev.filter((i) => i !== idx)
                      : [...prev, idx]
                  );
                }
              }}
              className={`flex justify-between items-center py-2 px-2 text-primary cursor-pointer ${
                selectedIndexes.includes(idx) ? "bg-[#ceb395]" : ""
              }`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-1/2">
                <div className="flex items-baseline gap-2">
                  <p className="font-semibold">{item.imageTitle}</p>
                  <p className="text-sm text-primary">
                    <strong className="text-[10px]">
                      {getSizeName(item.size)}
                    </strong>
                  </p>
                </div>
              </div>
              <p className="w-1/4 text-center">
                {isEditingQty &&
                selectedIndexes.length === 1 &&
                selectedIndexes[0] === idx ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <input
                      type="number"
                      min={1}
                      value={tempQty ?? 1}
                      onChange={(e) => setTempQty(Number(e.target.value))}
                      onBlur={() => {
                        if (tempQty !== null) {
                          useOrderStore.setState((state) => {
                            const update = [...state.selectedProducts];
                            update[idx].quantity = tempQty;
                            return { selectedProducts: update };
                          });
                        }
                        setIsEditingQty(false);
                        setSelectedIndexes([]);
                        setTempQty(null);
                      }}
                      autoFocus
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

      <div className="flex gap-[4px] w-full mt-1">
        <div className="flex-[3] h-[60px] bg-primary menu-total flex items-center text-[24px] px-2 text-white">
          <div className="flex justify-between w-full">
            <p>Total</p>
            <p>{`₱ ${total.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}</p>
          </div>
        </div>
        <Button
          variant="pay"
          className="flex-[1]"
          disabled={selectedProducts.length === 0}
          onClick={() => setIsPaying((prev) => !prev)}
        >
          {isPaying ? "ORDERS" : "PAY"}
        </Button>
      </div>
    </SectionContainer>
  );
};

export default OrdersView;
