"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import useGlobal from "@/hooks/useGlobal";
import { GET_ALL_PRODUCTS, GET_ALL_CATEGORIES } from "@/app/graphql/query";

//types for raw data
type RawProduct = {
  id: number;
  name: string;
  variants: ProductVariants[];
  category: RawCategory;
};

type ProductVariants = {
  size: "PT" | "RG" | "GR";
  price: number;
};

type RawCategory = {
  name: string;
};

const DataLoader = () => {
  const {
    data: productData,
    loading: loadingProducts,
    error: errorProducts,
  } = useQuery(GET_ALL_PRODUCTS);
  const {
    data: categoryData,
    loading: loadingCategories,
    error: errorCategories,
  } = useQuery(GET_ALL_CATEGORIES);

  const setMenuItems = useGlobal((state) => state.setMenuItems);
  const setMenus = useGlobal((state) => state.setMenus);

  useEffect(() => {
    if (productData?.getAllProducts) {
      const formattedProducts = productData.getAllProducts.map(
        (product: RawProduct) => {
          const prices = {
            PT: product.variants.find((v) => v.size === "PT")?.price ?? 0, //just to make sure that the price is never null/undefined :>
            RG: product.variants.find((v) => v.size === "RG")?.price ?? 0,
            GR: product.variants.find((v) => v.size === "GR")?.price ?? 0,
          };

          return {
            // MenuItem format
            id: product.id,
            name: product.name,
            menu: product.category.name,
            prices,
          };
        }
      );
      console.log("Formatted Products:", formattedProducts); //pang double check ayaw guamana e
      setMenuItems(formattedProducts);
    }

    if (categoryData?.getAllCategories) {
      const formattedMenus = categoryData.getAllCategories.map(
        (menu: RawCategory) => menu.name
      );

      console.log("Formatted Menus:", formattedMenus); //isa kapa
      setMenus(formattedMenus);
    }
  }, [productData, categoryData, setMenuItems, setMenus]);

  if (loadingProducts || loadingCategories) return <p>Loading...</p>;
  if (errorProducts || errorCategories) return <p>Error loading data.</p>;

  return null; // only side effects
};

export default DataLoader;
