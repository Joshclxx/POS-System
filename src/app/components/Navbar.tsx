"use client";

import { JSX, Key, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "../constants"; // adjust this import based on your file
import Button from "./Button";
import { UrlObject } from "url";

export default function Navbar() {
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isOpenPos, setOpenPos] = useState(false);

  return (
    <>
      <nav className="bg-navbar w-full h-[48px] mt-4 flex items-center z-30 relative">
        <div className="w-full max-w-[1280px] mx-auto flex justify-between items-center px-4">
          {/* MENU AND BUTTON */}
          <div className="flex items-center gap-4 flex-1">
            {/* MENU FEATURES BUTTON */}
            <button onClick={() => setOpenMenu(true)}>
              <Image src="/icon/menu.svg" alt="Menu" width={32} height={32} />
            </button>

            <ul className="flex gap-2">
              {NAV_LINKS.map(
                (link: {
                  key: Key | null | undefined;
                  href: string | UrlObject;
                  label: string | JSX.Element;
                }) => (
                  <li key={link.key}>
                    <Link href={link.href}>
                      <Button variant="navbar">{link.label}</Button>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* POS NAME */}
          <div className="flex-1 flex justify-center">
            <span className="text-primary font-bold text-[32px]">
              HEEBREW CAFE
            </span>
          </div>

          {/* ABOUT POS ICON */}
          <div className="flex items-center justify-end flex-1">
            <button onClick={() => setOpenPos(true)}>
              <img
                src="/icon/pos-icon-dark.svg"
                alt="POS"
                width={32}
                height={32}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* MENU PANEL */}
      {isOpenPos && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setOpenPos(false)}
          />

          <div className="fixed top-2 right-2 h-3/4 w-1/2 bg-primary z-50 shadow-lg rounded-xl transition-transform duration-300 ease-in-out">
            <div className="p-4 flex justify-between">
              <h2 className="text-xl font-bold mb-4">BSIS 32A1 POS SYSTEM </h2>
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
            {/* MENU FEATURES CONTENT */}
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
            {/* MENU FEATURES CONTENT */}
            <div className="flex flex-col w-full items-center justify-center gap-6">
              <div className="flex w-full justify-center gap-12 p-6">
                <Button variant="feature">SPOTCHECK</Button>
                <Button variant="feature">CASH PICK</Button>
              </div>
              <div className="flex w-full justify-center gap-12 p-6">
                <Button variant="feature">PRODUCTS</Button>
                <Button variant="feature">VOID ORDER</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
