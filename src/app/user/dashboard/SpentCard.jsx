"use client";
import { MdTrendingUp } from "react-icons/md";
import { useCurrency } from "@/context/CurrencyContext";
import Card from "./Card";

export default function SpentCard({ spent }) {
  const { symbol, convert } = useCurrency();

  return (
    <Card className="py-3 sm:py-4 px-2">
      <div className="flex items-center gap-2 sm:gap-3">

        <div
          className="
            p-2 sm:p-3 rounded-full 
            bg-gray-200 text-gray-700
            dark:bg-white/10 dark:text-white
          "
        >
          <MdTrendingUp size={20} />
        </div>

        <div className="leading-tight">
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            Total Spent
          </p>

          <h4 className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400 mt-0.5">
            {symbol}{convert(spent).toFixed(2)}
          </h4>
        </div>

      </div>
    </Card>
  );
}
