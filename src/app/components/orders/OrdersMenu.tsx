import OrderImageContainer from "./OrderImageContainer";
import SectionContainer from "../SectionContainer";
import Button from "../Button";
import Image from "next/image";

interface Order {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string;
  sizes: string[];
}

const orderList: Order[] = [
  {
    imageSrc: "/image/espresso.png",
    imageAlt: "Espresso",
    imageTitle: "Espresso Creation",
    sizes: ["Solo", "Duo", "Grande"],
  },
  {
    imageSrc: "/image/milktea.png",
    imageAlt: "MilkTea",
    imageTitle: "Signature MilkTea",
    sizes: ["Regular", "Tall", "Venti"],
  },
  {
    imageSrc: "/image/fruittea.png",
    imageAlt: "Fruit Tea",
    imageTitle: "Refreshing Fruit Tea",
    sizes: ["Regular", "Tall", "Venti"],
  },
  {
    imageSrc: "/image/sandwich.png",
    imageAlt: "Sandwich",
    imageTitle: "Gourmet Sandwich",
    sizes: ["Petite", "Classic", "Grande"],
  },
  {
    imageSrc: "/image/cookies.png",
    imageAlt: "Cookies",
    imageTitle: "Cookies & Bread",
    sizes: ["Bite", "Classic", "Platter"],
  },
  {
    imageSrc: "/image/cake.png",
    imageAlt: "Cake",
    imageTitle: "Decadent Cake",
    sizes: ["Slice", "Personal", "Party"],
  },
];

const orderLarge: Order[] = [
  {
    imageSrc: "/image/combo.svg",
    imageAlt: "Combo",
    imageTitle: "Sulit Combo Deals",
    sizes: ["Solo", "Duo", "Family"],
  },
  {
    imageSrc: "/image/combo.svg",
    imageAlt: "Merch",
    imageTitle: "Heebrew Merchandise",
    sizes: ["Solo", "Duo", "Family"],
  },
];

const OrdersMenu = () => {
  return (
    <SectionContainer background="mt-1 w-full max-w-[580px]">
      <div className="flex flex-wrap justify-center items-center w-full max-w-[580px] mx-auto gap-4">
        {/* SMALL MENU IMAGE CONTAINERS */}
        {orderList.map((order, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-xl bg-bgWhite w-full max-w-[180px] h-auto gap-2"
          >
            {/* IMAGE */}
            <div className="flex items-center justify-center bg-[#DDD9D6] w-full rounded-[8px] p-3">
              <div className="flex flex-col items-center justify-center menu-title">
                <p className="text-center font-semibold text-white menu-title">
                  {order.imageTitle}
                </p>
                <div className="flex items-center justify-center w-[140px] h-[140px]">
                  <div className="w-[140px] h-[140px] flex items-center justify-center">
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
            </div>
            <div className="flex flex-col gap-1 w-full mt-[2px]">
              {order.sizes.map((label, btnIndex) => (
                <div className="relative flex">
                  <div
                    key={btnIndex}
                    className="inline-flex items-center justify-between bg-secondaryGray w-[180px] h-[22px] text-primary text-[12px] font-medium rounded-[4px] px-2"
                  >
                    {label}

                    <Image
                      src="/icon/arrowdown.png"
                      alt="DropDown"
                      height={15}
                      width={15}
                      className="ml-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* LARGE IMAGE CONTAINERS */}
      <div className="flex flex-wrap justify-center items-center w-full max-w-[580px] mx-auto gap-4 mt-4">
        {orderLarge.map((order, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-xl bg-bgWhite w-[48%] max-w-[280px] h-auto gap-2"
          >
            <div className="flex items-center justify-center bg-[#DDD9D6] w-full rounded-[8px] p-3">
              <div className="flex flex-col items-center justify-center w-full">
                <p className="text-center font-semibold menu-title text-white">
                  {order.imageTitle}
                </p>

                <div className="flex items-center justify-center w-[288px] h-[75px] pt-9">
                  <OrderImageContainer
                    imageSrc={order.imageSrc}
                    imageAlt={order.imageAlt}
                    imageWidth={288}
                    imageHeight={85}
                    className="flex items-center justify-center w-full h-full"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full mt-[2px]">
              {order.sizes.map((label, btnIndex) => (
                <div key={btnIndex} className="relative flex justify-center">
                  <div className="flex items-center justify-between bg-secondaryGray w-[278.39px] h-[22px] text-primary text-[12px] font-medium rounded-[4px] px-2">
                    <span className="flex-1 text-left">{label}</span>
                    <Image
                      src="/icon/arrowdown.png"
                      alt="DropDown"
                      height={15}
                      width={15}
                      className="ml-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default OrdersMenu;
