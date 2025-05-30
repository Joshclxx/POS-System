// This component handles the Cash Pick operation for managers.
// It ensures the manager is authenticated, collects the amount to be picked to avoid drawer cash overflow,
// confirms the action, and logs the manager out after completion.

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Button from "@/components/Button";
import SectionContainer from "@/components/SectionContainer";
import ManagerLogin from "@/components/admin/ManagerLogin";
import { useManagerAuth } from "@/hooks/useManagerAuth";
import { useShiftStore } from "@/hooks/useShiftStore";

const Cashpick = () => {
  // Hook to update the picked cash amount
  const pickCash = useShiftStore((s) => s.pickCash);

  // State to store the amount input
  const [amount, setAmount] = useState("");

  // Router to redirect after confirmation
  const router = useRouter();

  // Auth hook for manager login/logout
  // login, ---> removed for a while
  const { logout, login } = useManagerAuth();

  // State to track if the manager is verified
  const [isManagerVerified, setIsManagerVerified] = useState(false);

  // Handle input field change and update the amount state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(e.target.value);

  // Confirm action: parse amount, call pickCash, reset input, show toast, redirect, and logout
  const handleConfirm = async () => {
    const num = parseFloat(amount.replace(/[^\d.]/g, "")) || 0;
    pickCash(num);
    setAmount("");
    toast.success("Cash Picked", { id: "notif-message" });
    router.push("/");
    logout();
  };

  // Reset input value
  const handleReset = () => setAmount("");

  // Disable confirm button if input is empty or only whitespace
  const isConfirmDisabled = !amount.trim();

  // Format input amount to two decimal places
  const formatted = amount
    ? parseFloat(amount.replace(/[^\d.]/g, "")).toFixed(2)
    : "0.00";

  // Callback when manager login is successful
  const handleLoginSuccess = async (email: string, password: string) => {
    const loggedInAt = "Cashpick"

    const success = await login(email, password, loggedInAt);

    if (success) {
      setIsManagerVerified(true);
    }
  };

  // If manager is not yet verified, show login screen
  if (!isManagerVerified) {
    return (
      <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px] bg-colorDirtyWhite">
        <Toaster />
        <ManagerLogin onLoginSuccess={handleLoginSuccess} />
      </SectionContainer>
    );
  }

  // Main Cashpick UI for verified managers
  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <Toaster />
      <div className="grid grid-cols-12 mt-4">
        <div className="col-span-12 bg-colorDirtyWhite w-full h-[700px]">
          {/* Header */}
          <div className="flex flex-col items-center px-6 mt-[20px]">
            <div className="flex items-center justify-center w-[414px] h-[52px] bg-secondary rounded-lg">
              <p className="text-tertiary text-[24px] font-bold">CASHPICK</p>
            </div>

            {/* Amount Input Section */}
            <div className="w-full max-w-[1280px] bg-secondary h-[439px] rounded-md mt-10">
              <div className="text-center mt-12 font-semibold text-[24px]">
                AMOUNT
              </div>
              <div className="flex items-center justify-center">
                <input
                  type="text"
                  placeholder="₱ 0.00"
                  value={amount}
                  onChange={handleChange}
                  className="bg-colorDirtyWhite/80 text-primary text-center h-[52px] w-[581px] rounded-lg border-2 border-primary"
                />
              </div>
            </div>

            {/* Display Total Cashpick */}
            <div className="bg-secondary w-full h-[52px] rounded-md mt-4 flex items-center justify-between px-4">
              <span>TOTAL CASHPICK</span>
              <span>₱ {formatted}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex justify-end gap-4 pr-6">
            <Button
              variant="universal"
              className="w-[172px] h-[44px] bg-colorRed text-tertiary rounded-3xl"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="universal"
              disabled={isConfirmDisabled}
              className={`w-[172px] h-[44px] rounded-3xl ${
                isConfirmDisabled
                  ? "bg-colorGreen opacity-50 cursor-not-allowed"
                  : "bg-colorGreen text-tertiary"
              }`}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Cashpick;
