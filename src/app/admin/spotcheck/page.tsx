// This component allows a verified manager to perform a spotcheck by inputting cash counts for various denominations,
// calculating the total, comparing it against expected cash, submitting it to the server, and viewing history records.

"use client";

import React, { useEffect, useState, useMemo } from "react";
import Button from "@/components/Button";
import SectionContainer from "@/components/SectionContainer";
import AdminDrawer from "@/components/admin/AdminDrawer";
import useGlobal from "@/hooks/useGlobal";
import { useShiftStore } from "@/hooks/useShiftStore";
import { FETCH_SPOTCHECK_HISTORY } from "@/app/graphql/query";
import ManagerLogin from "@/components/admin/ManagerLogin";
import { useManagerAuth } from "@/hooks/useManagerAuth";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_SPOTCHECK } from "@/app/graphql/mutations";
import { handleGraphQLError } from "@/app/utils/handleGraphqlError";

// Define available denominations
const denominations = [1, 5, 10, 20, 50, 100, 200, 500, 1000];

// Data structure for spotcheck table entries
type SpotcheckEntry = {
  id: number;
  employee: string;
  actual: number;
  timestamp: string;
  pos: number;
  difference: number;
};

// GraphQL response data shape
type RawSpotCheckData = {
  id: number;
  user: {
    email: string;
  };
  currentCash: number;
  actualCash: number;
  createdAt: string;
};

