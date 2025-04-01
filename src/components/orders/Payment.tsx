"use client";

import React, { useState } from "react";
import SectionContainer from "../SectionContainer";

type PaymentProps = {
  amountType: string;
  setAmountType: React.Dispatch<React.SetStateAction<string>>;
  itemAmount: number;
  onBackToOrders: () => void;
};

const Payment = ({
  amountType,
  setAmountType,
  itemAmount,
  onBackToOrders,
}: PaymentProps) => {
  const handleKeyClick = (key: string) => {
    if (key === "←") {
      setAmountType((prev) => prev.slice(0, -1));
    } else if (key === "Exact Amount") {
      setAmountType(itemAmount.toFixed(2));
    } else if (key === "1000" || key === "500") {
      setAmountType(key);
    } else if (!isNaN(Number(key)) || key === ".") {
      setAmountType((prev) => (prev === "0.00" ? key : prev + key));
    }
  };

  const [finalAmount, setFinalAmount] = useState<number | null>(null);
  const [change, setChange] = useState<number>(0);

  const handleConfirm = () => {
    const amount = parseFloat(amountType);
    if (!isNaN(amount)) {
      setFinalAmount(amount);
      setChange(amount - itemAmount);
      setAmountType("0.00");
      setOkPressed(true);
    }
  };

  const getButtonStyles = (key: string) => {
    switch (key) {
      case "Exact Amount":
        return "bg-secondary text-white text-md";
      case "1000":
        return "bg-colorBlue text-white text-md";
      case "500":
        return "bg-colorOrange text-white text-md";
      case "OK":
        return "bg-colorGreen text-white text-md";
      default:
        return "bg-primaryGray text-primary text-xl";
    }
  };

  const [okPressed, setOkPressed] = useState(false);

  return (
    <SectionContainer background="mt-1 w-[900px] h-auto">
      <div className="flex flex-col w-full bg-colorDirtyWhite p-4 gap-6">
        {/* Details Container */}
        <div className="bg-colorDirtyWhite border border-primary w-full rounded-lg p-4">
          <div className="flex flex-col gap-3">
            {["Item Purchased", "Amount", "Discount", "Payment", "Change"].map(
              (label, idx) => (
                <div
                  key={label}
                  className={`flex justify-between ${
                    idx === 0 || idx === 3
                      ? "border-b border-primaryGray pb-2"
                      : ""
                  }`}
                >
                  <p className="primary-title">{label}</p>
                  <p className="primary-title">
                    {label === "Item Purchased" && itemAmount.toFixed(2)}
                    {label === "Amount" &&
                      (finalAmount !== null ? finalAmount.toFixed(2) : "0.00")}
                    {label === "Discount" && "0.00"}
                    {label === "Payment" && "Cash"}
                    {label === "Change" &&
                      (change > 0 ? change.toFixed(2) : "0.00")}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* AMOUNT AND DISCOUNT BUTTON*/}
        <div className="flex gap-6">
          <div className="border-2 border-primary rounded-lg w-[560px] h-[84px] px-4 flex items-center justify-between">
            <p className="primary-title">Amount</p>
            <p className="primary-title">{amountType || "0.00"}</p>
          </div>

          <button className="bg-secondary text-white rounded-lg w-[200px] h-[84px] font-semibold shadow hover:bg-primary-dark hover-trans">
            DISCOUNT
          </button>
        </div>

        {/* KEYPAD AND BUTTON ALIGNMENT */}
        <div className="flex gap-6">
          {/* KEYPAD */}
          <div className="border-2 border-primary rounded-lg w-[560px] h-[405px] p-4 grid grid-cols-4 gap-3">
            {[
              "1",
              "2",
              "3",
              "Exact Amount",
              "4",
              "5",
              "6",
              "1000",
              "7",
              "8",
              "9",
              "500",
              ".",
              "0",
              "←",
              "OK",
            ].map((key) => (
              <button
                key={key}
                onClick={() =>
                  key === "OK" ? handleConfirm() : handleKeyClick(key)
                }
                className={`rounded-md font-bold shadow border hover:bg-opacity-80 hover-trans ${getButtonStyles(
                  key
                )}`}
              >
                {key}
              </button>
            ))}
          </div>

          {/* OUTSIDE BUTTONS */}
          <div className="flex flex-col gap-4">
            {["BANK", "GCASH", "MAYA", "CONFIRM"].map((label) => (
              <button
                key={label}
                onClick={() => {
                  if (label === "CONFIRM") {
                    if (!okPressed) return;
                    setOkPressed(false);
                    onBackToOrders();
                  } else {
                    handleKeyClick(label);
                  }
                }}
                className={`rounded-lg w-[200px] h-[90px] font-semibold shadow hover:bg-primary-dark hover-trans ${
                  label === "CONFIRM"
                    ? okPressed
                      ? "bg-colorGreen text-white"
                      : "bg-secondary text-white"
                    : "bg-secondary text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Payment;
