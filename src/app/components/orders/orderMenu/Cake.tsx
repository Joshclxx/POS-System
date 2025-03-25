import React from "react";
import SectionContainer from "../../SectionContainer";
import OrderImageContainer from "../OrderImageContainer";

interface CakeItem {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string;
  price: number;
}

const Cake = () => {
  const orderList: CakeItem[] = [
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Soft SLice",
      price: 120,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Berry Bliss",
      price: 130,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Fudge Dream",
      price: 140,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Caramel Drip",
      price: 130,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Velvet Touch",
      price: 150,
    },
  ];

  return (
    <SectionContainer background="mt-[4px] w-full h-[850px]">
      <div className="bg-colorDirtyWhite w-full h-[710px] flex items-start justify-center text-[14px]">
        <div className="grid grid-cols-3 gap-4 max-h-[710px] overflow-y-auto w-full max-w-[580px] mx-auto">
          {orderList.map((Cake, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-xl bg-DDD9D6 w-full max-w-[180px] gap-2 p-3"
            >
              <div className="flex flex-col items-center justify-start bg-[#DDD9D6] w-full rounded-[8px] p-3">
                <p className="item-title text-center">{Cake.imageTitle}</p>

                <OrderImageContainer
                  imageSrc={Cake.imageSrc}
                  imageAlt={Cake.imageAlt}
                  imageWidth={140}
                  imageHeight={140}
                  imagePrice={Cake.price}
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

export default Cake;
