"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function AddFund() {
  const [paymentType, setPaymentType] = useState("22");
  const [utr, setUtr] = useState("");
  const [amount, setAmount] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [transactions, setTransactions] = useState([]);
useEffect(()=>{
  const test= async ()=>{
    const data=await fetch('api/services/addFunds',{
      method:'GET'
    })
    console.log(data)
    const res=await data.text()
    setResponseMessage(res)
  }
  test()
},[])
  const handleSubmit = async (e) => {
    e.preventDefault();

    // const res = await fetch('api/addfund', {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ payment_type: paymentType, utr, payment_amount: amount }),
    // });

    // const data = await res.json();

    // if (res.ok) {
    //   setResponseMessage("Transaction verified successfully!");
    //   setTransactions((prev) => [data, ...prev]);
    //   setUtr("");
    //   setAmount("");
    // } else {
    //   setResponseMessage(data.message || "Something went wrong");
    // }
  };

  return (
    <>
   
    </>
  );
}


// <div className="container mx-auto my-8 px-4">
//       <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
//         <div className="p-6">
//           <h3 className="text-2xl font-bold text-indigo-600 mb-6">Add Funds</h3>

//           {/* Form and QR side by side */}
//           <div className="flex flex-col md:flex-row gap-6">
//             {/* Form */}
//             <div className="flex-1">
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 {/* Payment Method */}
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">Payment Method</label>
//                   <select
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                     value={paymentType}
//                     onChange={(e) => setPaymentType(e.target.value)}
//                   >
//                     <option value="22">PhonePe, Google Pay, Paytm</option>
//                     <option value="2">PhonePe {`{ Minimum =10rs } [ 100 add 3%Bonus]`}</option>
//                     <option value="103">UPI / BANK TRANSFER [MINIMUM 1K] [ 6%Bonus ]</option>
//                   </select>
//                 </div>

//                 {/* Instructions */}
//                 <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
//                   <h6 className="font-semibold text-indigo-700 mb-2">Instructions</h6>
//                   <ol className="list-decimal list-inside text-gray-700 space-y-1">
//                     <li>Scan the barcodes</li>
//                     <li>Pay Amount</li>
//                     <li>Put amount & Transaction ID</li>
//                     <li>Click on Verify Transaction Button</li>
//                   </ol>
//                 </div>

//                 {/* UTR */}
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">Enter UTR</label>
//                   <input
//                     type="text"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                     value={utr}
//                     onChange={(e) => setUtr(e.target.value)}
//                     required
//                   />
//                 </div>

//                 {/* Amount */}
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">Amount</label>
//                   <input
//                     type="number"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                     step="0.01"
//                     required
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
//                 >
//                   Verify Transaction
//                 </button>
//               </form>

//               {/* Response Message */}
//               {responseMessage && (
//                 <div className="mt-4 text-center text-green-600 font-medium">{responseMessage}</div>
//               )}
//             </div>

//             {/* QR Code */}
//             <div className="flex-1 flex justify-center items-center">
//               <div className="bg-gray-100 p-4 rounded-2xl shadow-inner">
//                 <h6 className="text-center font-semibold mb-3 text-gray-700">Scan QR</h6>
//                 <img
//                   src="https://pvccardprinting.in/wp-content/uploads/2024/07/phone-pe-qr-code-print.webp"
//                   alt="PhonePe QR Code"
//                   className="w-64 h-64 object-contain mx-auto"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Transaction History */}
//         <div className="bg-gray-50 p-6 border-t border-gray-200">
//           <h5 className="text-xl font-semibold text-indigo-600 mb-4">Transaction History</h5>
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white border rounded-lg">
//               <thead className="bg-indigo-100 text-gray-700 font-semibold">
//                 <tr>
//                   <th className="py-3 px-4 text-left">ID</th>
//                   <th className="py-3 px-4 text-left">Date</th>
//                   <th className="py-3 px-4 text-left">Method</th>
//                   <th className="py-3 px-4 text-left">Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transactions.length === 0 ? (
//                   <tr>
//                     <td colSpan="4" className="py-4 text-center text-gray-500">
//                       No transactions yet.
//                     </td>
//                   </tr>
//                 ) : (
//                   transactions.map((tx, idx) => (
//                     <tr
//                       key={idx}
//                       className="border-b hover:bg-indigo-50 transition-colors duration-200"
//                     >
//                       <td className="py-2 px-4">{tx.id}</td>
//                       <td className="py-2 px-4">{tx.date}</td>
//                       <td className="py-2 px-4">{tx.method}</td>
//                       <td className="py-2 px-4 font-semibold">₹{tx.amount}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>