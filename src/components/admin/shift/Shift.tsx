"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import SectionContainer from "../../SectionContainer";
import toast, { Toaster } from "react-hot-toast";
import { useTimer } from "@/hooks/useTimer";
import { useShiftStore } from "@/hooks/useShiftStore";
import ManagerLogin from "../ManagerLogin";
import { useManagerAuth } from "@/hooks/useManagerAuth";
import { useUserStore } from "@/hooks/useUserSession"; // ADDED IMPORT
import { useLogout } from "@/app/utils/handleLogout";
import { handleGraphQLError } from "@/app/utils/handleGraphqlError";
import { CREATE_USER_SHIFT } from "@/app/graphql/mutations";
import { useMutation } from "@apollo/client";


const Shift = () => {
  const router = useRouter();
  const timer = useTimer();
  const { login, logout } = useManagerAuth();
  const {handleLogout} = useLogout()
  const [createUserShift] = useMutation(CREATE_USER_SHIFT)
  // Zustand session (to prevent showing this page after logout)
  const { loggedIn, userRole, sessionId, userId} = useUserStore();

  // Prevent accessing Shift page if not logged in or role is not cashier
  useEffect(() => {
    if (!loggedIn || userRole !== "cashier") {
      router.replace("/login");
    }
  }, [loggedIn, userRole]);

  const [isManagerVerified, setIsManagerVerified] = useState(false); // Set to false by default

  const handleLoginSuccess = (email: string, password: string) => {
    login(email, password);
    setIsManagerVerified(true);
  };

  const handleCloseShift = () => {
    if (!actualCash || parseFloat(actualCash) === 0) {
      return toast.error("Enter cash on hand before shift close.", {
        id: "notif-message",
      });
    }

    toast.success("Shift Closed!", { id: "notif-message" });
    closeShift();
    timer.stop();
    logout(); // manager logout
    localStorage.removeItem("loginTime");

    handleLogout(); // also log out user session
    router.replace("/login"); // ensure full redirect to login
  };

  const {
    isShiftActive,
    startingCash,
    totalSales,
    totalPicked,
    voidRefund,
    openShift,
    closeShift,
  } = useShiftStore();

  const [startCashInput, setStartCashInput] = useState("");
  const [actualCash, setActualCash] = useState("");

  const posCashTotal = useMemo(
    () => totalSales - totalPicked - voidRefund,
    [totalSales, totalPicked, voidRefund]
  );

  const expectedCash = useMemo(
    () => startingCash + posCashTotal - voidRefund,
    [startingCash, posCashTotal, voidRefund]
  );

  const difference = useMemo(
    () => (parseFloat(actualCash) || 0) - expectedCash,
    [actualCash, expectedCash]
  );

  const handleOpenShift = async () => {
    if (!startCashInput) {
      return toast.error("Please enter the Starting Cash first.", {
        id: "notif-message",
      });
    }
    console.log({ sessionId, userId, startCashInput });
    try{
      await createUserShift({
        variables: {
          data: {
            loginHistoryId: sessionId,
            startingCash: parseFloat(startCashInput),
            totalCash: parseFloat(startCashInput),
            userId: userId
          }
        }
      });
      openShift(parseFloat(startCashInput));
      // timer.start();
      router.push("/");
      toast.success("Shift Opened!", { id: "notif-message" });
    } catch (error) {
      console.error(error)
      handleGraphQLError(error)
    }
  };

  // Only show login screen if manager not yet verified
  if (!isShiftActive && !isManagerVerified) {
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
                {/* Cash info blocks */}
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
                  <label className="block mb-1">Void Order (Refund)</label>
                  <input
                    type="number"
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                    value={voidRefund}
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
                    required
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
