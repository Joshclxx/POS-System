"use client";

import { useEffect, useState } from "react";
import SectionContainer from "@/components/SectionContainer";
import Image from "next/image";
import { Drawer } from "vaul";
import React from "react";
import Button from "@/components/Button";
import { motion, AnimatePresence } from "motion/react";
import useGlobal from "@/hooks/useGlobal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/hooks/useUserSession";
import {
  CREATE_CATEGORY,
  CREATE_PRODUCT,
  DELETE_CATEGORY,
  DELETE_PRODUCT,
  UPDATE_CATEGORY,
  UPDATE_PRODUCT,
} from "@/app/graphql/mutations";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  GET_ALL_CATEGORIES,
  GET_ALL_PRODUCTS,
  GET_CATEGORY,
} from "@/app/graphql/query";
import { handleGraphQLError } from "@/app/utils/handleGraphqlError";
import { formatType } from "@/app/utils/capitalized";
import { useLogout } from "@/app/utils/handleLogout";

interface MenuItem {
  id: number;
  name: string;
  menu: string;
  prices: {
    PT: number;
    RG: number;
    GR: number;
  };
}

const Product: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<
    | "menu"
    | "editMenu"
    | "menuItem"
    | "editMenuItem"
    | "deleteMenu"
    | "deleteMenuItem"
    | null
  >(null);

  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );

  const [newMenuName, setNewMenuName] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [itemMenu, setItemMenu] = useState<string>("");
  const [itemPrices, setItemPrices] = useState<{
    PT: string;
    RG: string;
    GR: string;
  }>({ PT: "", RG: "", GR: "" });
  const menus = useGlobal((state) => state.menus);
  const menuItems = useGlobal((state) => state.menuItems);
  const { userRole, loggedIn } = useUserStore.getState();
  const { handleLogout } = useLogout();
  const router = useRouter();

  useEffect(() => {
    console.log(menus);
    if (userRole !== "manager") {
      handleLogout();
      router.replace("/login");
    }
  }, []);

  // Reset form and drawer state
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

  //mutations / query
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [createCategory] = useMutation(CREATE_CATEGORY);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  const [getCategory] = useLazyQuery(GET_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);
  const { refetch: refetchProducts } = useQuery(GET_ALL_PRODUCTS);
  const { refetch: refetchCategories } = useQuery(GET_ALL_CATEGORIES);

  // Submit logic for various drawer modes
  const handleSubmit = async () => {
    if (drawerMode === "menu") {
      if (newMenuName.trim()) {
        try {
          await createCategory({
            variables: {
              data: { name: newMenuName.trim().toLowerCase() },
            },
          });
          // addMenu(newMenuName.trim());
          await refetchCategories();
          toast.success(`${newMenuName} added successfully!`, {
            id: "notif-message",
          });
        } catch (error) {
          handleGraphQLError(error);
        }
      } else {
        toast.error("Please enter a menu name.", { id: "notif-message" });
      }
    } else if (drawerMode === "editMenu" && selectedMenu) {
      try {
        const { data } = await getCategory({
          variables: { name: selectedMenu },
        });
        const categoryId = data?.getCategory?.id;
        await updateCategory({
          variables: {
            id: categoryId,
            name: newMenuName.trim(),
          },
        });
        await refetchCategories();
        await refetchProducts();
        toast.success(`Menu "${selectedMenu}" updated to "${newMenuName}"`, {
          id: "notif-message",
        });
      } catch (error) {
        handleGraphQLError(error);
      }
    } else if (drawerMode === "menuItem") {
      if (
        itemName.trim() &&
        itemMenu &&
        itemPrices.PT &&
        itemPrices.RG &&
        itemPrices.GR
      ) {
        try {
          const { data } = await getCategory({ variables: { name: itemMenu } });
          const categoryId = data?.getCategory?.id;
          await createProduct({
            variables: {
              data: {
                name: itemName,
                variants: [
                  { size: "pt", price: parseFloat(itemPrices.PT) },
                  { size: "rg", price: parseFloat(itemPrices.RG) },
                  { size: "gr", price: parseFloat(itemPrices.GR) },
                ],
                categoryId: parseInt(categoryId),
              },
            },
          });
          await refetchProducts();
          toast.success(`${itemName} added successfully!`, {
            id: "notif-message",
          });
        } catch (error) {
          handleGraphQLError(error);
        }
      } else {
        toast.error("All fields are required to fill out.", {
          id: "notif-message",
        });
      }
    } else if (drawerMode === "editMenuItem" && selectedMenuItem) {
      if (
        itemName.trim() &&
        itemMenu &&
        itemPrices.PT &&
        itemPrices.RG &&
        itemPrices.GR
      ) {
        try {
          await updateProduct({
            variables: {
              id: selectedMenuItem.id,
              edits: {
                name: itemName.trim(),
                variants: [
                  { size: "pt", price: parseFloat(itemPrices.PT) },
                  { size: "rg", price: parseFloat(itemPrices.RG) },
                  { size: "gr", price: parseFloat(itemPrices.GR) },
                ],
              },
            },
          });
          await refetchProducts();
          toast.success(`${itemName} updated successfully!`, {
            id: "notif-message",
          });
        } catch (error) {
          handleGraphQLError(error);
        }
      }
    } else if (drawerMode === "deleteMenu" && selectedMenu) {
      try {
        await deleteCategory({ variables: { name: selectedMenu } });
        await refetchCategories();
        toast.success(`Menu "${selectedMenu}" deleted.`, {
          id: "notif-message",
        });
      } catch (error) {
        handleGraphQLError(error);
      }
    } else if (drawerMode === "deleteMenuItem" && selectedMenuItem) {
      try {
        await deleteProduct({ variables: { id: selectedMenuItem.id } });
        await refetchProducts();
        toast.success(`"${selectedMenuItem.name}" deleted.`, {
          id: "notif-message",
        });
      } catch (error) {
        handleGraphQLError(error);
      }
    }

    handleCancel();
  };

  const [searchTerm, setSearchTerm] = useState<string>("");

  // Determine button text
  const buttonText =
    drawerMode === "menu"
      ? "Add Menu"
      : drawerMode === "editMenu"
      ? "Update Menu"
      : drawerMode === "menuItem"
      ? "Add Menu Item"
      : drawerMode === "editMenuItem"
      ? "Save Changes"
      : drawerMode === "deleteMenu" || drawerMode === "deleteMenuItem"
      ? "Confirm Delete"
      : "";

  if (userRole !== "manager" || !loggedIn) return <div>Loading...</div>;
  return (
    <>
      <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
        <div className="grid grid-cols-12 gap-5 mt-4">
          {/* ADD MENU Section */}
          <div className="col-span-3 bg-colorDirtyWhite rounded-lg text-primary p-2 h-[914px] relative flex flex-col">
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
              {menus.length === 0 ? (
                <p className="text-primary font-semibold italic text-center">
                  No menu added yet.
                </p>
              ) : (
                menus.map((menuName, idx) => (
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
                        {formatType(menuName)}
                      </span>
                      <div className="gap-2 flex">
                        <button
                          onClick={() => {
                            setSelectedMenu(menuName);
                            setNewMenuName(menuName);
                            setDrawerMode("editMenu");
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
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* ADD MENU ITEM SECTION */}
          <div className="col-span-9 bg-colorDirtyWhite rounded-lg text-primary p-2 h-[914px] relative flex flex-col">
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

            <div className="px-2 mt-4 flex justify-between items-center gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search Product Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border"
                />
              </div>
              <Button
                variant="universal"
                onClick={() => {
                  handleLogout();
                  router.replace("/login");
                }}
                className="w-[140px] h-auto bg-colorBlue text-tertiary rounded-3xl px-4 py-2 text-[18px] font-regular"
              >
                Logout
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 px-2 hide-scrollbar">
              {menuItems.length === 0 ? (
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
                      {menuItems
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
                            transition={{ delay: idx * 0.1, duration: 0.2 }}
                            className="border-b hover:bg-secondaryGray/50"
                          >
                            <td className="px-4 py-2">
                              {formatType(item.menu)}
                            </td>
                            <td className="px-4 py-2">
                              {formatType(item.name)}
                            </td>
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
          </div>
        </div>

        {/* Drawer Component */}
        <Drawer.Root open={openDrawer} onOpenChange={setOpenDrawer}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="z-[50] fixed bottom-0 left-1/2 transform -translate-x-1/2 items-center bg-secondary rounded-t-xl p-6 transition-all duration-300 w-[1024px] max-h-[80vh]">
              <Drawer.Title asChild>
                <div className="text-center text-colorDirtyWhite">
                  {drawerMode === "menu" && (
                    <p className="text-lg font-semibold">Add Menu</p>
                  )}
                  {drawerMode === "editMenu" && (
                    <p className="text-lg font-semibold">Edit Menu</p>
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
              </Drawer.Title>

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
                {drawerMode === "editMenu" && (
                  <input
                    type="text"
                    placeholder="Menu Name"
                    value={newMenuName}
                    onChange={(e) => setNewMenuName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-4 py-2 rounded border"
                  />
                )}

                {(drawerMode === "menuItem" ||
                  drawerMode === "editMenuItem") && (
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
                        {menus.map((menuName, idx) => (
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
                        Are you sure you want to delete the menu {selectedMenu}
                        and all its items?
                      </p>
                    )}
                    {drawerMode === "deleteMenuItem" && selectedMenuItem && (
                      <p>
                        Are you sure you want to delete the product{" "}
                        {selectedMenuItem.name}?
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
    </>
  );
};

export default Product;
