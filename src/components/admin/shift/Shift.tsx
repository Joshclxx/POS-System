"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import SectionContainer from "../../SectionContainer";
import toast, { Toaster } from "react-hot-toast";
import { useShiftStore } from "@/hooks/useShiftStore";
import ManagerLogin from "../ManagerLogin";
import { useManagerAuth } from "@/hooks/useManagerAuth";
import { useUserStore } from "@/hooks/useUserSession";
import { useLogout } from "@/app/utils/handleLogout";
import { handleGraphQLError } from "@/app/utils/handleGraphqlError";
import { CREATE_USER_SHIFT, UPDATE_USER_SHIFT } from "@/app/graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { FETCH_ALL_USER_SHIFT } from "@/app/graphql/query";

const Shift = () => {
  const router = useRouter();
  const { login, logout } = useManagerAuth();
  const { handleLogout } = useLogout();
  const [createUserShift] = useMutation(CREATE_USER_SHIFT);
  const { loggedIn, userRole, sessionId, userId } = useUserStore();
  const [updateUserShift] = useMutation(UPDATE_USER_SHIFT);
  const { data: userShiftData } = useQuery(FETCH_ALL_USER_SHIFT);

  const [isManagerVerified, setIsManagerVerified] = useState(false);
  const [startCashInput, setStartCashInput] = useState("");
  const [actualCash, setActualCash] = useState("");

  const {
    isShiftActive,
    startingCash,
    totalSales,
    totalPicked,
    voidRefund,
    openShift,
    closeShift,
  } = useShiftStore();

  // const { hasHydrated } = useUserStore();

  useEffect(() => {
    // if (!hasHydrated) return;

    if (!loggedIn || userRole !== "cashier") {
      router.replace("/login");
    }
  }, [loggedIn, userRole, router]);

  const handleLoginSuccess = (email: string, password: string) => {
    login(email, password);
    setIsManagerVerified(true);
  };

  const posCashTotal = useMemo(
    () => totalSales - totalPicked - voidRefund,
    [totalSales, totalPicked, voidRefund]
  );

  const expectedCash = useMemo(
    () => startingCash + posCashTotal,
    [startingCash, posCashTotal]
  );

  const difference = useMemo(
    () => (parseFloat(actualCash) || 0) - expectedCash,
    [actualCash, expectedCash]
  );

  const handleOpenShift = async () => {
    if (!startCashInput) {
      router.push("/");
      return toast.error("Please enter the Starting Cash first.", {
        id: "notif-message",
      });
    }

    try {
      await createUserShift({
        variables: {
          data: {
            loginHistoryId: sessionId,
            startingCash: parseFloat(startCashInput),
            userId: userId,
          },
        },
      });

      openShift(parseFloat(startCashInput));
      router.push("/");
      toast.success("Shift Opened!", { id: "notif-message" });
    } catch (error) {
      handleGraphQLError(error);
    }
  };

  const handleCloseShift = async () => {
    if (!actualCash || parseFloat(actualCash) === 0) {
      return toast.error("Enter cash on hand before shift close.", {
        id: "notif-message",
      });
    }

    try {
      if (userShiftData?.userShift?.length > 0) {
        await updateUserShift({
          variables: {
            data: {
              loginHistoryId: sessionId,
              cashpickAmount: totalPicked,
              voidedAmount: voidRefund,
              totalSales: expectedCash,
            },
          },
        });
      }

      toast.success("Shift Closed!", { id: "notif-message" });
      closeShift();
      logout();
      localStorage.removeItem("loginTime");
      handleLogout();
      router.replace("/login");
    } catch (error) {
      handleGraphQLError(error);
    }
  };

  // MANAGER VERIFICATION LOGIN
  if (!isManagerVerified && !isShiftActive) {
    return (
      <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px] bg-colorDirtyWhite">
        <Toaster />
        <ManagerLogin onLoginSuccess={handleLoginSuccess} />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px] bg-colorDirtyWhite">
      <Toaster />
      <div className="container w-[1280px] h-[914px] p-8">
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
                min="0"
                step="0.01"
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
                  value={startingCash.toFixed(2)}
                />
              </div>
              <div>
                <label className="block mb-1">POS Cash Total</label>
                <input
                  type="number"
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                  value={posCashTotal.toFixed(2)}
                />
              </div>
              <div>
                <label className="block mb-1">Void Order (Refund)</label>
                <input
                  type="number"
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                  value={voidRefund.toFixed(2)}
                />
              </div>
              <div>
                <label className="block mb-1">Cash Pick</label>
                <input
                  type="number"
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                  value={totalPicked.toFixed(2)}
                />
              </div>

              <hr className="my-4" />

              <div>
                <label className="block mb-1 font-semibold">
                  POS Expected Cash Amount
                  {difference > 0 && (
                    <span className="ml-2 text-green-600">
                      (Over ₱{Math.abs(difference).toFixed(2)})
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
                  value={expectedCash.toFixed(2)}
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
                  min="0"
                  step="0.01"
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
    </SectionContainer>
  );
};

export default Shift;
