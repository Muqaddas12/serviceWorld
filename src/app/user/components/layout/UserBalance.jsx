import { useCurrency } from "@/context/CurrencyContext";

export default function UserBalance({ user }) {
  const { currency, updateCurrency, symbol, convert } = useCurrency();

  return (
    <div className="flex items-center gap-3">

      {/* Balance */}
      {user?.balance != null ? (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Balance: {symbol}{convert(user.balance).toFixed(2)}
        </p>
      ):(
         <p className="text-sm text-gray-600 dark:text-gray-300">
          Balance: {symbol}{convert(user.balance).toFixed(2)}
        </p>
      )}

      {/* Currency Selector */}
      <select
        value={currency}
        onChange={(e) => updateCurrency(e.target.value)}
        className="
          rounded-lg px-3 py-1 text-sm focus:outline-none cursor-pointer
          bg-white text-gray-700 border border-gray-300 focus:border-gray-500
          dark:bg-[#1A1F2B] dark:text-gray-300 dark:border-gray-700 dark:focus:border-gray-500
        "
      >
        <option value="INR">INR ₹</option>
        <option value="USD">USD $</option>
        <option value="EUR">EUR €</option>
      </select>

    </div>
  );
}
