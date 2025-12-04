"use client";

import { useCurrency } from "@/context/CurrencyContext";

export default function TransactionHistory({ transactions }) {
  console.log(transactions)
  const { symbol, convert } = useCurrency();

  return (
    <div
      className="
        bg-white dark:bg-[#1A1F2B]
        border border-gray-300 dark:border-[#2B3143]
        rounded-2xl 
        shadow-md 
        p-5 md:p-8
      "
    >
      {/* Heading */}
      <h5 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Transaction History
      </h5>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">

          <thead
            className="
              bg-gray-200 dark:bg-[#2B3143]
              text-gray-800 dark:text-gray-200
              border-b border-gray-300 dark:border-[#2B3143]
            "
          >
            <tr>
              <th className="py-2 px-3 text-left">ID</th>
              <th className="py-2 px-3 text-left">Date</th>
              <th className="py-2 px-3 text-left">Method</th>
              <th className="py-2 px-3 text-left">Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-5 text-center text-gray-500 dark:text-gray-400 italic"
                >
                  No transactions yet.
                </td>
              </tr>
            ) : (
              transactions.map((tx, i) => (
                <tr
                  key={i}
                  className="
                    border-b border-gray-300 dark:border-[#2B3143]
                    hover:bg-gray-100 dark:hover:bg-[#2A2F3A]
                    transition-all duration-200
                  "
                >
                  {/* UTR or ID */}
                  <td className="py-2 px-3 text-gray-800 dark:text-gray-200">
                    {tx.utr || tx.id}
                  </td>

                  {/* Date */}
                  <td className="py-2 px-3 text-gray-700 dark:text-gray-300">
                    {new Date(tx.createdAt || tx.date).toLocaleString()}
                  </td>

                  {/* Payment Method */}
                  <td className="py-2 px-3 capitalize text-gray-700 dark:text-gray-300">
                    {tx.payment_type || tx.gateway || "N/A"}
                  </td>

                  {/* Amount (with currency conversion + symbol) */}
                  <td className="py-2 px-3 font-semibold text-gray-800 dark:text-gray-100">
                    {symbol}{convert(tx.payment_amount || tx.amount).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
