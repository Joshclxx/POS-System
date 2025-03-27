import React, { useState } from "react";
import SectionContainer from "../../SectionContainer";
import OrderImageContainer from "../OrderImageContainer";
import { useOrderStore } from "@/hooks/useOrder";

interface TeaItem {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string;
  price: {
    PT: number;
    RG: number;
    GR: number;
  };
}

const Tea = () => {
  const orderList: TeaItem[] = [
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "milk Bliss",
      price: {
        PT: 70,
        RG: 80,
        GR: 95,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Fruit Zest",
      price: {
        PT: 75,
        RG: 85,
        GR: 100,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Citrus Bloom",
      price: {
        PT: 80,
        RG: 90,
        GR: 105,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Honey Twist",
      price: {
        PT: 75,
        RG: 85,
        GR: 100,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Berry Breeze",
      price: {
        PT: 80,
        RG: 90,
        GR: 105,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Matcha Calm",
      price: {
        PT: 90,
        RG: 100,
        GR: 115,
      },
    },
  ];

  const [selectedSizes, setSelectedSizes] = useState<
    Record<number, "PT" | "RG" | "GR">
  >({});

  const handleSizeSelection = (
    index: number,
    size: "PT" | "RG" | "GR",
    item: TeaItem
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

export default Tea;
