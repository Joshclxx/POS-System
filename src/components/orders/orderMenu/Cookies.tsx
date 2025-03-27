import React, { useState } from "react";
import SectionContainer from "../../SectionContainer";
import OrderImageContainer from "../OrderImageContainer";
import { useOrderStore } from "@/hooks/useOrder";

interface CookiesItem {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string;
  price: {
    PT: number;
    RG: number;
    GR: number;
  };
}

const Cookies = () => {
  const orderList: CookiesItem[] = [
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Chip Bite",
      price: {
        PT: 40,
        RG: 50,
        GR: 65,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Oat Choco",
      price: {
        PT: 45,
        RG: 55,
        GR: 70,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Sugar Crunch",
      price: {
        PT: 40,
        RG: 50,
        GR: 65,
      },
    },
  ];

  const [selectedSizes, setSelectedSizes] = useState<
    Record<number, "PT" | "RG" | "GR">
  >({});

  const handleSizeSelection = (
    index: number,
    size: "PT" | "RG" | "GR",
    item: CookiesItem
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

export default Cookies;
