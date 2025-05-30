// "use client";

// import React, { useEffect, useState, useMemo } from "react";
// import Button from "@/components/Button";
// import SectionContainer from "@/components/SectionContainer";
// import AdminDrawer from "../AdminDrawer";
// import useGlobal from "@/hooks/useGlobal";
// import { useShiftStore } from "@/hooks/useShiftStore";
// import { FETCH_SPOTCHECK_HISTORY } from "@/app/graphql/query";
// import ManagerLogin from "../ManagerLogin";
// import { useManagerAuth } from "@/hooks/useManagerAuth";
// import toast, { Toaster } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { useMutation, useQuery } from "@apollo/client";
// import { CREATE_SPOTCHECK } from "@/app/graphql/mutations";
// import { handleGraphQLError } from "@/app/utils/handleGraphqlError";
// const denominations = [1, 5, 10, 20, 50, 100, 200, 500, 1000];

// type SpotcheckEntry = {
//   id: number;
//   employee: string;
//   actual: number;
//   timestamp: string;
//   pos: number;
//   difference: number;
// };

// type RawSpotCheckData = {
//   id: number;
//   user: {
//     email: string;
//   };
//   currentCash: number;
//   actualCash: number;
//   createdAt: String;
// };

// //testing
// const Spotcheck = () => {
//   const { startingCash, totalSales, totalPicked } = useShiftStore();
//   const expectedCash = startingCash + totalSales - totalPicked;
//   const [counts, setCounts] = useState<string[]>(
//     Array(denominations.length).fill("")
//   );
//   const [userEmail, setUserEmail] = useState("");
//   const { setShowDrawer } = useGlobal();
//   const [history, setHistory] = useState<SpotcheckEntry[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [inputError, setInputError] = useState(false);
//   const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
//   const [selectedDifference, setSelectedDifference] = useState<number | null>(
//     null
//   );
//   // const { isVerified, loading, login, logout } = useManagerAuth();
//   // console.log("Auth state ->", { isVerified, loading });

//   const { login, logout } = useManagerAuth();
//   const [isManagerVerified, setIsManagerVerified] = useState(false);

//   const { data, refetch } = useQuery(FETCH_SPOTCHECK_HISTORY);
//   const [createSpotCheck] = useMutation(CREATE_SPOTCHECK);
//   const router = useRouter();

//   useEffect(() => {
//     console.log("Fetched history data", data);
//     if (!data) return;

//     if (data.getSpotCheckHistory) {
//       const formattedHistory = data.getSpotCheckHistory.map(
//         (data: RawSpotCheckData) => ({
//           id: data.id,
//           employee: data.user?.email,
//           actual: data.actualCash,
//           timestamp: data.createdAt,
//           pos: data.currentCash,
//           difference: data.actualCash - data.currentCash,
//         })
//       );

//       setHistory(formattedHistory);
//       // setShowDrawer(true); not needed for now it can cause bug
//     }

//     // setUserEmail(localStorage.getItem("userEmail") || "Unknown");
//     // const saved = localStorage.getItem("spotcheckHistory");
//     // if (saved) setHistory(JSON.parse(saved));
//   }, [setShowDrawer, data]);

//   const total = useMemo(
//     () =>
//       denominations.reduce(
//         (acc, val, idx) => acc + val * (parseInt(counts[idx]) || 0),
//         0
//       ),
//     [counts]
//   );

//   const handleConfirm = async () => {
//     if (counts.some((c) => c === "")) {
//       setInputError(true);
//       setShowDrawer(false);
//       return;
//     }
//     try {
//       await createSpotCheck({
//         variables: {
//           data: {
//             userId: localStorage.getItem("userId"),
//             currentCash: expectedCash,
//             actualCash: total,
//           },
//         },
//       });

//       refetch();
//       // setSelectedRowId(id);
//       setSelectedDifference(total - expectedCash);
//       setShowDrawer(true);
//       setInputError(false);
//     } catch (error) {
//       handleGraphQLError(error);
//     }
//     // const id = 3000 + history.length;
//     // const entry: SpotcheckEntry = {
//     //   id,
//     //   employee: userEmail,
//     //   actual: total,
//     //   pos: expectedCash,
//     //   timestamp: new Date().toLocaleString(),
//     //   difference: total - expectedCash,
//     // };
//     // const updated = [...history, entry];
//     // setHistory(updated);
//     // localStorage.setItem("spotcheckHistory", JSON.stringify(updated));
//   };

