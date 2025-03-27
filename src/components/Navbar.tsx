"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { NAV_LINKS, MENU_FEATURE_LINKS } from "@/app/constants";
import Button from "./Button";

// Function to split array into chunks of 2
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

  const chunkedMenu = chunkArray(MENU_FEATURE_LINKS, 2);

  return (
    <>
      <nav className="bg-navbar w-full h-[48px] mt-4 flex items-center z-30 relative">
        <div className="w-full max-w-[1280px] mx-auto flex justify-between items-center px-4">
          {/* LEFT SECTION: Menu + Nav */}
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setOpenMenu(true)}>
              <Image src="/icon/menu.svg" alt="Menu" width={32} height={32} />
            </button>

            <ul className="flex gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href}>
                    <Button variant="navbar">{link.label}</Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CENTER: POS Name */}
          <div className="flex justify-center items-center flex-1">
            <span
              className="text-primary font-bold text-[24px] cursor-pointer"
              onClick={() => setOpenPos(true)}
            >
              HEEBREW CAFE
            </span>
          </div>

          {/* RIGHT SECTION: POS Icon */}
          <div className="flex justify-end items-center flex-1">
            <button onClick={() => setOpenPos(true)}>
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
            <div className="flex flex-col w-full items-center justify-center gap-6 p-4">
              <div className="container bg-colorDirtyWhite w-full h-[580px] rounded-xl">
                <div className="text-center text-primary items-center flex flex-col justify-between px-12">
                  <div className="flex justify-between w-full mt-6">
                    <p className="font-semibold text-[24px]">Version</p>
                    <p className="text-[18px]">v.1.0.0</p>
                  </div>
                  <div className="flex justify-between w-full mt-6">
                    <p className="font-semibold text-[24px]">Developed By</p>
                    <div className="flex flex-col gap-2 text-right mt-2">
                      <p className="text-[18px]">Joshua Colobong</p>
                      <p className="text-[18px]">Jaylord Soguilon</p>
                      <p className="text-[18px]">Jenelyn Manalo</p>
                      <p className="text-[18px]">Mariel Alaan</p>
                      <p className="text-[18px]">Jessie Manila</p>
                      <p className="text-[18px]">Michaella Bacudo</p>
                      <p className="text-[18px]">Alyssa Dizon</p>
                    </div>
                  </div>
                  <div className="flex justify-between w-full mt-6">
                    <p className="font-semibold text-[24px]">Released</p>
                    <p className="text-[18px]">March 2025</p>
                  </div>
                  <div className="flex justify-between w-full mt-6">
                    <p className="font-semibold text-[24px]">Support</p>
                    <p className="text-[18px]">heebrewsupport@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
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

          <div className="fixed top-2 left-2 h-[98%] w-1/2 bg-primary z-50 shadow-lg rounded-xl transition-transform duration-300 ease-in-out">
            <div className="p-4 flex justify-between">
              <h2 className="text-xl font-bold mb-4">Menu Features</h2>

              <button
                onClick={() => setOpenMenu(false)}
                className="text-sm text-gray-500 underline"
              >
                <img
                  src="/icon/exit.svg"
                  alt="Exit"
                  className="w-6 h-6 inline-block"
                />
              </button>
            </div>
            <div className="flex flex-col w-full items-center justify-center gap-6">
              {chunkedMenu.map((row, idx) => (
                <div
                  key={idx}
                  className="flex w-full justify-center gap-12 p-6"
                >
                  {row.map((link) => (
                    <Button
                      key={link.key}
                      variant="feature"
                      onClick={() => {
                        setOpenMenu(false);
                        router.push(link.href);
                      }}
                    >
                      {link.label}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
