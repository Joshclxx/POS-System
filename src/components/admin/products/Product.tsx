"use client";

import { useState } from "react";
import SectionContainer from "../../SectionContainer";
import Image from "next/image";
import { Drawer } from "vaul";
import React from "react";
import Button from "@/components/Button";

const Product = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"menu" | "menuItem" | null>(
    null
  );

  const handleCancel = () => {
    setOpenDrawer(false);
  };

  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <div className="grid grid-cols-12 gap-5 mt-4">
        {/* ADD MENU */}
        <div className="col-span-3 bg-colorDirtyWhite rounded-lg text-primary p-1 h-[782px] relative">
          <div className="bg-primary w-full h-[52px] flex items-center justify-center rounded-lg">
            <p className="text-colorDirtyWhite font-bold text-[24px] text-center">
              ADD MENU
            </p>
          </div>
          <button
            onClick={() => {
              setDrawerMode("menu");
              setOpenDrawer(true);
            }}
          >
            <Image
              src="/icon/add.svg"
              alt="Add"
              width={44}
              height={44}
              className="opacity-80 transition-opacity duration-200 hover:opacity-100 absolute bottom-4 right-4"
            />
          </button>
        </div>

        {/* ADD MENU ITEM */}
        <div className="col-span-9 bg-colorDirtyWhite rounded-lg text-primary p-1 h-[782px] relative">
          <div className="bg-primary w-full h-[52px] flex items-center justify-center rounded-lg">
            <p className="text-colorDirtyWhite font-bold text-[24px] text-center">
              ADD MENU ITEM
            </p>
          </div>

          <button
            onClick={() => {
              setDrawerMode("menuItem");
              setOpenDrawer(true);
            }}
            className="absolute bottom-4 right-4"
          >
            <Image
              src="/icon/add.svg"
              alt="Add"
              width={44}
              height={44}
              className="opacity-80 transition-opacity duration-200 hover:opacity-100 cursor-pointer"
            />
          </button>
        </div>
      </div>

      {/* Drawer */}
      <Drawer.Root open={openDrawer} onOpenChange={setOpenDrawer}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-secondary rounded-t-xl p-6 transition-all duration-300 max-h-[80vh] overflow-y-auto">
            <div className="text-center text-colorDirtyWhite">
              <p className="text-lg font-semibold">
                {drawerMode === "menu" ? "Add Menu" : "Add Menu Item"}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {drawerMode === "menu" ? (
                <>
                  <input
                    type="text"
                    placeholder="Menu Name"
                    className="w-full px-4 py-2 rounded border"
                  />
                  <input
                    type="text"
                    placeholder="Size"
                    className="w-full px-4 py-2 rounded border"
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Product Name"
                    className="w-full px-4 py-2 rounded border"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    className="w-full px-4 py-2 rounded border"
                  />
                  <select className="w-full px-4 py-2 rounded border">
                    <option value="">Select Menu</option>
                    <option value="Menu A">Menu A</option>
                    <option value="Menu B">Menu B</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Size"
                    className="w-full px-4 py-2 rounded border"
                  />
                </>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                variant="cancel"
                className="w-full"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button variant="add" className="w-full" onClick={handleCancel}>
                {drawerMode === "menu" ? "Add Menu" : "Add Menu Item"}
              </Button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </SectionContainer>
  );
};

export default Product;
