import React, { useState } from "react";
import SectionContainer from "../../SectionContainer";
import OrderImageContainer from "../OrderImageContainer";
import { useOrderStore } from "@/hooks/useOrder";
import useGlobal from "@/hooks/useGlobal";

// Define the interface for a menu item.
interface MenuItem {
  id: string;
  name: string;
  menu: string;
  prices: {
    PT: number;
    RG: number;
    GR: number;
  };
}

const Espresso: React.FC = () => {
  // Retrieve menuItems from the global state.
  const menuItems = useGlobal((state) => state.menuItems) as MenuItem[];

  // Filter out items that belong to the "espresso" menu.
  const espressoItems = menuItems.filter(
    (item) => item.menu?.toLowerCase() === "espresso"
  );

  // State to keep track of the selected size for each item.
  const [selectedSizes, setSelectedSizes] = useState<
    Record<number, "PT" | "RG" | "GR">
  >({});

  const handleSizeSelection = (
    index: number,
    size: "PT" | "RG" | "GR",
    item: MenuItem
  ): void => {
    setSelectedSizes((prev) => ({ ...prev, [index]: size }));
    // Add the product to the order with the expected properties.
    useOrderStore.getState().addProduct({
      ...item,
      size,
      imageTitle: item.name, // Map name to imageTitle.
      price: item.prices,
      imageSrc: "",
      imageAlt: "",
    });
  };

  return (
    <SectionContainer background="mt-[4px] w-full h-[850px]">
      <div className="bg-colorDirtyWhite w-full h-[710px] flex items-start justify-center text-[14px]">
        <div className="grid grid-cols-3 gap-4 max-h-[710px] overflow-y-auto w-full max-w-[580px] mx-auto">
          {espressoItems.length === 0 ? (
            <p className="col-span-3 primary-title flex justify-center items-center text-center w-full h-[710px]">
              No espresso items available
            </p>
          ) : (
            espressoItems.map((item, index) => {
              const selectedSize = selectedSizes[index] || "";
              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center rounded-xl bg-DDD9D6 w-full max-w-[180px] gap-2 p-3"
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
                        handleSizeSelection(index, size, item)
                      }
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </SectionContainer>
  );
};

export default Espresso;
