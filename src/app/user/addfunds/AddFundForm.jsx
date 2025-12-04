"use client";

import QRSection from "./QRSection";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";
import { addFundAction } from "@/lib/userActions";

export default function AddFundForm({
  paymentType,
  setPaymentType,
  utr,
  setUtr,
  amount,
  setAmount,
  filteredPaymentMethod,
  paymentMethods,
  loading,
  setLoading,
  setPopup,
  Instructions,
}) {
  const router = useRouter();
  const { symbol } = useCurrency(); 
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await addFundAction({ utr, amount });


    if (res.status) {
      // ✔ success response
      setPopup({
        visible: true,
        success: true,
        message: res.message || "Transaction verified successfully!",
        transaction: res.transaction || null,
      });

      setUtr("");
      setAmount("");

      // Optional: reload after short delay
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } else {
      // ❌ failure from backend
      setPopup({
        visible: true,
        success: false,
        message: res.message || "Verification failed",
        transaction: null,
      });
    }
  } catch (err) {
    // ❌ system error
    setPopup({
      visible: true,
      success: false,
      message: "Something went wrong. Please try again.",
      transaction: null,
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="
        bg-white dark:bg-[#1A1F2B]
        border border-gray-300 dark:border-[#2B3143]
        rounded-2xl shadow-md
        p-5 md:p-8
      "
    >
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Add Funds
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Payment Method */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Payment Method
          </label>

          <select
            className="
              w-full bg-gray-100 dark:bg-[#0C0F17]
              border border-gray-300 dark:border-[#2B3143]
              rounded-lg px-3 py-2
              text-gray-800 dark:text-gray-200
              outline-none
              focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600
            "
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            {paymentMethods?.map((item) => (
              <option key={item._id} value={item.Name}>
                {item.Name || item.type}
              </option>
            ))}
          </select>
        </div>

        {/* QR Section */}
        <QRSection
          filteredPaymentMethod={filteredPaymentMethod}
          Instructions={Instructions}
        />

        {/* UTR */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Enter UTR
          </label>

          <input
            type="text"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            required
            className="
              w-full bg-gray-100 dark:bg-[#0C0F17]
              border border-gray-300 dark:border-[#2B3143]
              rounded-lg px-3 py-2
              text-gray-800 dark:text-gray-200
              outline-none
              focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600
            "
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Amount
          </label>

          <div className="relative">
            {/* Currency Symbol */}
            <span
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                text-gray-600 dark:text-gray-400
                pointer-events-none
              "
            >
              {symbol}
            </span>

          <div className="relative">
  <span
    className="
      absolute left-3 top-1/2 -translate-y-1/2
      text-gray-600 dark:text-gray-400 pointer-events-none
    "
  >
    {symbol}
  </span>

  <input
    type="number"
    step="0.01"
    value={amount}
    onChange={(e) => {
      setAmount(e.target.value); // ← Allow free typing
    }}
    onBlur={() => {
      if (amount !== "" && !isNaN(amount)) {
        setAmount(Number(amount).toFixed(2)); // ← Format only when leaving input
      }
    }}
    required
    className="
      w-full bg-gray-100 dark:bg-[#0C0F17]
      border border-gray-300 dark:border-[#2B3143]
      rounded-lg px-8 py-2
      text-gray-800 dark:text-gray-200
      outline-none
      focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600
    "
  />
</div>

          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-3 rounded-xl font-bold
            text-white
            bg-gray-800 dark:bg-gray-200 
            dark:text-black
            hover:bg-gray-700 dark:hover:bg-gray-300
            transition
            shadow-md
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {loading ? "Verifying..." : "Verify Transaction"}
        </button>
      </form>
    </div>
  );
}
