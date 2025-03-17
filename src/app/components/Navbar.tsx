"use client";

import Link from "next/link";
import React from "react";
import { NAV_LINKS } from "../constants";
import Button from "./Button";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="bg-navbar w-full h-[48px] mt-4 flex items-center">
      <div className="w-full max-w-[1280px] mx-auto flex justify-between items-center px-4">
        {/* MENU AND BUTTON */}
        <div className="flex items-center gap-4 flex-1">
          <Image src="/icon/menu.svg" alt="Menu" width={32} height={32} />
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

        {/* POS NAME HEEBREW */}
        <div className="flex-1 flex justify-center">
          <span className="text-primary font-bold text-[32px]">
            HEEBREW CAFE
          </span>
        </div>

        {/* ABOUT POS ICON */}
        <div className="flex items-center justify-end flex-1">
          <Image src="/icon/posInfo.svg" alt="POS" width={32} height={32} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