//   const filteredHistory = useMemo(
//     () =>
//       !searchQuery
//         ? history
//         : history.filter((e) => e.id.toString().includes(searchQuery)),
//     [history, searchQuery]
//   );
//   useEffect(() => {
//     if (filteredHistory.length) {
//       const latest = filteredHistory[filteredHistory.length - 1];
//       setSelectedRowId(latest.id);
//       setSelectedDifference(latest.difference);
//     } else {
//       setSelectedRowId(null);
//       setSelectedDifference(null);
//     }
//   }, [filteredHistory]);

//   function handleInputChange(value: string, index: number): void {
//     // Allow only numeric input
//     if (!/^\d*$/.test(value)) return;
//     const updatedCounts = [...counts];
//     updatedCounts[index] = value;
//     setCounts(updatedCounts);
//     // Clear error state if any field now has a value
//     if (inputError && value !== "") {
//       setInputError(false);
//     }
//   }

//   function handleReset(): void {
//     setCounts(Array(denominations.length).fill(""));
//     setInputError(false);
//   }

//   // const handleLoginSuccess = (email: string, password: string) => {
//   //   console.log("Logging in:", email);
//   //   setUserEmail(email);
//   //   login(email, password);
//   //   // localStorage.setItem("userEmail", email);
//   //   // login(email, password);
//   // };

//   const handleLoginSuccess = () => {
//     setIsManagerVerified(true);
//   };

//   // if (loading) return null;

//   // if (!isVerified) {
//   //   return (
//   //     <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px] bg-colorDirtyWhite">
//   //       <Toaster />
//   //       <ManagerLogin onLoginSuccess={handleLoginSuccess} />
//   //     </SectionContainer>
//   //   );
//   // }

//   if (!isManagerVerified) {
//     return (
//       <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px] bg-colorDirtyWhite">
//         <Toaster />
//         <ManagerLogin onLoginSuccess={handleLoginSuccess} />
//       </SectionContainer>
//     );
//   }

//   return (
//     <>
//       <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
//         <Toaster />
//         <div className="grid grid-cols-12 mt-4">
//           <div className="bg-colorDirtyWhite w-[1280px] h-[700px] relative">
//             {/* TITLE */}
//             <div className="relative flex items-center justify-between w-full max-w-[1280px] px-6 mt-[20px]">
//               <div className="absolute left-1/2 transform -translate-x-1/2">
//                 <div className="flex items-center justify-center w-[414px] h-[52px] bg-secondary rounded-lg">
//                   <p className="text-tertiary text-[24px] font-bold">
//                     SPOTCHECK
//                   </p>
//                 </div>
//               </div>

//               <div className="w-[414px]" />
//               {/* HISTORY and LOGOUT BUTTON */}
//               <div className="flex justify-between gap-4">
//                 <Button
//                   variant="universal"
//                   onClick={() => setShowDrawer(true)}
//                   className="w-[172px] h-[44px] bg-colorBlue text-tertiary rounded-3xl text-[24px] font-regular ml-auto"
//                 >
//                   History
//                 </Button>
//                 <Button
//                   variant="universal"
//                   onClick={() => {
//                     logout();
//                     router.replace("/");
//                     toast.success("Spotcheck Logged Out.", {
//                       id: "notif-message",
//                     });
//                   }}
//                   className="w-[172px] h-[44px] bg-colorBlue text-tertiary rounded-3xl text-[24px] font-regular ml-auto"
//                 >
//                   Logout
//                 </Button>
//               </div>
//             </div>
//             {/* AMOUNT DISPLAY */}
//             <div className="flex items-center justify-center container border-1 border-primary bg-tertiary w-[610px] h-[72px] rounded-lg mx-auto mt-[20px]">
//               <div className="flex justify-between items-center w-full px-4">
//                 <p className="text-left text-primary font-semibold text-[24px]">
//                   AMOUNT
//                 </p>
//                 <div className="container bg-colorDirtyWhite w-[250px] h-[54px] border-1 border-primary flex justify-center items-center">
//                   <p className="text-primary text-center text-[28px]">
//                     ₱ {total.toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* INPUTS */}
//             <div className="grid grid-cols-3 gap-4 w-full px-3 mt-9">
//               {denominations.map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex justify-between items-center bg-secondaryGray w-full h-[130px] px-4 rounded-2xl"
//                 >
//                   <p className="text-left text-primary font-semibold text-[52px]">
//                     {item}
//                   </p>
//                   <input
//                     type="text"
//                     value={counts[index]}
//                     onChange={(e) => handleInputChange(e.target.value, index)}
//                     className={`bg-colorDirtyWhite w-[150px] h-[100px] border ${
//                       inputError && counts[index] === ""
//                         ? "border-colorRed"
//                         : "border-primary"
//                     } text-primary text-center text-[28px]`}
//                   />
//                 </div>
//               ))}
//             </div>
//             {inputError && (
//               <div className="text-center text-colorRed italic mt-2">
//                 Please fill in all fields before confirming.
//               </div>
//             )}
//             {/* RESET & CONFIRM BUTTON */}
//             <div className="flex gap-4 absolute bottom-4 right-4">
//               <Button
//                 variant="universal"
//                 onClick={handleReset}
//                 className="w-[172px] h-[44px] bg-colorRed text-tertiary rounded-3xl text-[24px] font-regular"
//               >
//                 Reset
//               </Button>
//               <Button
//                 variant="universal"
//                 onClick={handleConfirm}
//                 className="w-[172px] h-[44px] bg-colorGreen text-tertiary rounded-3xl text-[24px] font-regular"
//               >
//                 Confirm
//               </Button>
//             </div>
//           </div>
//         </div>
//       </SectionContainer>