const Spotcheck = () => {
  // Fetch expected cash values from global shift store
  const { startingCash, totalSales, totalPicked } = useShiftStore();
  const expectedCash = startingCash + totalSales - totalPicked;

  // Local states for counts, input errors, verification, etc.
  const [counts, setCounts] = useState<string[]>(
    Array(denominations.length).fill("")
  );
  const { setShowDrawer } = useGlobal();
  const [history, setHistory] = useState<SpotcheckEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputError, setInputError] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [selectedDifference, setSelectedDifference] = useState<number | null>(
    null
  );

  // login, ---> removed for a while
  const { logout } = useManagerAuth();
  const [isManagerVerified, setIsManagerVerified] = useState(false);

  // GraphQL hooks for fetching and submitting spotcheck data
  const { data, refetch } = useQuery(FETCH_SPOTCHECK_HISTORY);
  const [createSpotCheck] = useMutation(CREATE_SPOTCHECK);
  const router = useRouter();

  // On data load, format and save history
  useEffect(() => {
    if (!data) return;

    if (data.getSpotCheckHistory) {
      const formattedHistory = data.getSpotCheckHistory.map(
        (data: RawSpotCheckData) => ({
          id: data.id,
          employee: data.user?.email,
          actual: data.actualCash,
          timestamp: data.createdAt,
          pos: data.currentCash,
          difference: data.actualCash - data.currentCash,
        })
      );
      setHistory(formattedHistory);
    }
  }, [setShowDrawer, data]);

  // Compute total cash from counts
  const total = useMemo(
    () =>
      denominations.reduce(
        (acc, val, idx) => acc + val * (parseInt(counts[idx]) || 0),
        0
      ),
    [counts]
  );

  // Submit spotcheck and update history
  const handleConfirm = async () => {
    if (counts.some((c) => c === "")) {
      setInputError(true);
      setShowDrawer(false);
      return;
    }
    try {
      await createSpotCheck({
        variables: {
          data: {
            userId: localStorage.getItem("userId"),
            currentCash: expectedCash,
            actualCash: total,
          },
        },
      });

      refetch();
      setSelectedDifference(total - expectedCash);
      setShowDrawer(true);
      setInputError(false);
    } catch (error) {
      handleGraphQLError(error);
    }
  };

  // Filter history table based on search input
  const filteredHistory = useMemo(
    () =>
      !searchQuery
        ? history
        : history.filter((e) => e.id.toString().includes(searchQuery)),
    [history, searchQuery]
  );

  // Update table selection based on search results
  useEffect(() => {
    if (filteredHistory.length) {
      const latest = filteredHistory[filteredHistory.length - 1];
      setSelectedRowId(latest.id);
      setSelectedDifference(latest.difference);
    } else {
      setSelectedRowId(null);
      setSelectedDifference(null);
    }
  }, [filteredHistory]);

  // Update count for a specific denomination
  function handleInputChange(value: string, index: number): void {
    if (!/^\d*$/.test(value)) return;
    const updatedCounts = [...counts];
    updatedCounts[index] = value;
    setCounts(updatedCounts);
    if (inputError && value !== "") {
      setInputError(false);
    }
  }

  // Reset all inputs
  function handleReset(): void {
    setCounts(Array(denominations.length).fill(""));
    setInputError(false);
  }

  // Callback to mark manager as verified after login
  const handleLoginSuccess = () => {
    setIsManagerVerified(true);
  };

  // Show login page if manager not verified
  if (!isManagerVerified) {
    return (
      <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px] bg-colorDirtyWhite">
        <Toaster />
        <ManagerLogin onLoginSuccess={handleLoginSuccess} />
      </SectionContainer>
    );
  }

  return (
    <>
      {/* Spotcheck Main UI */}
      <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
        <Toaster />
        <div className="grid grid-cols-12 mt-4">
          <div className="bg-colorDirtyWhite w-[1280px] h-[700px] relative">
            {/* Page Title & Action Buttons */}
            <div className="relative flex items-center justify-between w-full max-w-[1280px] px-6 mt-[20px]">
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <div className="flex items-center justify-center w-[414px] h-[52px] bg-secondary rounded-lg">
                  <p className="text-tertiary text-[24px] font-bold">
                    SPOTCHECK
                  </p>
                </div>
              </div>

              <div className="w-[414px]" />
              {/* History and Logout */}
              <div className="flex justify-between gap-4">
                <Button
                  variant="universal"
                  onClick={() => setShowDrawer(true)}
                  className="w-[172px] h-[44px] bg-colorBlue text-tertiary rounded-3xl text-[24px]"
                >
                  History
                </Button>
                <Button
                  variant="universal"
                  onClick={() => {
                    logout();
                    router.replace("/");
                    toast.success("Spotcheck Logged Out.", {
                      id: "notif-message",
                    });
                  }}
                  className="w-[172px] h-[44px] bg-colorBlue text-tertiary rounded-3xl text-[24px]"
                >
                  Logout
                </Button>
              </div>
            </div>

            {/* Amount Display */}
            <div className="flex items-center justify-center container border-1 border-primary bg-tertiary w-[610px] h-[72px] rounded-lg mx-auto mt-[20px]">
              <div className="flex justify-between items-center w-full px-4">
                <p className="text-left text-primary font-semibold text-[24px]">
                  AMOUNT
                </p>
                <div className="container bg-colorDirtyWhite w-[250px] h-[54px] border-1 border-primary flex justify-center items-center">
                  <p className="text-primary text-center text-[28px]">
                    ₱ {total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Denomination Inputs */}
            <div className="grid grid-cols-3 gap-4 w-full px-3 mt-9">
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
                    className={`bg-colorDirtyWhite w-[150px] h-[100px] border ${
                      inputError && counts[index] === ""
                        ? "border-colorRed"
                        : "border-primary"
                    } text-primary text-center text-[28px]`}
                  />
                </div>
              ))}
            </div>

            {/* Error message for empty inputs */}
            {inputError && (
              <div className="text-center text-colorRed italic mt-2">
                Please fill in all fields before confirming.
              </div>
            )}

            {/* Reset & Confirm Buttons */}
            <div className="flex gap-4 absolute bottom-4 right-4">
              <Button
                variant="universal"
                onClick={handleReset}
                className="w-[172px] h-[44px] bg-colorRed text-tertiary rounded-3xl text-[24px]"
              >
                Reset
              </Button>
              <Button
                variant="universal"
                onClick={handleConfirm}
                className="w-[172px] h-[44px] bg-colorGreen text-tertiary rounded-3xl text-[24px]"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Spotcheck History Drawer */}
      <AdminDrawer onClose={() => setShowDrawer(false)}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="container relative bg-primary w-full h-full"
        >
          {/* Close Drawer Button */}
          <button
            onClick={() => setShowDrawer(false)}
            className="absolute top-4 right-4 text-tertiary text-xl font-bold bg-colorRed w-[36px] h-[36px] rounded-full"
          >
            X
          </button>

          {/* Search Spotcheck by ID */}
          <div className="p-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Spotcheck ID"
              className="mb-4 p-2 rounded max-w-[300px] border border-gray-300 w-full"
            />
          </div>

          {/* Spotcheck History Table */}
          <div
            className="px-4 overflow-y-auto hide-scrollbar"
            style={{ maxHeight: "50vh" }}
          >
            <table className="min-w-full">
              <thead className="bg-primaryGray sticky top-0 mb-2">
                <tr>
                  <th className="table-header">Spotcheck ID</th>
                  <th className="table-header">Employee</th>
                  <th className="table-header">POS Cash</th>
                  <th className="table-header">Actual Cash</th>
                  <th className="table-header">Date & Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {[...filteredHistory].reverse().map((entry) => (
                  <tr
                    key={entry.id}
                    className={`cursor-pointer ${
                      selectedRowId === entry.id
                        ? "bg-colorOrange/40"
                        : "hover:bg-colorOrange/40"
                    }`}
                    onClick={() => {
                      setSelectedRowId(entry.id);
                      setSelectedDifference(entry.difference);
                    }}
                  >
                    <td className="table-cell">{entry.id}</td>
                    <td className="table-cell">{entry.employee}</td>
                    <td className="table-cell">{entry.pos.toLocaleString()}</td>
                    <td className="table-cell">
                      {entry.actual.toLocaleString()}
                    </td>
                    <td className="table-cell">{entry.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Difference Result */}
          {selectedDifference !== null && (
            <div className="px-4">
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
                      : "CASH OVER (SHORT)"}
                  </p>
                  <p className="text-primary text-center">
                    ₱ {Math.abs(selectedDifference).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Logout After Reviewing Difference */}
              <div className="mt-12">
                <Button
                  variant="universal"
                  onClick={() => {
                    logout();
                    router.replace("/");
                    toast.success("Spotcheck Logged Out.", {
                      id: "notif-message",
                    });
                  }}
                  className="w-[172px] h-[44px] bg-colorGreen text-tertiary rounded-3xl text-[24px] font-regular absolute right-4"
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </div>
      </AdminDrawer>
    </>
  );
};

export default Spotcheck;
