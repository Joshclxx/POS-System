"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_LINKS, MENU_FEATURE_LINKS } from "@/app/constants";
import Button from "./Button";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/hooks/useUserSession";
import ImageLogoContainer from "./ImageLogoContainer";

// Utility function to chunk an array into smaller arrays of specified size
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export default function Navbar() {
  // State declarations
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isOpenPos, setOpenPos] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const router = useRouter();
  const { userRole } = useUserStore.getState();

  // Hide navbar if user is manager or admin
  useEffect(() => {
    if (userRole === "manager" || userRole === "admin") {
      setIsManager(true);
    }
  }, [userRole]);

  const { userEmail } = useUserStore.getState();

  // Skip rendering if manager/admin
  if (isManager) return null;

  const chunkedMenu = chunkArray(MENU_FEATURE_LINKS, 2);

  // Navigation handler
  const handleNavigation = (href: string) => {
    router.push(href);
  };

  // Icon list for POS Powered By Logo
  const ImageLogo = [
    { src: "/icon/nextjs.svg", alt: "Next JS", label: "Next.JS" },
    { src: "/icon/ts.svg", alt: "Typescript", label: "Typescript" },
    { src: "/icon/react.svg", alt: "React", label: "React" },
    { src: "/icon/tailwind.svg", alt: "Tailwind", label: "Tailwind CSS" },
    { src: "/icon/prisma.svg", alt: "Prisma", label: "Prisma" },
    { src: "/icon/graphql.svg", alt: "GraphQL", label: "GraphQL" },
    { src: "/icon/mysql.svg", alt: "MySQLl", label: "MySQL" },
    { src: "/icon/apollo.svg", alt: "Apollo", label: "Apollo" },
    { src: "/icon/electron.svg", alt: "Electron", label: "Electron" },
    { src: "/icon/git.svg", alt: "Git", label: "Git" },
    { src: "/icon/github.svg", alt: "GitHub", label: "GitHub" },
    { src: "/icon/node.svg", alt: "NodeJs", label: "Node.JS" },
    { src: "/icon/figma.svg", alt: "Figma", label: "Figma" },
  ];

  return (
    <>
      {/* Navbar Header */}
      <nav className="bg-navbar w-full h-[48px] mt-4 flex items-center z-30 relative">
        <div className="w-full max-w-[1280px] mx-auto flex justify-between items-center px-4">
          {/* Left: Menu Button & Nav Links */}
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setOpenMenu(true)}>
              <Image src="/icon/menu.svg" alt="Menu" width={32} height={32} />
            </button>

            <ul className="flex gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href}>
                    <Button
                      variant="navbar"
                      onClick={() => handleNavigation(link.href)}
                    >
                      {link.label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Center: App Title */}
          <div className="flex justify-center items-center flex-1">
            <span
              className="text-primary font-bold text-[24px] cursor-pointer"
              onClick={() => setOpenPos(true)}
            >
              HEEBREW CAFE
            </span>
          </div>

          {/* Right: POS Icon */}
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

      {/* POS Panel Modal */}
      <AnimatePresence>
        {isOpenPos && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
              onClick={() => setOpenPos(false)}
            />

            {/* POS Panel Content */}
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-6 right-6 h-[60%] w-[400px] bg-[#1C1F26] rounded-xl z-50 border border-gray-700 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 flex justify-between items-center bg-[#121417] border-b border-gray-600">
                <h2 className="text-lg font-bold tracking-wide text-white">
                  BSIS 32A1 POS SYSTEM
                </h2>
                <button
                  onClick={() => setOpenPos(false)}
                  className="text-white text-base font-bold bg-red-600 hover:bg-red-700 w-8 h-8 rounded-full flex items-center justify-center transition"
                >
                  X
                </button>
              </div>

              {/* Body */}
              <div className="p-5 text-white flex-grow overflow-y-auto text-sm">
                {/* User Info */}
                <div className="flex justify-between mb-4">
                  <span className="text-gray-300">CASHIER</span>
                  <span>{userEmail || "Unknown User"}</span>
                </div>

                <hr className="border-gray-600 mb-4" />

                {/* Developer Credits */}
                <div className="mb-4 text-center">
                  <span className="block text-tertiary mb-4">DEVELOPED BY</span>
                  <div className="flex flex-col gap-2">
                    {[
                      ["Colobong, Joshua", "Frontend"],
                      ["Soguilon, Jaylord", "Backend"],
                      ["Manalo, Jenelyn", "Wireframe"],
                      ["Alaan, Mariel Krisjean", "Documentation"],
                      ["Bacudo, Michaella", "Documentation"],
                      ["Manila, Jessie Nino", "Documentation"],
                      ["Dizon, Allyssa", "Documentation"],
                    ].map(([name, role]) => (
                      <div key={name} className="flex justify-between">
                        <p>{name}</p>
                        <p>{role}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-600 mb-4" />

                {/* Powered By Logos */}
                <div className="flex flex-col items-center">
                  <p className="text-gray-300">POWERED BY</p>
                  <div className="mt-6 grid grid-cols-4 gap-6 justify-items-center text-center mx-auto">
                    {ImageLogo.map((item, idx) => (
                      <ImageLogoContainer key={idx} {...item} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 text-center text-gray-400 text-xs border-t border-gray-700">
                © {new Date().getFullYear()}. All rights reserved.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Menu Feature Panel Modal */}
      {isOpenMenu && (
        <AnimatePresence>
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
              onClick={() => setOpenMenu(false)}
            />

            {/* Menu Feature Panel Content */}
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-6 left-6 h-auto w-[280px] bg-[#1C1F26] rounded-xl z-50 border border-gray-700 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 flex justify-between items-center bg-primary border-b border-gray-600">
                <h2 className="text-lg font-semibold text-white flex-1 text-center">
                  Menu Features
                </h2>
                <button
                  onClick={() => setOpenMenu(false)}
                  className="text-white text-base font-bold bg-red-600 hover:bg-red-700 w-8 h-8 rounded-full flex items-center justify-center transition"
                >
                  X
                </button>
              </div>

              {/* Menu Items List */}
              <div className="flex flex-col w-full items-start p-6 gap-1 mt-6 px-4 text-white text-sm overflow-y-auto">
                {chunkedMenu.flat().map((link, idx) => (
                  <div key={link.key} className="w-full">
                    <button
                      className="text-left w-full py-2 px-3 rounded-md hover:bg-gray-700 transition"
                      onClick={() => {
                        setOpenMenu(false);
                        handleNavigation(link.href);
                      }}
                    >
                      {link.label}
                    </button>
                    {idx < chunkedMenu.flat().length - 1 && (
                      <hr className="border-gray-700 w-full" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        </AnimatePresence>
      )}
    </>
  );
}
