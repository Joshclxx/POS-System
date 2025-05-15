"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Button from "@/components/Button";
import SectionContainer from "../../SectionContainer";
import ManagerLogin from "../ManagerLogin";
import { useManagerAuth } from "@/hooks/useManagerAuth";
import { useShiftStore } from "@/hooks/useShiftStore";

const Cashpick = () => {
  const pickCash = useShiftStore((s) => s.pickCash);
  const [amount, setAmount] = useState("");
  const router = useRouter();

  const { isVerified, loading, login, logout } = useManagerAuth();
  console.log("Auth state ->", { isVerified, loading });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(e.target.value);

  const handleConfirm = () => {
    const num = parseFloat(amount.replace(/[^\d.]/g, "")) || 0;
    pickCash(num);
    setAmount("");
    toast.success("Cash Picked");
    router.push("/");
    logout();
  };

  const handleReset = () => setAmount("");
  const isConfirmDisabled = !amount.trim();
  const formatted = amount
    ? parseFloat(amount.replace(/[^\d.]/g, "")).toFixed(2)
    : "0.00";

  const handleLoginSuccess = (email: string, password: string) => {
    localStorage.setItem("userEmail", email);
    login(email, password);
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
        <div className="col-span-12 bg-colorDirtyWhite w-full h-[700px]">
          <div className="flex flex-col items-center px-6 mt-[20px]">
            <div className="flex items-center justify-center w-[414px] h-[52px] bg-secondary rounded-lg">
              <p className="text-tertiary text-[24px] font-bold">CASHPICK</p>
            </div>
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
            <div className="bg-secondary w-full h-[52px] rounded-md mt-4 flex items-center justify-between px-4">
              <span>TOTAL CASHPICK</span>
              <span>₱ {formatted}</span>
            </div>
          </div>
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
