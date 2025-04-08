"use client";

import React, { useEffect, useState } from "react";
import { Drawer as VaulDrawer } from "vaul";
import Button from "@/components/Button";
import SectionContainer from "@/components/SectionContainer";
import useGlobal from "@/hooks/useGlobal";

const denominations = [1, 5, 10, 20, 50, 100, 200, 500, 1000];
const posCash = 7943;

type SpotcheckEntry = {
  id: number;
  employee: string;
  actual: number;
  timestamp: string;
  pos: number;
  difference: number;
};

const Spotcheck = () => {
  const [counts, setCounts] = useState(Array(denominations.length).fill(""));
  const [userEmail, setUserEmail] = useState("");
  const { showDrawer, setShowDrawer } = useGlobal();
  const [history, setHistory] = useState<SpotcheckEntry[]>([]);
  const [selectedDifference, setSelectedDifference] = useState<number | null>(
    null
  );

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "Unknown";
    setUserEmail(email);
    const saved = localStorage.getItem("spotcheckHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleInputChange = (value: string, index: number) => {
    const newCounts = [...counts];
    newCounts[index] = value;
    setCounts(newCounts);
  };

  const total = denominations.reduce(
    (acc, val, idx) => acc + val * (parseInt(counts[idx]) || 0),
    0
  );

  const handleReset = () => {
    setCounts(Array(denominations.length).fill(""));
  };

  const handleConfirm = () => {
    const id = 3000 + history.length;
    const newEntry: SpotcheckEntry = {
      id,
      employee: userEmail,
      actual: total,
      pos: posCash,
      timestamp: new Date().toLocaleString(),
      difference: total - posCash,
    };
    const updated = [...history, newEntry];
    setHistory(updated);
    localStorage.setItem("spotcheckHistory", JSON.stringify(updated));
    setSelectedDifference(newEntry.difference);
    setShowDrawer(true);
  };

  return (
    <>
      <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
        <div className="grid grid-cols-12 mt-4">
          <div className="bg-colorDirtyWhite w-[1280px] h-[914px] relative">
            {/* TITLE */}
            <div className="relative flex items-center justify-between w-full max-w-[1280px] px-6 mt-[20px]">
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <div className="flex items-center justify-center w-[414px] h-[52px] bg-secondary rounded-lg">
                  <p className="text-tertiary text-[24px] font-bold">
                    SPOTCHECK
                  </p>
                </div>
              </div>
              {/* HISTORY BUTTON */}
              <Button
                variant="universal"
                onClick={() => setShowDrawer(true)}
                className="w-[172px] h-[44px] bg-colorBlue text-tertiary rounded-3xl text-[24px] font-regular ml-auto"
              >
                History
              </Button>
            </div>

            {/* Amount Display */}
            <div className="flex items-center justify-center container border-1 border-primary bg-tertiary w-[610px] h-[72px] rounded-lg mx-auto mt-[20px]">
              <div className="flex justify-between items-center w-full px-4">
                <p className="text-left text-primary font-semibold text-[24px]">
                  AMOUNT
                </p>
                <div className="container bg-colorDirtyWhite w-[250px] h-[54px] border-1 border-primary flex justify-center items-center">
                  <p className="text-primary text-center text-[28px]">
                    ₱ {total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-3 gap-4 w-full px-3 mt-5">
              {denominations.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-secondaryGray w-full h-[130px] px-4 rounded-2xl"
                >
                  <p className="text-left text-primary font-semibold text-[52px]">
                    {item}
                  </p>
                  <input
                    type="text"
                    value={counts[index]}
                    onChange={(e) => handleInputChange(e.target.value, index)}
                    className="bg-colorDirtyWhite w-[150px] h-[100px] border border-primary text-primary text-center text-[28px]"
                  />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 absolute bottom-4 right-4">
              <Button
                variant="universal"
                onClick={handleReset}
                className="w-[172px] h-[44px] bg-colorRed text-tertiary rounded-3xl text-[24px] font-regular"
              >
                Reset
              </Button>
              <Button
                variant="universal"
                onClick={handleConfirm}
                className="w-[172px] h-[44px] bg-colorGreen text-tertiary rounded-3xl text-[24px] font-regular"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Drawer */}
      <VaulDrawer.Root open={showDrawer} onOpenChange={() => {}} modal>
        <VaulDrawer.Portal>
          <VaulDrawer.Overlay className="fixed inset-0 bg-primary/40 z-40 pointer-events-none" />
          <VaulDrawer.Content className="bg-colorBlue flex flex-col w-screen h-screen fixed top-0 left-0 outline-none z-50">
            <div className="container relative bg-primary w-full h-full">
              <button
                onClick={() => setShowDrawer(false)}
                className="absolute top-4 right-4 text-tertiary text-xl font-bold bg-colorRed w-[32px] h-[32px] rounded-full"
              >
                X
              </button>

              {/* Table */}
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full mt-12">
                    <thead className="bg-primaryGray">
                      <tr>
                        <th className="table-header">Spotcheck ID</th>
                        <th className="table-header">Employee</th>
                        <th className="table-header">POS Cash</th>
                        <th className="table-header">ACTUAL CASH ON HAND</th>
                        <th className="table-header">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                      {history.reverse().map((entry) => (
                        <tr
                          key={entry.id}
                          className="hover:bg-colorDirtyWhite cursor-pointer"
                          onClick={() =>
                            setSelectedDifference(entry.difference)
                          }
                        >
                          <td className="table-cell">{entry.id}</td>
                          <td className="table-cell">{entry.employee}</td>
                          <td className="table-cell">
                            {entry.pos.toLocaleString()}
                          </td>
                          <td className="table-cell">
                            {entry.actual.toLocaleString()}
                          </td>
                          <td className="table-cell">{entry.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Difference Display */}
                  {selectedDifference !== null && (
                    <div className="container w-full h-[54px] bg-primaryGray rounded-lg mt-8 flex items-center justify-between px-4">
                      <p className="text-primary font-semibold text-center">
                        DIFFERENCE
                      </p>
                      <div className="flex gap-12 items-center">
                        <p className="text-primary font-semibold text-center">
                          {selectedDifference === 0
                            ? "CASH OVER"
                            : selectedDifference > 0
                            ? "CASH OVER"
                            : "CASH OVER(SHORT)"}
                        </p>
                        <p className="text-primary text-center">
                          ₱ {Math.abs(selectedDifference).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </VaulDrawer.Content>
        </VaulDrawer.Portal>
      </VaulDrawer.Root>
    </>
  );
};

export default Spotcheck;
