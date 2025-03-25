import React from "react";
import SectionContainer from "../../SectionContainer";
import OrderImageContainer from "../OrderImageContainer";

interface CookiesItem {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string;
  price: number;
}

const Cookies = () => {
  const orderList: CookiesItem[] = [
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Chip Bite",
      price: 50,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Oat Choco",
      price: 55,
    },
    {
      imageSrc: "/image/default.svg",
      imageAlt: "Espresso",
      imageTitle: "Sugar Crunch",
      price: 50,
    },
  ];

  return (
    <SectionContainer background="mt-[4px] w-full h-[850px]">
      <div className="bg-colorDirtyWhite w-full h-[710px] flex items-start justify-center text-[14px]">
        <div className="grid grid-cols-3 gap-4 max-h-[710px] overflow-y-auto w-full max-w-[580px] mx-auto">
          {orderList.map((Cookies, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-xl bg-DDD9D6 w-full max-w-[180px] gap-2 p-3"
            >
              <div className="flex flex-col items-center justify-start bg-[#DDD9D6] w-full rounded-[8px] p-3">
                <p className="item-title text-center">{Cookies.imageTitle}</p>

                <OrderImageContainer
                  imageSrc={Cookies.imageSrc}
                  imageAlt={Cookies.imageAlt}
                  imageWidth={140}
                  imageHeight={140}
                  imagePrice={Cookies.price}
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

export default Cookies;