//       {/* SPOTCHECK DRAWER */}
//       <AdminDrawer onClose={() => setShowDrawer(false)}>
//         <div
//           onClick={(e) => e.stopPropagation()}
//           className="container relative bg-primary w-full h-full"
//         >
//           <button
//             onClick={() => setShowDrawer(false)}
//             className="absolute top-4 right-4 text-tertiary text-xl font-bold bg-colorRed w-[36px] h-[36px] rounded-full"
//           >
//             X
//           </button>

//           {/* SEARCH INPUT */}
//           <div className="p-4">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by Spotcheck ID"
//               className="mb-4 p-2 rounded max-w-[300px] border border-gray-300 w-full"
//             />
//           </div>

//           {/* HISTORY TABLE */}
//           <div
//             className="px-4 overflow-y-auto hide-scrollbar"
//             style={{ maxHeight: "50vh" }}
//           >
//             <table className="min-w-full">
//               <thead className="bg-primaryGray sticky top-0 mb-2">
//                 <tr>
//                   <th className="table-header">Spotcheck ID</th>
//                   <th className="table-header">Employee</th>
//                   <th className="table-header">POS Cash</th>
//                   <th className="table-header">Actual Cash</th>
//                   <th className="table-header">Date & Time</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y">
//                 {[...filteredHistory].reverse().map((entry) => (
//                   <tr
//                     key={entry.id}
//                     className={`cursor-pointer ${
//                       selectedRowId === entry.id
//                         ? "bg-colorOrange/40"
//                         : "hover:bg-colorOrange/40"
//                     }`}
//                     onClick={() => {
//                       setSelectedRowId(entry.id);
//                       setSelectedDifference(entry.difference);
//                     }}
//                   >
//                     <td className="table-cell">{entry.id}</td>
//                     <td className="table-cell">{entry.employee}</td>
//                     <td className="table-cell">{entry.pos.toLocaleString()}</td>
//                     <td className="table-cell">
//                       {entry.actual.toLocaleString()}
//                     </td>
//                     <td className="table-cell">{entry.timestamp}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* DIFFERENCE DISPLAY */}
//           {selectedDifference !== null && (
//             <div className="px-4">
//               <div className="container w-full h-[54px] bg-primaryGray rounded-lg mt-8 flex items-center justify-between px-4">
//                 <p className="text-primary font-semibold text-center">
//                   DIFFERENCE
//                 </p>
//                 <div className="flex gap-12 items-center">
//                   <p className="text-primary font-semibold text-center">
//                     {selectedDifference === 0
//                       ? "CASH OVER"
//                       : selectedDifference > 0
//                       ? "CASH OVER"
//                       : "CASH OVER (SHORT)"}
//                   </p>
//                   <p className="text-primary text-center">
//                     ₱ {Math.abs(selectedDifference).toLocaleString()}
//                   </p>
//                 </div>
//               </div>

//               {/* AUTO LOGOUT */}
//               <div className="mt-12">
//                 <Button
//                   variant="universal"
//                   onClick={() => {
//                     logout();
//                     router.replace("/");
//                     toast.success("Spotcheck Logged Out.", {
//                       id: "notif-message",
//                     });
//                   }}
//                   className="w-[172px] h-[44px] bg-colorGreen text-tertiary rounded-3xl text-[24px] font-regular absolute right-4"
//                 >
//                   Confirm
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </AdminDrawer>
//     </>
//   );
// };

// export default Spotcheck;
