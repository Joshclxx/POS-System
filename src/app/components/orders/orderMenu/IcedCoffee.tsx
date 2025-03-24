import React from "react";
import SectionContainer from "../../SectionContainer";
import OrderImageContainer from "../OrderImageContainer";

interface IcedCoffee {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string;
}

const IcedCoffee = () => {
  const orderList: IcedCoffee[] = [
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Iced Moccha latte",
    },
  ];

  return (
    <SectionContainer background="mt-[4px] w-full h-[850px]">
      <div className="bg-colorDirtyWhite w-full h-[710px] flex items-start justify-center text-[14px]">
        <div className="grid grid-cols-3 gap-4 max-h-[710px] overflow-y-auto w-full max-w-[580px] mx-auto">
          {orderList.map((order, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-xl bg-DDD9D6 w-full max-w-[180px] gap-2 p-3"
            >
              <div className="flex flex-col items-center justify-start bg-[#DDD9D6] w-full rounded-[8px] p-3">
                <p className="text-center font-semibold text-primary">
                  {order.imageTitle}
                </p>
                <div className="w-[140px] h-[140px] flex items-center justify-center mt-2">
                  <OrderImageContainer
                    imageSrc={order.imageSrc}
                    imageAlt={order.imageAlt}
                    imageWidth={140}
                    imageHeight={140}
                    className="block"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default IcedCoffee;
