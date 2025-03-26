import React from "react";
import SectionContainer from "../../SectionContainer";
import OrderImageContainer from "../OrderImageContainer";

interface IcedCoffeeItem {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string;
  price: {
    PT: number;
    RG: number;
    GR: number;
  };
}

const IcedCoffee = () => {
  const orderList: IcedCoffeeItem[] = [
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Chill Brew",
      price: {
        PT: 80,
        RG: 90,
        GR: 105,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Ice Mocha",
      price: {
        PT: 90,
        RG: 100,
        GR: 115,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Frost Latte",
      price: {
        PT: 100,
        RG: 110,
        GR: 125,
      },
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Cold Buzz",
      price: {
        PT: 85,
        RG: 95,
        GR: 110,
      },
    },
  ];

  return (
    <SectionContainer background="mt-[4px] w-full h-[850px]">
      <div className="bg-colorDirtyWhite w-full h-[710px] flex items-start justify-center text-[14px]">
        <div className="grid grid-cols-3 gap-4 max-h-[710px] overflow-y-auto w-full max-w-[580px] mx-auto">
          {orderList.map((IcedCoffee, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-xl bg-DDD9D6 w-full max-w-[180px] gap-2 p-3"
            >
              <div className="flex flex-col items-center justify-start bg-[#DDD9D6] w-full rounded-[8px] p-3">
                <p className="item-title text-center">
                  {IcedCoffee.imageTitle}
                </p>

                <OrderImageContainer
                  imageSrc={IcedCoffee.imageSrc}
                  imageAlt={IcedCoffee.imageAlt}
                  imageWidth={140}
                  imageHeight={140}
                  imagePrice={IcedCoffee.price}
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

export default IcedCoffee;
