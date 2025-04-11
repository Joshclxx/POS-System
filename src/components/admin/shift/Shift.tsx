"use client";

import React, { useState, useEffect } from "react";
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
  const { setShiftActive } = useShiftStore();
  const { isVerified } = useManagerAuth();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpenShift, setIsOpenShift] = useState(true);
  const [startCash, setStartCash] = useState("");
  const [actualCash, setActualCash] = useState("");
  const [shiftOpenedAt, setShiftOpenedAt] = useState("");
  const [managerName, setManagerName] = useState("Joshclxx"); // Assuming dynamic assignment
  const [shiftManager, setShiftManager] = useState("JaylordFPH"); // Assuming dynamic assignment

  // Compute expectedCash and difference (profit/loss)
  const expectedCash = parseFloat(startCash) || 0;
  const difference = expectedCash - (parseFloat(actualCash) || 0);

  useEffect(() => {
    const storedShift = localStorage.getItem("shiftDetails");
    if (storedShift) {
      const parsedShift = JSON.parse(storedShift);
      if (parsedShift.open) {
        setIsOpenShift(false);
        setStartCash(parsedShift.startCash || "");
        setActualCash(parsedShift.actualCash || "");
        setShiftOpenedAt(parsedShift.shiftOpenedAt || "");
      } else {
        setIsOpenShift(true);
      }
      setShiftActive(!parsedShift.open);
    } else {
      setShiftActive(true);
      setIsOpenShift(true);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isOpenShift) {
      const storedShift = localStorage.getItem("shiftDetails");
      if (storedShift) {
        const parsedShift = JSON.parse(storedShift);
        parsedShift.actualCash = actualCash;
        localStorage.setItem("shiftDetails", JSON.stringify(parsedShift));
      }
    }
  }, [actualCash, isOpenShift]);

  const handleOpenShift = () => {
    if (!startCash) {
      toast.error("Please enter the Starting Cash first.");
      return;
    }

    const shiftOpenedAt = new Date().toISOString();

    localStorage.setItem(
      "shiftDetails",
      JSON.stringify({ open: true, startCash, actualCash, shiftOpenedAt })
    );
    timer.start();
    setShiftActive(false);
    router.push("/");
  };

  const handleCloseShift = () => {
    toast.success("Shift closed!");
    localStorage.removeItem("shiftDetails");
    timer.stop();

    setShiftActive(false);
    setIsOpenShift(true);
    router.push("/login");
  };

  useEffect(() => {
    console.log("Manager Verification Status (isVerified):", isVerified);
  }, [isVerified]);

  if (!isLoaded) return null;

  if (isVerified === undefined) {
    return <div>Loading...</div>;
  }

  if (!isVerified) {
    return (
      <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px] bg-colorDirtyWhite">
        <ManagerLogin />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <Toaster />
      <div className="grid grid-cols-12 mt-4">
        <div className="container bg-colorDirtyWhite w-[1280px] h-[914px] p-8">
          {isOpenShift ? (
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
                  value={startCash}
                  onChange={(e) => setStartCash(e.target.value)}
                />
                <button
                  type="button"
                  className="w-full bg-colorBlue text-tertiary py-2 rounded hover:bg-colorBlueDark hover:scale-102 transition-all duration-300 mt-4"
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
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <div className="flex gap-2">
                      <p className="font-bold">Shift Opened:</p>
                      <p>{shiftManager}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="font-bold">Manager On Duty:</p>
                      <p>{managerName}</p>
                    </div>
                  </div>
                  <div>
                    <p>{shiftOpenedAt}</p>
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Starting Cash</label>
                  <input
                    type="number"
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                    value={startCash}
                  />
                </div>
                <div>
                  <label className="block mb-1">Cash Refund (Voided)</label>
                  <input
                    type="number"
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                    value={371}
                  />
                </div>
                <div>
                  <label className="block mb-1">POS Cash Total</label>
                  <input
                    type="number"
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                    value={7324}
                  />
                </div>
                <div>
                  <label className="block mb-1">Cash Pick</label>
                  <input
                    type="number"
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                    value={2000}
                  />
                </div>
                <hr className="my-4" />
                <div>
                  <label className="block mb-1 font-semibold">
                    POS Expected Cash Amount
                  </label>
                  <input
                    type="number"
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                    value={expectedCash}
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
                <div className="mt-4">
                  <p className="font-semibold">
                    Shift Status:{" "}
                    {difference === 0
                      ? "No Profit/Loss"
                      : difference > 0
                      ? `Profit ₱${difference.toFixed(2)}`
                      : `Loss ₱${Math.abs(difference).toFixed(2)}`}
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full bg-colorBlue text-tertiary py-2 rounded hover:bg-colorBlueDark hover:scale-102 transition-all duration-300 mt-4"
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
