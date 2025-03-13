import OrderImageContainer from "./OrderImageContainer";
import SectionContainer from "../SectionContainer";
import Button from "../Button";

interface Order {
  imageSrc: string;
  imageAlt: string;
  imageTitle: string;
  sizes: string[];
}

const orderList: Order[] = [
  {
    imageSrc: "/image/espresso.svg",
    imageAlt: "Espresso",
    imageTitle: "Espresso Creation",
    sizes: ["Solo", "Duo", "Grande"],
  },
  {
    imageSrc: "/image/milktea.svg",
    imageAlt: "MilkTea",
    imageTitle: "Signature MilkTea",
    sizes: ["Regular", "Tall", "Venti"],
  },
  {
    imageSrc: "/image/fruittea.svg",
    imageAlt: "Fruit Tea",
    imageTitle: "Refreshing Fruit Tea",
    sizes: ["Regular", "Tall", "Venti"],
  },
  {
    imageSrc: "/image/sandwich.svg",
    imageAlt: "Sandwich",
    imageTitle: "Gourmet Sandwich",
    sizes: ["Petite", "Classic", "Grande"],
  },
  {
    imageSrc: "/image/cookies.svg",
    imageAlt: "Cookies",
    imageTitle: "Cookies & Bread",
    sizes: ["Bite", "Classic", "Platter"],
  },
  {
    imageSrc: "/image/cake.svg",
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
    imageAlt: "Deals",
    imageTitle: "Best Sellers",
    sizes: ["Solo", "Duo", "Family"],
  },
];

const OrdersMenu = () => {
  return (
    <SectionContainer background="mt-1 w-full max-w-[580px]">
      <div className="flex flex-wrap justify-between items-center w-full max-w-[580px] mx-auto gap-4">
        {/* SMALL MENU IMAGE CONTAINERS */}
        {orderList.map((order, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-xl bg-bgWhite w-full max-w-[180px] h-auto gap-2"
          >
            {/* IMAGE */}
            <div className="flex items-center justify-center bg-primaryGray w-full rounded-[8px] p-3">
              <div className="flex flex-col menu-title items-center justify-center">
                <p className="container rounded-md w-full bg-primaryGray border-2 text-center font-semibold menu-title text-white drop-shadow-[0_2px_2px_#131a15]">
                  {order.imageTitle}
                </p>
                <div className="flex items-center justify-center w-[140px] h-[140px]">
                  <OrderImageContainer
                    imageSrc={order.imageSrc}
                    imageAlt={order.imageAlt}
                    imageWidth={140}
                    imageHeight={140}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full mt-[2px]">
              {order.sizes.map((label, btnIndex) => (
                <Button key={btnIndex} variant="size" className="flex-1">
                  {label}
                </Button>
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
            <div className="flex items-center justify-center bg-primaryGray w-full rounded-[8px] p-3">
              <div className="flex flex-col items-center justify-center w-full">
                <p className="container rounded-md w-full bg-primaryGray border-2 text-center font-semibold menu-title text-white drop-shadow-[0_2px_2px_#131a15]">
                  {order.imageTitle}
                </p>

                <div className="flex items-center justify-center w-[288px] h-[107px] pt-9">
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
                <Button key={btnIndex} variant="largeSize" className="flex-1">
                  {label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default OrdersMenu;
