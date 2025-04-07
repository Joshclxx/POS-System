"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_LINKS, MENU_FEATURE_LINKS } from "@/app/constants";
import Button from "./Button";
import { useShiftStore } from "@/hooks/shiftStore";

// Function to split an array into chunks of a given size
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export default function Navbar() {
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isOpenPos, setOpenPos] = useState(false);
  const router = useRouter();
  const { isShiftActive } = useShiftStore();

  const chunkedMenu = chunkArray(MENU_FEATURE_LINKS, 2);

  // (Optional) Check localStorage on mount if needed
  useEffect(() => {
    const storedShift = localStorage.getItem("shiftStatus");
    if (storedShift) {
      const parsedShift = JSON.parse(storedShift);
      // If a shift is already open, you may want to re-enable navbar actions.
      // Otherwise, the navbar remains disabled.
      // In this example, we leave the state as controlled by the store.
    }
  }, []);

  // Centralize navigation so that it doesn't run when the navbar is disabled.
  const handleNavigation = (href: string) => {
    if (!isShiftActive) {
      router.push(href);
    }
  };

  return (
    // The entire navbar is wrapped in a div that disables pointer events when isShiftActive is true.
    <div className={`${isShiftActive ? "pointer-events-none opacity-50" : ""}`}>
      <nav className="bg-navbar w-full h-[48px] mt-4 flex items-center z-30 relative">
        <div className="w-full max-w-[1280px] mx-auto flex justify-between items-center px-4">
          {/* LEFT SECTION: Menu + Nav */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => {
                if (!isShiftActive) setOpenMenu(true);
              }}
            >
              <Image src="/icon/menu.svg" alt="Menu" width={32} height={32} />
            </button>

            <ul className="flex gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={isShiftActive ? "#" : link.href}>
                    <Button
                      variant="navbar"
                      onClick={() => {
                        if (!isShiftActive) handleNavigation(link.href);
                      }}
                    >
                      {link.label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CENTER: POS Name */}
          <div className="flex justify-center items-center flex-1">
            <span
              className="text-primary font-bold text-[24px] cursor-pointer"
              onClick={() => {
                if (!isShiftActive) setOpenPos(true);
              }}
            >
              HEEBREW CAFE
            </span>
          </div>

          {/* RIGHT SECTION: POS Icon */}
          <div className="flex justify-end items-center flex-1">
            <button
              onClick={() => {
                if (!isShiftActive) setOpenPos(true);
              }}
            >
              <Image
                src="/icon/pos-icon-dark.svg"
                alt="POS"
                width={32}
                height={32}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* POS PANEL */}
      {isOpenPos && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setOpenPos(false)}
          />
          <div className="fixed top-2 right-2 h-3/4 w-1/2 bg-primary z-50 shadow-lg rounded-xl transition-transform duration-300 ease-in-out">
            <div className="p-4 flex justify-between">
              <h2 className="text-xl font-bold mb-4">BSIS 32A1 POS SYSTEM</h2>
              <button
                onClick={() => setOpenPos(false)}
                className="text-primary underline"
              >
                <img
                  src="/icon/exit.svg"
                  alt="Exit"
                  className="w-6 h-6 inline-block"
                />
              </button>
            </div>
            {/* POS Panel content */}
          </div>
        </>
      )}

      {/* MENU PANEL */}
      {isOpenMenu && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setOpenMenu(false)}
          />
          <div className="fixed top-2 left-2 h-[50%] w-1/4 bg-primary z-50 shadow-lg border-1 border-primaryGray transition-transform duration-300 ease-in-out">
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-center flex-1">
                Menu Features
              </h2>
              <button
                onClick={() => setOpenMenu(false)}
                className="text-sm text-primaryGray underline"
              >
                <img
                  src="icon/exit.svg" // Removed the leading slash here
                  alt="Exit"
                  className="w-6 h-6 inline-block"
                />
              </button>
            </div>

            <div className="flex flex-col w-full items-start gap-2 mt-8 px-6">
              {chunkedMenu.flat().map((link, idx) => (
                <div key={link.key} className="w-full">
                  <button
                    className="text-base text-left transition-colors w-full py-2"
                    onClick={() => {
                      if (!isShiftActive) {
                        setOpenMenu(false);
                        handleNavigation(link.href);
                      }
                    }}
                  >
                    {link.label}
                  </button>
                  {idx < chunkedMenu.flat().length - 1 && (
                    <hr className="border-primaryGray w-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
