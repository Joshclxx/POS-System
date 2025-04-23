// "use client";

// import SectionContainer from "../../SectionContainer";
// import { OrderData, useHistoryStore } from "@/hooks/useOrderHistory";
// import { useOrderStore } from "@/hooks/useOrder";
// import { format } from "date-fns";
// import { useState, useEffect } from "react";
// import toast, { Toaster } from "react-hot-toast";

// // Confirmation notif
// const ConfirmationModal = ({ onConfirm, onCancel, orderId }: { onConfirm: () => void; onCancel: () => void; orderId: number; }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-secondaryGray p-6 rounded-lg shadow-lg w-[400px]">
//         <h2 className="text-xl font-bold mb-4 text-primary">Confirm Void Order</h2>
//         <p className="text-primary">Are you sure you want to void Order #{orderId}?</p>
//         <div className="flex justify-end gap-2 mt-6">
//           <button
//             onClick={onCancel}
//             className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-4 rounded"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded"
//           >
//             Confirm Void
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const VoidOrder = () => {
//   const { orderHistory, updateOrderStatus } = useHistoryStore();
//   const [searchId, setSearchId] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
//   const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
//   const [previousStatus, setPreviousStatus] = useState<Record<number, 'Queued' | 'Completed' | 'Voided' | null>>({});
  
//   // Ensure that orderHistory is updated correctly
//   useEffect(() => {
//   // Track and log whenever orderHistory changes
//   console.log("Order History updated:", orderHistory);
//   }, [orderHistory]);  // Trigger on orderHistory changes
  
//   //To void order
//   const voidOrder = (orderId: number) => {
//     const orderToVoid = orderHistory.find((order) => order.OrderId === orderId);
//     if (orderToVoid) {
//     // Save previous status before voiding the order
//     setPreviousStatus((prev) => ({
//       ...prev,
//       [orderId]: orderToVoid.Status,
//     }));

//     updateOrderStatus(orderId, 'Voided');
//     useOrderStore.setState((state) => ({
//       ordersQueue: state.ordersQueue.filter((order) => order.id !== orderId),
//     }));

//     setSelectedOrder(null);
//     setIsConfirmationVisible(false);
//     toast.success(`Order #${orderId} has been voided successfully.`);
//   }
//   };

//   const revertOrder = (orderId: number) => {
//   console.log("Attempting to revert order:", orderId); 

//   const prevStatus = previousStatus[orderId];
//   if (!prevStatus) {
//     console.error(`No previous status found for order #${orderId}`);
//     return;
//   }

//   const originalOrder = orderHistory.find((order) => order.OrderId === orderId);
//   if (!originalOrder) {
//     console.error(`No order found with ID ${orderId}`);
//     return;
//   }

//   console.log("Previous Status:", prevStatus);
//   console.log("Original Order:", originalOrder);

//   // 🔄 Step 1: Revert to the previous status
//   updateOrderStatus(orderId, prevStatus);

//   // 🕒 Step 2: Add back to the orders queue if needed
//   if (prevStatus === "Queued") {
//     useOrderStore.setState((state) => ({
//       ordersQueue: [
//         ...state.ordersQueue,
//         {
//           id: orderId,
//           items: originalOrder.items,
//           confirmedAt: Date.now(),
//         },
//       ],
//     }));
//     console.log("Order added back to queue");
//   }

//   // 🧹 Step 3: Clean up previous status tracking
//   setPreviousStatus((prev) => {
//     const newStatus = { ...prev };
//     delete newStatus[orderId];
//     return newStatus;
//   });
//   console.log("Updated previousStatus:", previousStatus);

//   // 🔁 Step 4: Refresh selectedOrder from latest orderHistory
//   const updatedOrder = useHistoryStore.getState().orderHistory.find(
//     (order) => order.OrderId === orderId
//   );
//   console.log("Updated order from history:", updatedOrder);

//   setSelectedOrder(updatedOrder || null); // Ensure we set the correct order

//   // ✅ Step 5: Notify user
//   toast.success(`Order #${orderId} has been restored.`);
// };

//   const filteredOrders = orderHistory.filter((order) =>
//     order.OrderId.toString().includes(searchId)
//   );

//   const handleVoidClick = () => {
//     if (!selectedOrder) return;

//     if (selectedOrder.Status === "Voided") {
//       toast.error(`Order #${selectedOrder.OrderId} is already voided.`);
//       return;
//     }

//     setIsConfirmationVisible(true);
//   };

//   // Limit item names for display in the table
//   const truncateItemName = (itemName: string = "No Item", maxLength: number = 20) => {
//     return itemName.length > maxLength ? `${itemName.substring(0, maxLength)}...` : itemName;
//   };  

//   // Calculate the total price for the order based on item prices and quantities
//   const calculateTotalPrice = (items: { title: string; price: number; quantity: number }[]) => {
//     return items.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   return (
//     <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
//       <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

//       <div className="grid grid-cols-12 mt-4">
//         <div className="container bg-colorDirtyWhite w-[1280px] flex flex-row p-[10px]">
//           <div className="order-history-panel flex flex-col basis-[100%] h-[914px]">
//             <div className="heading flex h-[52px] items-center bg-[#000000] border rounded-[8px] mb-[5px]">
//               <p className="text-colorDirtyWhite font-bold text-[24px] px-[10px]">VOID ORDER</p>
//             </div>

//             {/* Search Bar */}
//             <div className="flex justify-end mb-2 px-[10px]">
//               <input
//                 type="text"
//                 inputMode="numeric"
//                 pattern="\d*"
//                 value={searchId}
//                 onChange={(e) => setSearchId(e.target.value)}
//                 placeholder="Search Order ID..."
//                 className="border border-gray-300 rounded-[6px] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all w-[250px]"
//               />
//             </div>

//             {/* Orders Table */}
//             <div className="flex-1 overflow-y-auto hide-scrollbar mt-[5px] px-[10px]">
//               <table className="w-full table-auto border-separate border-spacing-0 shadow-[0_0_20px_rgba(0,0,0,0.15)]">
//                 <thead className="bg-secondaryGray text-primary text-left sticky top-0 z-20 pr-[10px]">
//                   <tr>
//                     <th className="px-[12px] py-[15px]">Order ID</th>
//                     <th className="px-[12px] py-[15px]">Item</th>
//                     <th className="px-[12px] py-[15px]">Total</th>
//                     <th className="px-[12px] py-[15px]">Date & Time</th>
//                     <th className="px-[12px] py-[15px]">Status</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {filteredOrders.map((order) => (
//                     <tr
//                       key={order.OrderId}
//                       onClick={() => setSelectedOrder(order)}
//                       className="border-b hover:bg-secondaryGray/50 cursor-pointer"
//                     >
//                       <td className="px-[12px] py-[12px]">{order.OrderId}</td>
//                       <td className="px-[12px] py-[12px]">
//                         {/* Show only the first item, truncated if necessary */}
//                         {truncateItemName(`${order.items[0]?.title}...` || "No Items")}
//                       </td>
//                       <td className="px-[12px] py-[12px]">{calculateTotalPrice(order.items)}</td>
//                       <td className="px-[12px] py-[12px]">
//                         {format(order.Date, "yyyy-MM-dd HH:mm:ss")}
//                       </td>
//                       <td className="px-[12px] py-[12px]">{order.Status}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Order Detail Modal */}
//             {selectedOrder && (
//               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                 <div className="bg-secondaryGray p-6 rounded-lg shadow-lg w-[400px]">
//                   <h2 className="text-xl font-bold mb-4 text-primary">Order Details</h2>
//                   <p><strong>Order ID:</strong> {selectedOrder.OrderId}</p>
//                   <div>
//                     <strong>Items:</strong>
//                     <ul>
//                       {selectedOrder.items.map((item, index) => (
//                         <li key={index}>
//                           {item.title} - {item.price} x {item.quantity}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                   <p><strong>Total Price:</strong> {calculateTotalPrice(selectedOrder.items)}</p>
//                   <p><strong>Status:</strong> {selectedOrder.Status}</p>

//                   <div className="flex justify-end gap-2 mt-6">
//                     <button
//                       onClick={() => setSelectedOrder(null)}
//                       className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-4 rounded" 
//                     >
//                       Cancel
//                     </button>

//                     {selectedOrder.Status === "Voided" ? (
//                       <button
//                         onClick={() => revertOrder(selectedOrder.OrderId)}
//                         className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded"
//                       >
//                         Revert Void
//                       </button>
//                     ) : (
//                       <button
//                         onClick={handleVoidClick}
//                         className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded"
//                       >
//                         Void Order
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       {isConfirmationVisible && selectedOrder && (
//         <ConfirmationModal
//           orderId={selectedOrder.OrderId}
//           onConfirm={() => voidOrder(selectedOrder.OrderId)}
//           onCancel={() => setIsConfirmationVisible(false)}
//         />
//       )}
//     </SectionContainer>
//   );
// };

// export default VoidOrder;
// //hello
