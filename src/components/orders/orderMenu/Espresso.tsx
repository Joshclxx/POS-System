import React, { useState } from "react";
import SectionContainer from "../../SectionContainer";
import OrderImageContainer from "../OrderImageContainer";
import { useOrderStore } from "@/hooks/useOrder";

interface EspressoItem {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string;
  price: {
    PT: number;
    RG: number;
    GR: number;
  };
}

const Espresso = () => {
  const orderList: EspressoItem[] = [
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Full Crema",
      price: {
        PT: 65,
        RG: 75,
        GR: 90,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Classic Shot",
      price: {
        PT: 55,
        RG: 65,
        GR: 80,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Intense Brew",
      price: {
        PT: 60,
        RG: 70,
        GR: 85,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Golden Pull",
      price: {
        PT: 70,
        RG: 80,
        GR: 95,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Pure Shot",
      price: {
        PT: 60,
        RG: 70,
        GR: 85,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Dark Roast",
      price: {
        PT: 55,
        RG: 65,
        GR: 80,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Strong Brew",
      price: {
        PT: 50,
        RG: 60,
        GR: 75,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Espresso Fix",
      price: {
        PT: 60,
        RG: 70,
        GR: 85,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Black Gold",
      price: {
        PT: 55,
        RG: 65,
        GR: 80,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Bold Kick",
      price: {
        PT: 75,
        RG: 85,
        GR: 100,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Smooth Shot",
      price: {
        PT: 60,
        RG: 70,
        GR: 85,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Rich Brew",
      price: {
        PT: 65,
        RG: 75,
        GR: 90,
      },
    },
  ];

  // Track selected sizes
  const [selectedSizes, setSelectedSizes] = useState<
    Record<number, "PT" | "RG" | "GR">
  >({});

  // Handle both size selection and adding to cart
  const handleSizeSelection = (
    index: number,
    size: "PT" | "RG" | "GR",
    item: EspressoItem
  ) => {
    // Update UI state first for immediate feedback
    setSelectedSizes((prev) => ({ ...prev, [index]: size }));

    // Then add to cart
    useOrderStore.getState().addProduct({
      ...item,
      size,
    });
  };

  return (
    <SectionContainer background="mt-[4px] w-full h-[850px]">
      <div className="bg-colorDirtyWhite w-full h-[710px] flex items-start justify-center text-[14px]">
        <div className="grid grid-cols-3 gap-4 max-h-[710px] overflow-y-auto w-full max-w-[580px] mx-auto">
          {orderList.map((item, index) => {
            const selectedSize = selectedSizes[index]; // could be undefined
            const displaySize = selectedSize || "PT"; // fallback for price display only
            const displayPrice = item.price[displaySize];
            return (
              <div
                key={index}
                className="flex flex-col items-center rounded-xl bg-DDD9D6 w-full max-w-[180px] gap-2 p-3"
              >
                <div className="flex flex-col items-center justify-start bg-[#DDD9D6] w-full rounded-[8px]">
                  <p className="item-title text-center">{item.imageTitle}</p>

                  <OrderImageContainer
                    imageSrc={item.imageSrc}
                    imageAlt={item.imageAlt}
                    imagePrice={item.price}
                    imageWidth={140}
                    imageHeight={140}
                    selectedSize={selectedSize}
                    onSizeChange={(size) =>
                      handleSizeSelection(index, size, item)
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
};

export default Espresso;
