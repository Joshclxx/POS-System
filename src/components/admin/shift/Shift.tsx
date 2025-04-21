"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import SectionContainer from "../../SectionContainer";
import toast, { Toaster } from "react-hot-toast";
import { useTimer } from "@/hooks/useTimer";
import { useShiftStore } from "@/hooks/shiftStore";
import ManagerLogin from "../ManagerLogin";
import { useManagerAuth } from "@/hooks/useManagerAuth";

const Shift = () => {
  const router = useRouter();
  const timer = useTimer();
  const { isVerified, login, logout } = useManagerAuth();

  const {
    isShiftActive,
    startingCash,
    totalSales,
    totalPicked,
    openShift,
    closeShift,
  } = useShiftStore();

  const [startCashInput, setStartCashInput] = useState("");
  const [actualCash, setActualCash] = useState("");

  const posCashTotal = useMemo(
    () => totalSales - totalPicked,
    [totalSales, totalPicked]
  );
  const expectedCash = useMemo(
    () => startingCash + posCashTotal,
    [startingCash, posCashTotal]
  );
  const difference = useMemo(
    () => (parseFloat(actualCash) || 0) - expectedCash,
    [actualCash, expectedCash]
  );

  const handleLoginSuccess = (email: string, password: string) => {
    login(email, password);
  };

  const handleOpenShift = () => {
    if (!startCashInput) {
      return toast.error("Please enter the Starting Cash first.");
    }
    openShift(parseFloat(startCashInput));
    timer.start();
    router.push("/");
  };

  const handleCloseShift = () => {
    toast.success("Shift closed!");
    closeShift();
    timer.stop();
    logout();
    router.push("/login");
  };

  if (!isVerified) {
    return (
      <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px] bg-colorDirtyWhite">
        <Toaster />
        <ManagerLogin onLoginSuccess={handleLoginSuccess} />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <Toaster />
      <div className="grid grid-cols-12 mt-4">
        <div className="container bg-colorDirtyWhite w-[1280px] h-[914px] p-8">
          {isShiftActive ? (
            <div>
              <p className="text-[18px] text-primary font-semibold text-center mt-9">
                Specify the cash amount in your drawer at the start of the shift
              </p>
              <div className="px-16 text-primary mt-12">
                <input
                  id="startCash"
                  type="number"
                  placeholder="₱ 0.00"
                  className="w-full px-4 py-2 border border-primary rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={startCashInput}
                  onChange={(e) => setStartCashInput(e.target.value)}
                />
                <button
                  type="button"
                  className="w-full bg-colorBlue text-tertiary py-2 rounded hover:bg-colorBlueDark transition-all duration-300 mt-4"
                  onClick={handleOpenShift}
                >
                  OPEN SHIFT
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[18px] text-primary font-semibold text-center mt-9">
                CLOSE SHIFT
              </p>
              <div className="px-16 text-primary mt-12 space-y-4">
                <div>
                  <label className="block mb-1">Starting Cash</label>
                  <input
                    type="number"
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                    value={startingCash}
                  />
                </div>
                <div>
                  <label className="block mb-1">POS Cash Total</label>
                  <input
                    type="number"
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                    value={posCashTotal}
                  />
                </div>
                <div>
                  <label className="block mb-1">Cash Pick</label>
                  <input
                    type="number"
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                    value={totalPicked}
                  />
                </div>

                <hr className="my-4" />

                <div>
                  <label className="block mb-1 font-semibold">
                    POS Expected Cash Amount
                    {difference > 0 && (
                      <span className="ml-2 text-green-600">
                        (Over ₱{difference.toFixed(2)})
                      </span>
                    )}
                    {difference < 0 && (
                      <span className="ml-2 text-red-600">
                        (Short ₱{Math.abs(difference).toFixed(2)})
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    readOnly
                    value={expectedCash}
                    className={`
                      w-full px-4 py-2 rounded text-gray-900 border
                      ${
                        difference > 0
                          ? "border-green-500"
                          : difference < 0
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                    `}
                  />
                </div>

                <div>
                  <label className="block mb-1">POS Actual Cash on Hand</label>
                  <input
                    type="number"
                    placeholder="₱ 0.00"
                    className="w-full px-4 py-2 border border-primary rounded text-gray-900"
                    value={actualCash}
                    onChange={(e) => setActualCash(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="w-full bg-colorBlue text-tertiary py-2 rounded hover:bg-colorBlueDark transition-all duration-300 mt-4"
                  onClick={handleCloseShift}
                >
                  CLOSE SHIFT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionContainer>
  );
};

export default Shift;
