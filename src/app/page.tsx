import OrdersMenu from "./components/orders/OrdersMenu";
import OrdersQueue from "./components/orders/OrdersQueue";
import OrdersView from "./components/orders/OrdersView";
import SectionContainer from "./components/SectionContainer";

export default function Home() {
  return (
    <SectionContainer background="w-full h-[914px] flex items-center">
      <div className="bg-bgWhite p-[4px] flex justify-center w-full">
        <div className="flex gap-4 w-full max-w-[1280px]">
          <OrdersView />
          <OrdersMenu />
          <OrdersQueue />
        </div>
      </div>
    </SectionContainer>
  );
}
