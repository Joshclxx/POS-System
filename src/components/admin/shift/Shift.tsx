"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SectionContainer from "../../SectionContainer";
import toast, { Toaster } from "react-hot-toast";
import { useTimer } from "@/hooks/useTimer";
import { useShiftStore } from "@/hooks/shiftStore";

const Shift = () => {
  const router = useRouter();
  const timer = useTimer();
  const { setShiftActive } = useShiftStore();

  // ✅ Add loading flag
  const [isLoaded, setIsLoaded] = useState(false);

  // Manager login state
  const [isManagerVerified, setIsManagerVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleManagerLogin = () => {
    if (email === "heebrew@cafe.manager" && password === "Manager01") {
      setIsManagerVerified(true);
      localStorage.setItem("isManagerVerified", "true");
      // When the manager is verified, we assume the cashier functions become enabled.
      setShiftActive(false);
      toast.success("Logged in successfully!");
    } else {
      toast.error("Login Denied, Email & Password Incorrect!");
    }
  };

  const [isOpenShift, setIsOpenShift] = useState(true);
  const [startCash, setStartCash] = useState("");
  const [actualCash, setActualCash] = useState("");

  const expectedCash = React.useMemo(() => {
    const start = parseFloat(startCash) || 0;
    // You can update inA, inB, and out when those values are available.
    const inA = 0;
    const inB = 0;
    const out = 0;
    return start + inA + inB - out;
  }, [startCash]);

  const difference = React.useMemo(() => {
    const actual = parseFloat(actualCash) || 0;
    return actual - expectedCash;
  }, [actualCash, expectedCash]);

  const [shiftOpenedAt, setShiftOpenedAt] = useState("");

  useEffect(() => {
    // Use a dedicated key for shift details
    const storedShift = localStorage.getItem("shiftDetails");
    if (storedShift) {
      const parsedShift = JSON.parse(storedShift);
      if (parsedShift.open) {
        // When open is true, we’re in an active shift so the UI should show the close shift view.
        setIsOpenShift(false);
        setStartCash(parsedShift.startCash || "");
        setActualCash(parsedShift.actualCash || "");
        setShiftOpenedAt(parsedShift.shiftOpenedAt || "");
      } else {
        setIsOpenShift(true);
      }

      // Update the state of the register (disabled/enabled) based on the stored object.
      setShiftActive(!parsedShift.open);
    } else {
      setShiftActive(true);
      setIsOpenShift(true);
    }

    const verified = localStorage.getItem("isManagerVerified");
    if (verified === "true") {
      setIsManagerVerified(true);
    }

    // ✅ Set loaded after localStorage hydration
    setIsLoaded(true);
  }, []);

  // Keep shift details updated if actual cash changes while shift is active.
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

    // Save the shift details using a different key.
    localStorage.setItem(
      "shiftDetails",
      JSON.stringify({ open: true, startCash, actualCash, shiftOpenedAt })
    );
    timer.start();
    // When a shift is opened, disable the navbar actions.
    setShiftActive(false);
    router.push("/");
  };

  const handleCloseShift = () => {
    toast.success("Shift closed!");
    localStorage.removeItem("shiftDetails");
    localStorage.removeItem("isManagerVerified");
    timer.stop();
    // When a shift is closed, re-enable navbar actions.
    setShiftActive(true);
    router.push("/login");
  };

  // Don’t render until data is loaded from localStorage
  if (!isLoaded) return null;

  if (!isManagerVerified) {
    return (
      <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px] bg-colorDirtyWhite">
        <Toaster />
        <div className="flex flex-col justify-center items-center h-screen">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Manager Login
          </h2>
          <input
            type="email"
            placeholder="Manager Email"
            className="mb-2 px-4 py-2 border border-primary rounded w-[500px] text-primary placeholder:text-primary"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-4 px-4 py-2 border border-primary rounded w-[500px] text-primary placeholder:text-primary"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-colorBlue text-white px-6 py-2 rounded hover:bg-colorBlueDark transition-all"
            onClick={handleManagerLogin}
          >
            Verify Manager
          </button>
        </div>
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
                      <p>JaylordFPH</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="font-bold">Manager On Duty:</p>
                      <p>Joshclxx</p>
                    </div>
                  </div>
                  <div>
                    <p>Time & Date</p>
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
