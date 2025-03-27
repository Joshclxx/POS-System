import React, { useState } from "react";
import SectionContainer from "../../SectionContainer";
import OrderImageContainer from "../OrderImageContainer";
import { useOrderStore } from "@/hooks/useOrder";

interface SandwichItem {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string;
  price: {
    PT: number;
    RG: number;
    GR: number;
  };
}

const Sandwich = () => {
  const orderList: SandwichItem[] = [
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Toast Fill",
      price: {
        PT: 85,
        RG: 95,
        GR: 110,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Grill Melt",
      price: {
        PT: 95,
        RG: 105,
        GR: 120,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Cheese Stack",
      price: {
        PT: 100,
        RG: 110,
        GR: 125,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Ham Delight",
      price: {
        PT: 105,
        RG: 115,
        GR: 130,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Egg Sandwich",
      price: {
        PT: 90,
        RG: 100,
        GR: 115,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Club Bite",
      price: {
        PT: 110,
        RG: 120,
        GR: 135,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Chicken Crisp",
      price: {
        PT: 115,
        RG: 125,
        GR: 140,
      },
    },
  ];

  const [selectedSizes, setSelectedSizes] = useState<
    Record<number, "PT" | "RG" | "GR">
  >({});

  const handleSizeSelection = (
    index: number,
    size: "PT" | "RG" | "GR",
    item: SandwichItem
  ) => {
    setSelectedSizes((prev) => ({ ...prev, [index]: size }));

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
            const selectedSize = selectedSizes[index];
            return (
              <div
                key={index}
                className="flex flex-col items-center rounded-xl bg-DDD9D6 w-full max-w-[180px] gap-2 p-3"
              >
                <div className="flex flex-col items-center justify-start bg-[#DDD9D6] w-full rounded-[8px] p-3">
                  <p className="item-title">{item.imageTitle}</p>

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

export default Sandwich;
