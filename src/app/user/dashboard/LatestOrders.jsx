"use client";

import Card from "./Card";
import { useCurrency } from "@/context/CurrencyContext";


import { getUserOrders } from "@/lib/userActions";
import { useEffect, useState } from "react";
export default function LatestOrders() {
  const [latestOrders,setLatestOrders]=useState([])
  const { symbol, convert } = useCurrency();
useEffect(()=>{
  const loadorder=async ()=>{
    const res=await getUserOrders()
    console.log(res)
    if(res.success){
      setLatestOrders(res?.orders)

    }
  }
  loadorder()
},[])
  return (
    <>
      {/* ================= LATEST ORDERS ================= */}
      <section>
        <h3
          className="
          text-base sm:text-lg font-semibold mb-3 sm:mb-4
          text-gray-700 dark:text-gray-200
          tracking-wide
        "
        >
          Latest Orders
        </h3>

        <Card className="overflow-x-auto">
          <table
            className="
            w-full text-[12px] sm:text-sm text-left
            text-gray-600 dark:text-gray-300
          "
          >
            <thead
              className="
              text-[11px] sm:text-xs uppercase font-semibold
              border-b border-gray-300 dark:border-[#2B3143]
              text-gray-700 dark:text-gray-200
            "
            >
              <tr>
                <th className="py-2 px-2 sm:py-3 sm:px-4">Order ID</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4">Service</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4">Amount</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4">Status</th>
              </tr>
            </thead>

            <tbody>
   
  {latestOrders.length === 0 ? (
    <tr>
      <td
        colSpan="4"
        className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm"
      >
        No orders yet
      </td>
    </tr>
  ) : (
    latestOrders.map((order, idx) => (
      <tr
        key={idx}
        className="
          border-b border-gray-200 dark:border-[#2B3143]
          hover:bg-gray-200 dark:hover:bg-white/10
          transition-all duration-200
        "
      >
        <td className="py-2 px-2 sm:py-3 sm:px-4">
          {order.providerOrderId}
        </td>

        <td className="py-2 px-2 sm:py-3 sm:px-4 truncate">
          {order.service}
        </td>

        <td className="py-2 px-2 sm:py-3 sm:px-4 font-semibold text-green-600 dark:text-green-400">
          {symbol}
          {convert(order.amount).toFixed(2)}
        </td>

        <td className="py-2 px-2 sm:py-3 sm:px-4">
          <span
            className={`
              px-2 py-[2px] sm:py-1 rounded-lg text-[10px] sm:text-xs shadow-sm font-medium
              ${
                order.status === "Completed"
                  ? "bg-green-500/20 text-green-600 dark:text-green-400"
                  : order.status === "Processing"
                  ? "bg-gray-400/20 text-gray-700 dark:text-gray-300"
                  : "bg-orange-500/20 text-orange-500 dark:text-orange-400"
              }
            `}
          >
            {order.status}
          </span>
        </td>
      </tr>
    ))
  )}
</tbody>

          
          </table>
        </Card>
      </section>
    </>
  );
}
