"use client";

import React, { useState } from "react";
import SectionContainer from "../SectionContainer";
import OrderImageContainer from "./OrderImageContainer";
import { useOrderStore } from "@/hooks/useOrder";
import useGlobal, { MenuItem } from "@/hooks/useGlobal";
import { motion } from "motion/react";
import { toast, Toaster } from "react-hot-toast";

interface OrderMenuItemsProps {
  activeMenu: string;
}

const OrderMenuItems: React.FC<OrderMenuItemsProps> = ({ activeMenu }) => {
  const menuItems = useGlobal((state) => state.menuItems) as MenuItem[];
  const shownToasts = new Set<string>();

  const filteredItems = menuItems.filter(
    (item) => item.menu.toLowerCase() === activeMenu.toLowerCase()
  );

  const [selectedSizes, setSelectedSizes] = useState<
    Record<string, "PT" | "RG" | "GR">
  >({});

  const handleSizeSelection = (
    id: number,
    size: "PT" | "RG" | "GR",
    item: MenuItem
  ): void => {
    setSelectedSizes((prev) => ({ ...prev, [id]: size }));

    useOrderStore.getState().addProduct({
      ...item,
      size,
      imageTitle: item.name,
      price: item.prices,
      imageSrc: "",
      imageAlt: "",
    });

    const toastId = `${item.id}-${size}`;
    if (!shownToasts.has(toastId)) {
      toast.success(`${item.name} (${size}) added to order`, {
        id: "menu-item",
      });
      shownToasts.add(toastId);
    }
  };

  return (
    <SectionContainer background="mt-[4px] w-[585px] h-[850px]">
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <div className="bg-colorDirtyWhite w-[585px] h-[710px] flex items-start justify-center text-[14px]">
        <div className="grid grid-cols-3 gap-4 max-h-[710px] overflow-y-auto w-[585px] mx-auto hide-scrollbar">
          {filteredItems.length === 0 ? (
            <p className="col-span-3 primary-title flex justify-center items-center text-center w-full h-[710px]">
              No items available
            </p>
          ) : (
            filteredItems.map((item, idx) => {
              const selectedSize = selectedSizes[item.id] || "";
              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center rounded-xl bg-DDD9D6 w-full max-w-[180px] gap-2 p-3"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      scale: {
                        type: "spring",
                        visualDuration: 0.4,
                        bounce: 0.5,
                        delay: idx * 0.1,
                      },
                    }}
                  >
                    <div className="flex flex-col items-center justify-start bg-[#DDD9D6] w-full rounded-[8px]">
                      <p className="item-title text-center">{item.name}</p>
                      <OrderImageContainer
                        imageSrc="/image/default.svg"
                        imageAlt={item.name}
                        imagePrice={item.prices}
                        imageWidth={140}
                        imageHeight={140}
                        selectedSize={selectedSize}
                        onSizeChange={(size: "PT" | "RG" | "GR") =>
                          handleSizeSelection(item.id, size, item)
                        }
                      />
                    </div>
                  </motion.div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </SectionContainer>
  );
};

export default OrderMenuItems;

// Make the transaction recorded in Orders history.
// Make the shift transaction recorded and saved to determine the POS collected CASH. -> Connect it to spotcheck, void order, and close shift.
// Create a DISCOUNT interface and function, and make it recorded. Fixed discount 20% for senior and pwd.
