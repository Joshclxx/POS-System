import React, { useState } from "react";
import SectionContainer from "../../SectionContainer";
import OrderImageContainer from "../OrderImageContainer";
import { useOrderStore } from "@/hooks/useOrder";

interface CakeItem {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string;
  price: {
    PT: number;
    RG: number;
    GR: number;
  };
}

const Cake = () => {
  const orderList: CakeItem[] = [
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Soft SLice",
      price: {
        PT: 110,
        RG: 120,
        GR: 135,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Berry Bliss",
      price: {
        PT: 120,
        RG: 130,
        GR: 145,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Fudge Dream",
      price: {
        PT: 130,
        RG: 140,
        GR: 155,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Caramel Drip",
      price: {
        PT: 120,
        RG: 130,
        GR: 145,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Velvet Touch",
      price: {
        PT: 140,
        RG: 150,
        GR: 165,
      },
    },
  ];

  const [selectedSizes, setSelectedSizes] = useState<
    Record<number, "PT" | "RG" | "GR">
  >({});

  const handleSizeSelection = (
    index: number,
    size: "PT" | "RG" | "GR",
    item: CakeItem
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

export default Cake;
