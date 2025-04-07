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

  // Manager login state
  const [isManagerVerified, setIsManagerVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleManagerLogin = () => {
    if (email === "heebrew@cafe.manager" && password === "Manager01") {
      setIsManagerVerified(true);
      // Keep navbar disabled until shift is fully open
      setShiftActive(true);
      toast.success("Logged in successfully!");
    } else {
      toast.error("Login Denied, Email & Password Incorrect!");
    }
  };

  // When true, the shift has not yet been opened.
  const [isOpenShift, setIsOpenShift] = useState(true);

  // Input fields
  const [startCash, setStartCash] = useState("");
  const [actualCash, setActualCash] = useState("");

  // Calculate derived values
  const expectedCash = React.useMemo(() => {
    const start = parseFloat(startCash) || 0;
    // inA, inB, out would be calculated from your business logic
    const inA = 0;
    const inB = 0;
    const out = 0;
    return start + inA + inB - out;
  }, [startCash]);

  const difference = React.useMemo(() => {
    const actual = parseFloat(actualCash) || 0;
    return actual - expectedCash;
  }, [actualCash, expectedCash]);

  // On mount, check if there is an already open shift saved
  useEffect(() => {
    const storedShift = localStorage.getItem("shiftStatus");
    if (storedShift) {
      const parsedShift = JSON.parse(storedShift);
      if (parsedShift.open) {
        setIsOpenShift(false);
        setStartCash(parsedShift.startCash || "");
        setActualCash(parsedShift.actualCash || "");
        setShiftOpenedAt(parsedShift.shiftOpenedAt || "");
      }
    }
  }, []);

  // Update stored shift data when actualCash changes (if shift is open)
  useEffect(() => {
    if (!isOpenShift) {
      const storedShift = localStorage.getItem("shiftStatus");
      if (storedShift) {
        const parsedShift = JSON.parse(storedShift);
        parsedShift.actualCash = actualCash;
        localStorage.setItem("shiftStatus", JSON.stringify(parsedShift));
      }
    }
  }, [actualCash, isOpenShift]);

  // When opening a shift, persist the shift data and re-enable the navbar.
  const handleOpenShift = () => {
    if (!startCash) {
      toast.error("Please enter the Starting Cash first.");
      return;
    }

    const shiftOpenedAt = new Date().toISOString();

    localStorage.setItem(
      "shiftStatus",
      JSON.stringify({ open: true, startCash, actualCash })
    );
    timer.start();
    // Re-enable the navbar now that the shift is open.
    setShiftActive(false);
    // Redirect to your order menu page (ensure the route exists)
    router.push("/");
  };

  // When closing the shift, clear the saved data and redirect as needed.
  const handleCloseShift = () => {
    toast.success("Shift closed!");
    localStorage.removeItem("shiftStatus");
    timer.stop();
    // You may choose to disable the navbar again or leave it enabled.
    setShiftActive(true);
    router.push("/login");
  };

  const [shiftOpenedAt, setShiftOpenedAt] = useState("");

  // Render Manager Login screen if not verified yet.
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

  // Main Shift screen: display either Open Shift or Close Shift view.
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
