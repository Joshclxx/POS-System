import React from "react";
import SectionContainer from "../../SectionContainer";
import OrderImageContainer from "../OrderImageContainer";

interface SandwichItem {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string;
  price: number;
}

const Sandwich = () => {
  const orderList: SandwichItem[] = [
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Toast Fill",
      price: 95,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Grill Melt",
      price: 105,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Cheese Stack",
      price: 110,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Ham Delight",
      price: 115,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Egg Sandwich",
      price: 100,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Club Bite",
      price: 120,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Chicken Crisp",
      price: 125,
    },
  ];

  return (
    <SectionContainer background="mt-[4px] w-full h-[850px]">
      <div className="bg-colorDirtyWhite w-full h-[710px] flex items-start justify-center text-[14px]">
        <div className="grid grid-cols-3 gap-4 max-h-[710px] overflow-y-auto w-full max-w-[580px] mx-auto">
          {orderList.map((Sandwich, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-xl bg-DDD9D6 w-full max-w-[180px] gap-2 p-3"
            >
              <div className="flex flex-col items-center justify-start bg-[#DDD9D6] w-full rounded-[8px] p-3">
                <p className="item-title">{Sandwich.imageTitle}</p>

                <OrderImageContainer
                  imageSrc={Sandwich.imageSrc}
                  imageAlt={Sandwich.imageAlt}
                  imageWidth={140}
                  imageHeight={140}
                  imagePrice={Sandwich.price}
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

export default Sandwich;
