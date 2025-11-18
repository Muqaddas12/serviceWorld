"use client";
import { MdAccountBalanceWallet } from "react-icons/md";
import { useCurrency } from "@/context/CurrencyContext";
import Card from "./Card";

export default function BalanceCard({ balance }) {
  const { symbol, convert } = useCurrency();

  return (
    <Card className="py-3 sm:py-4 px-2">
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Icon */}
        <div
          className="
            p-2 sm:p-3 rounded-full 
            bg-gray-200 text-gray-700
            dark:bg-white/10 dark:text-white
          "
        >
          <MdAccountBalanceWallet size={20} />
        </div>

        {/* Balance */}
        <div className="leading-tight">
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            Balance
          </p>

          <h4 className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400 mt-0.5">
            {symbol}{convert(balance).toFixed(2)}
          </h4>
        </div>
      </div>
    </Card>
  );
}
