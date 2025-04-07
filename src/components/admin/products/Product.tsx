"use client";

import { useState } from "react";
import SectionContainer from "../../SectionContainer";
import Image from "next/image";
import { Drawer } from "vaul";
import React from "react";
import Button from "@/components/Button";
import { motion, AnimatePresence } from "motion/react";
import useGlobal from "@/hooks/useGlobal";

const Product = () => {
  // Drawer state and additional states for add/delete/edit functionality only
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<
    | "menu"
    | "menuItem"
    | "editMenuItem"
    | "deleteMenu"
    | "deleteMenuItem"
    | null
  >(null);

  // Selected item states for delete/edit operations
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);

  // Form states for add/edit operations
  const [newMenuName, setNewMenuName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemMenu, setItemMenu] = useState("");
  const [itemPrices, setItemPrices] = useState({ PT: "", RG: "", GR: "" });

  // Global state functions
  const removeMenu = useGlobal((state) => state.removeMenu);
  const removeMenuItemsByMenu = useGlobal(
    (state) => state.removeMenuItemsByMenu
  );
  const addMenu = useGlobal((state) => state.addMenu);
  const removeMenuItem = useGlobal((state) => state.removeMenuItem);
  const addMenuItem = useGlobal((state) => state.addMenuItem);
  const menu = useGlobal((state) => state.menus);
  const menuItem = useGlobal((state) => state.menuItems);

  // Cancel action and reset states
  const handleCancel = () => {
    setOpenDrawer(false);
    setDrawerMode(null);
    setNewMenuName("");
    setItemName("");
    setItemMenu("");
    setItemPrices({ PT: "", RG: "", GR: "" });
    setSelectedMenu(null);
    setSelectedMenuItem(null);
  };

  // Submit handler for add, edit or delete actions
  const handleSubmit = () => {
    if (drawerMode === "menu") {
      if (newMenuName.trim() !== "") {
        addMenu(newMenuName.trim());
      }
      handleCancel();
    } else if (drawerMode === "menuItem") {
      if (
        itemName.trim() &&
        itemMenu &&
        itemPrices.PT &&
        itemPrices.RG &&
        itemPrices.GR
      ) {
        addMenuItem({
          id: crypto.randomUUID(),
          name: itemName.trim(),
          menu: itemMenu,
          prices: {
            PT: Number(itemPrices.PT),
            RG: Number(itemPrices.RG),
            GR: Number(itemPrices.GR),
          },
        });
      }
      handleCancel();
    } else if (drawerMode === "editMenuItem") {
      if (
        selectedMenuItem &&
        itemName.trim() &&
        itemMenu &&
        itemPrices.PT &&
        itemPrices.RG &&
        itemPrices.GR
      ) {
        // Remove the old menu item and add the updated one (keeping the same id)
        removeMenuItem(selectedMenuItem.id);
        addMenuItem({
          id: selectedMenuItem.id,
          name: itemName.trim(),
          menu: itemMenu,
          prices: {
            PT: Number(itemPrices.PT),
            RG: Number(itemPrices.RG),
            GR: Number(itemPrices.GR),
          },
        });
      }
      handleCancel();
    } else if (drawerMode === "deleteMenu") {
      if (selectedMenu) {
        removeMenu(selectedMenu);
        removeMenuItemsByMenu(selectedMenu);
      }
      handleCancel();
    } else if (drawerMode === "deleteMenuItem") {
      if (selectedMenuItem) {
        removeMenuItem(selectedMenuItem.id);
      }
      handleCancel();
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  // Component for rendering each menu item card (delete only)
  const MenuItemCard = ({ item }: { item: any }) => {
    return (
      <div className="bg-secondaryGray text-primary flex flex-col p-2 rounded-lg">
        <div className="w-full bg-primaryGray flex justify-between items-center p-1 rounded-md mb-2">
          <p className="product-menu text-center">{item.menu}</p>
          <button
            onClick={() => {
              setSelectedMenuItem(item);
              setDrawerMode("deleteMenuItem");
              setOpenDrawer(true);
            }}
          >
            <Image src="/icon/delete.png" alt="delete" width={24} height={24} />
          </button>
        </div>
        <Image
          src="/image/default.svg"
          alt="Product"
          width={105}
          height={105}
          className="mx-auto mb-2"
        />
        <p className="product-name text-center mb-2">{item.name}</p>
        <div className="bg-primaryGray w-full h-[32px] flex items-center justify-center px-4 rounded-md">
          <div className="text-center flex justify-between w-full items-center product-price gap-4">
            <p>₱{item.prices.PT.toFixed(2)}</p>
            <p>₱{item.prices.RG.toFixed(2)}</p>
            <p>₱{item.prices.GR.toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  };

  // Determine the button text based on the drawer mode
  const buttonText =
    drawerMode === "menu"
      ? "Add Menu"
      : drawerMode === "menuItem"
      ? "Add Menu Item"
      : drawerMode === "editMenuItem"
      ? "Save Changes"
      : drawerMode === "deleteMenu" || drawerMode === "deleteMenuItem"
      ? "Confirm Delete"
      : "";

  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <div className="grid grid-cols-12 gap-5 mt-4">
        {/* ADD MENU Section */}
        <div className="col-span-3 bg-colorDirtyWhite rounded-lg text-primary p-2 h-[782px] relative flex flex-col">
          <div className="bg-primary w-full h-[52px] flex items-center justify-center rounded-lg">
            <div className="flex justify-between w-full items-center px-2">
              <p className="text-colorDirtyWhite font-bold text-[24px]">
                ADD MENU
              </p>
              <button
                onClick={() => {
                  setDrawerMode("menu");
                  setOpenDrawer(true);
                }}
              >
                <Image
                  src="/icon/add-dw.svg"
                  alt="Add"
                  width={38}
                  height={38}
                  className="transition-opacity duration-200 hover:opacity-100 cursor-pointer"
                />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mt-4 space-y-2 px-2 hide-scrollbar">
            {menu.length === 0 ? (
              <p className="text-primary font-semibold italic text-center">
                No menu added yet.
              </p>
            ) : (
              menu.map((menuName, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    delay: idx * 0.1,
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                >
                  <div className="flex items-center justify-between bg-secondaryGray p-2 rounded-lg">
                    <span className="menu-title font-bold text-lg">
                      {menuName}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedMenu(menuName);
                        setDrawerMode("deleteMenu");
                        setOpenDrawer(true);
                      }}
                    >
                      <Image
                        src="/icon/delete.png"
                        alt="delete"
                        width={24}
                        height={24}
                      />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          {/* <button
            onClick={() => {
              setDrawerMode("menu");
              setOpenDrawer(true);
            }}
            className="absolute bottom-4 right-4"
          >
            <Image
              src="/icon/add.svg"
              alt="Add"
              width={44}
              height={44}
              className="opacity-80 transition-opacity duration-200 hover:opacity-100"
            />
          </button> */}
        </div>

        {/* ADD MENU ITEM Section */}
        <div className="col-span-9 bg-colorDirtyWhite rounded-lg text-primary p-2 h-[782px] relative flex flex-col">
          <div className="bg-primary w-full h-[52px] flex items-center justify-center rounded-lg">
            <div className="flex justify-between w-full items-center px-2">
              <p className="text-colorDirtyWhite font-bold text-[24px]">
                ADD MENU ITEM
              </p>
              <button
                onClick={() => {
                  setDrawerMode("menuItem");
                  setOpenDrawer(true);
                }}
              >
                <Image
                  src="/icon/add-dw.svg"
                  alt="Add"
                  width={38}
                  height={38}
                  className="transition-opacity duration-200 hover:opacity-100 cursor-pointer"
                />
              </button>
            </div>
          </div>

          <div className="px-2">
            <div className="border-1 borderprimary bg-colorDirtyWhite rounded-md p-1 mt-4">
              <input
                type="text"
                placeholder="Search Product Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto mt-4 px-2 hide-scrollbar">
            {menuItem.length === 0 ? (
              <p className="text-primary text-center font-semibold italic">
                No menu products added yet.
              </p>
            ) : (
              <table className="w-full table-auto text-left">
                <thead className="bg-secondaryGray text-primary sticky top-0 z-20">
                  <tr>
                    <th className="px-4 py-2">Menu</th>

                    <th className="px-4 py-2">Product Name</th>

                    <th className="px-4 py-2">Price PT (₱)</th>

                    <th className="px-4 py-2">Price RG (₱)</th>

                    <th className="px-4 py-2">Price GR (₱)</th>

                    <th className="px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence>
                    {menuItem
                      .filter((item) =>
                        item.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((item, idx) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          // exit={{ opacity: 0 }}
                          transition={{ delay: idx * 0.1, duration: 0.2 }}
                          className="border-b hover:bg-secondaryGray/50"
                        >
                          <td className="px-4 py-2">{item.menu}</td>

                          <td className="px-4 py-2">{item.name}</td>

                          <td className="px-4 py-2">
                            {item.prices.PT.toFixed(2)}
                          </td>

                          <td className="px-4 py-2">
                            {item.prices.RG.toFixed(2)}
                          </td>

                          <td className="px-4 py-2">
                            {item.prices.GR.toFixed(2)}
                          </td>

                          <td className="px-4 py-2 text-center">
                            <div className="flex justify-between items-center w-full px-2">
                              <button
                                onClick={() => {
                                  // Set selected item and prefill form values for editing
                                  setSelectedMenuItem(item);
                                  setItemName(item.name);
                                  setItemMenu(item.menu);
                                  setItemPrices({
                                    PT: item.prices.PT.toString(),
                                    RG: item.prices.RG.toString(),
                                    GR: item.prices.GR.toString(),
                                  });
                                  setDrawerMode("editMenuItem");
                                  setOpenDrawer(true);
                                }}
                              >
                                <Image
                                  src="/icon/edit.svg"
                                  alt="edit"
                                  width={24}
                                  height={24}
                                />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedMenuItem(item);
                                  setDrawerMode("deleteMenuItem");
                                  setOpenDrawer(true);
                                }}
                              >
                                <Image
                                  src="/icon/delete.png"
                                  alt="delete"
                                  width={20}
                                  height={20}
                                  className="hover:bg-secondaryGray/50"
                                />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>

          {/* <button
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
          </button> */}
        </div>
      </div>

      {/* Drawer Component */}
      <Drawer.Root open={openDrawer} onOpenChange={setOpenDrawer}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-1/2 transform -translate-x-1/2 items-center bg-secondary rounded-t-xl p-6 transition-all duration-300 w-[1024px] max-h-[80vh]">
            <div className="text-center text-colorDirtyWhite">
              {drawerMode === "menu" && (
                <p className="text-lg font-semibold">Add Menu</p>
              )}
              {drawerMode === "menuItem" && (
                <p className="text-lg font-semibold">Add Menu Item</p>
              )}
              {drawerMode === "editMenuItem" && (
                <p className="text-lg font-semibold">Edit Menu Item</p>
              )}
              {(drawerMode === "deleteMenu" ||
                drawerMode === "deleteMenuItem") && (
                <p className="text-lg font-semibold">Confirm Delete</p>
              )}
            </div>

            <div className="mt-6 space-y-4 w-[600px] mx-auto">
              {drawerMode === "menu" && (
                <input
                  type="text"
                  placeholder="Menu Name"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-4 py-2 rounded border"
                />
              )}
              {(drawerMode === "menuItem" || drawerMode === "editMenuItem") && (
                <>
                  <div className="flex justify-between w-full gap-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-4 py-2 rounded border"
                    />
                  </div>
                  <div className="flex justify-between w-full gap-4">
                    <select
                      className="w-full px-4 py-2 rounded border"
                      value={itemMenu}
                      onChange={(e) => setItemMenu(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">Select Menu</option>
                      {menu.map((menuName, idx) => (
                        <option key={idx} value={menuName}>
                          {menuName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="number"
                      placeholder="Price PT"
                      value={itemPrices.PT}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        setItemPrices({ ...itemPrices, PT: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded border"
                    />
                    <input
                      type="number"
                      placeholder="Price RG"
                      value={itemPrices.RG}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        setItemPrices({ ...itemPrices, RG: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded border"
                    />
                    <input
                      type="number"
                      placeholder="Price GR"
                      value={itemPrices.GR}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        setItemPrices({ ...itemPrices, GR: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded border"
                    />
                  </div>
                </>
              )}
              {(drawerMode === "deleteMenu" ||
                drawerMode === "deleteMenuItem") && (
                <div className="text-center">
                  {drawerMode === "deleteMenu" && selectedMenu && (
                    <p>
                      Are you sure you want to delete the menu "{selectedMenu}"
                      and all its items?
                    </p>
                  )}
                  {drawerMode === "deleteMenuItem" && selectedMenuItem && (
                    <p>
                      Are you sure you want to delete the product "
                      {selectedMenuItem.name}"?
                    </p>
                  )}
                </div>
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
                {buttonText}
              </Button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </SectionContainer>
  );
};

export default Product;
