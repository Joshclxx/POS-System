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

  const [menus, setMenus] = useState<string[]>([]);
  const [newMenuName, setNewMenuName] = useState("");

  const [menuItems, setMenuItems] = useState<
    {
      name: string;
      menu: string;
      prices: { PT: number; RG: number; GR: number };
    }[]
  >([]);

  const [itemName, setItemName] = useState("");
  const [itemMenu, setItemMenu] = useState("");
  const [itemPrices, setItemPrices] = useState({ PT: "", RG: "", GR: "" });

  const handleCancel = () => {
    setOpenDrawer(false);
    setNewMenuName("");
    setItemName("");
    setItemMenu("");
    setItemPrices({ PT: "", RG: "", GR: "" });
  };

  const handleSubmit = () => {
    if (drawerMode === "menu" && newMenuName.trim() !== "") {
      setMenus([...menus, newMenuName.trim()]);
      setNewMenuName("");
      setOpenDrawer(false);
    } else if (
      drawerMode === "menuItem" &&
      itemName.trim() &&
      itemMenu &&
      itemPrices.PT &&
      itemPrices.RG &&
      itemPrices.GR
    ) {
      setMenuItems([
        ...menuItems,
        {
          name: itemName.trim(),
          menu: itemMenu,
          prices: {
            PT: Number(itemPrices.PT),
            RG: Number(itemPrices.RG),
            GR: Number(itemPrices.GR),
          },
        },
      ]);
      setItemName("");
      setItemMenu("");
      setItemPrices({ PT: "", RG: "", GR: "" });
      setOpenDrawer(false);
    }
  };

  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <div className="grid grid-cols-12 gap-5 mt-4">
        {/* ADD MENU */}
        <div className="col-span-3 bg-colorDirtyWhite rounded-lg text-primary p-2 h-[782px] relative">
          <div className="bg-primary w-full h-[52px] flex items-center justify-center rounded-lg">
            <p className="text-colorDirtyWhite font-bold text-[24px] text-center">
              ADD MENU
            </p>
          </div>
          <div className="flex items-center justify-center w-full flex-col mt-4 px-2 space-y-2">
            {menus.length === 0 ? (
              <p className="text-primary font-semibold italic">
                No menu added yet.
              </p>
            ) : (
              menus.map((menu, idx) => (
                <div key={idx} className="w-full">
                  <p className="bg-secondaryGray w-full h-auto p-2 rounded-lg text-center menu-title">
                    {menu}
                  </p>
                </div>
              ))
            )}
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
        <div className="col-span-9 bg-colorDirtyWhite rounded-lg text-primary p-2 h-[782px] relative">
          <div className="bg-primary w-full h-[52px] flex items-center justify-center rounded-lg">
            <p className="text-colorDirtyWhite font-bold text-[24px] text-center">
              ADD MENU ITEM
            </p>
          </div>
          <div className="w-full mt-4 px-2">
            {menuItems.length === 0 ? (
              <p className="text-primary text-center font-semibold italic">
                No menu items added yet.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-4 mt-4 w-full">
                {menuItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-secondaryGray w-full text-primary flex flex-col p-2 rounded-lg"
                  >
                    <div className="w-full bg-primaryGray mb-2">
                      <p className="product-menu text-center">{item.menu}</p>
                    </div>
                    <Image
                      src="/image/default.svg"
                      alt="Product"
                      width={105}
                      height={105}
                      className="mx-auto mb-2"
                    />
                    <p className="product-name text-center mb-2">{item.name}</p>
                    <div className="bg-primaryGray w-full h-[32px] flex items-center justify-center px-4">
                      <div className="text-center flex justify-between w-full items-center product-price gap-4">
                        <p>₱{item.prices.PT.toFixed(2)}</p>
                        <p>₱{item.prices.RG.toFixed(2)}</p>
                        <p>₱{item.prices.GR.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          <Drawer.Content className="fixed bottom-0 left-1/2 transform -translate-x-1/2 items-center bg-secondary rounded-t-xl p-6 transition-all duration-300 w-[1024px] max-h-[80vh]">
            <div className="text-center text-colorDirtyWhite">
              <p className="text-lg font-semibold">
                {drawerMode === "menu" ? "Add Menu" : "Add Menu Item"}
              </p>
            </div>

            <div className="mt-6 space-y-4 w-[600px] mx-auto">
              {drawerMode === "menu" ? (
                <input
                  type="text"
                  placeholder="Menu Name"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  className="w-full px-4 py-2 rounded border"
                />
              ) : (
                <>
                  <div className="flex justify-between w-full gap-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="w-full px-4 py-2 rounded border"
                    />
                  </div>
                  <div className="flex justify-between w-full gap-4">
                    <select
                      className="w-full px-4 py-2 rounded border"
                      value={itemMenu}
                      onChange={(e) => setItemMenu(e.target.value)}
                    >
                      <option value="">Select Menu</option>
                      {menus.map((menu, idx) => (
                        <option key={idx} value={menu}>
                          {menu}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="number"
                      placeholder="Price PT"
                      value={itemPrices.PT}
                      onChange={(e) =>
                        setItemPrices({ ...itemPrices, PT: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded border"
                    />
                    <input
                      type="number"
                      placeholder="Price RG"
                      value={itemPrices.RG}
                      onChange={(e) =>
                        setItemPrices({ ...itemPrices, RG: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded border"
                    />
                    <input
                      type="number"
                      placeholder="Price GR"
                      value={itemPrices.GR}
                      onChange={(e) =>
                        setItemPrices({ ...itemPrices, GR: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded border"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-4 mt-6 w-[600px] mx-auto">
              <Button
                variant="cancel"
                className="w-full"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button variant="add" className="w-full" onClick={handleSubmit}>
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
