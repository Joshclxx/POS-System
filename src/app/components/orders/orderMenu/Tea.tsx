import React from "react";
import SectionContainer from "../../SectionContainer";
import OrderImageContainer from "../OrderImageContainer";

interface TeaItem {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string;
  price: number;
}

const Tea = () => {
  const orderList: TeaItem[] = [
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "milk Bliss",
      price: 80,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Fruit Zest",
      price: 85,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Citrus Bloom",
      price: 90,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Honey Twist",
      price: 85,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Berry Breeze",
      price: 90,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Matcha Calm",
      price: 100,
    },
  ];

  return (
    <SectionContainer background="mt-[4px] w-full h-[850px]">
      <div className="bg-colorDirtyWhite w-full h-[710px] flex items-start justify-center text-[14px]">
        <div className="grid grid-cols-3 gap-4 max-h-[710px] overflow-y-auto w-full max-w-[580px] mx-auto">
          {orderList.map((TeaItem, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-xl bg-DDD9D6 w-full max-w-[180px] gap-2 p-3"
            >
              <div className="flex flex-col items-center justify-start bg-[#DDD9D6] w-full rounded-[8px] p-3">
                <p className="item-title text-center">{TeaItem.imageTitle}</p>

                <OrderImageContainer
                  imageSrc={TeaItem.imageSrc}
                  imageAlt={TeaItem.imageAlt}
                  imageWidth={140}
                  imageHeight={140}
                  imagePrice={TeaItem.price}
                  className="block"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default Tea;
