"use client";

import { Drawer as VaulDrawer } from "vaul";
import useGlobal from "@/hooks/useGlobal";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminDrawer() {
  const { showDrawer, setShowDrawer } = useGlobal();

  return (
    <VaulDrawer.Root open={showDrawer} onOpenChange={setShowDrawer}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
        <VaulDrawer.Content className="bg-gray-100 flex flex-col rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none">
          <div className="p-4 bg-white rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
            <div className="max-w-md mx-auto">
              <VaulDrawer.Title className="font-medium mb-4 text-gray-900">
                <div className="flex flex-col justify-center items-center">
                  <div className="container bg-color2 w-[156px] h-[32px] font-semibold border border-color2">
                    <p className="flex flex-col items-center justify-center text-center text-primary">
                      ADD MENU
                    </p>
                  </div>
                </div>
              </VaulDrawer.Title>

              <VaulDrawer.Description>
                <div className="flex flex-row justify-center items-center">
                  <button
                    className="rounded-md transition"
                    onClick={() => setShowDrawer(true)}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <div className="rounded-lg transition hover:bg-secondary">
                        <Image
                          src={"/icon/plus.svg"}
                          alt={"plus"}
                          height={24}
                          width={24}
                        />
                      </div>
                      <p>1</p>
                      <div className="rounded-lg transition hover:bg-secondary">
                        <Image
                          src={"/icon/plus.svg"}
                          alt={"plus"}
                          height={24}
                          width={24}
                        />
                      </div>
                    </div>
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center mt-2">
                  <button
                    className="rounded-lg transition hover-trans"
                    onClick={() => {
                      toast(
                        <div className="flex items-center justify-center w-full text-center">
                          <strong>1 Burger</strong>{" "}
                          <span className="mx-1"></span>is added to cart!
                        </div>
                      );
                    }}
                  >
                    <div className="rounded-lg bg-color1 hover-trans px-[50px] py-[10px]">
                      <p className="text-primary text-center">Add to Cart</p>
                    </div>
                  </button>
                </div>
              </VaulDrawer.Description>
            </div>
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
