"use client";

import { useEffect, useState } from "react";
import { getAllPaymentMethods } from "@/lib/adminServices";

export default function AddFund() {
  const [paymentType, setPaymentType] = useState("");
  const [utr, setUtr] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    visible: false,
    success: false,
    message: "",
    transaction: null,
  });
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [filteredPaymentMethod, setFilteredPaymentMethod] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // 🌓 Sync theme with localStorage
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    setDarkMode(theme === "dark");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  // ✅ Fetch Payment Methods
  useEffect(() => {
    const getPaymentMethods = async () => {
      try {
        const res = await getAllPaymentMethods();
        if (res && res.methods?.length) {
          setPaymentMethod(res.methods);
          // Set default payment type
          setPaymentType(res.methods[0].type);
        } else {
          setPaymentMethod([]);
          console.warn("No payment methods found");
        }
      } catch (err) {
        console.error("Error fetching payment methods:", err);
      }
    };
    getPaymentMethods();
  }, []);

  // ✅ Fetch Transaction History
  useEffect(() => {
    const getHistory = async () => {
      try {
        const res = await fetch("/api/services/gethistory");
        const data = await res.json();
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    getHistory();
  }, []);

  // ✅ Update QR Image on Payment Type Change
  useEffect(() => {
    const matched = paymentMethod.find((item) => item.type === paymentType);
    setFilteredPaymentMethod(matched?.qrImage || "");
  }, [paymentType, paymentMethod]);

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/services/addFunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_type: paymentType,
          utr,
          payment_amount: amount,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTransactions((prev) => [data.transaction, ...prev]);
        setPopup({
          visible: true,
          success: true,
          message: "Transaction verified successfully!",
          transaction: data.transaction,
        });
        setUtr("");
        setAmount("");
      } else {
        setPopup({
          visible: true,
          success: false,
          message: data.error || "Verification failed",
          transaction: null,
        });
      }
    } catch (err) {
      console.error(err);
      setPopup({
        visible: true,
        success: false,
        message: "Verification failed",
        transaction: null,
      });
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Theme-based colors
  const bgMain = darkMode ? "bg-[#0e0e0f]" : "bg-gray-50";
  const bgCard = darkMode ? "bg-[#151517]" : "bg-white";
  const borderColor = darkMode ? "border-yellow-500/20" : "border-gray-300";
  const textColor = darkMode ? "text-gray-300" : "text-gray-800";
  const headingColor = darkMode ? "text-yellow-400" : "text-yellow-600";

  return (
    <div
      className={`min-h-screen ${bgMain} ${textColor} flex justify-center px-4 md:px-6 py-8 transition-colors`}
    >
      <div className="w-full max-w-6xl space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
        {/* ✅ Left Box - Add Fund Form */}
        <div
          className={`${bgCard} border ${borderColor} rounded-2xl shadow-lg p-5 md:p-8`}
        >
          <h3
            className={`text-2xl sm:text-3xl font-bold ${headingColor} mb-6 text-center md:text-left`}
          >
            Add Funds
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method */}
            <div>
              <label className="block font-semibold mb-2">Payment Method</label>
              <select
                className={`w-full ${bgMain} border ${borderColor} rounded-lg px-3 py-2 ${textColor} focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base`}
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                {paymentMethod.map((item) => (
                  <option key={item._id} value={item.type}>
                    {item.name || item.type}
                  </option>
                ))}
              </select>
            </div>

            {/* QR + Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div
                className={`${bgMain} border ${borderColor} p-4 rounded-2xl shadow-inner flex flex-col items-center`}
              >
                <h6 className={`font-semibold ${headingColor} mb-3`}>Scan QR</h6>
                {filteredPaymentMethod ? (
                  <img
                    src={`data:image/png;base64,${filteredPaymentMethod}`}
                    alt="QR Code"
                    className="w-40 sm:w-52 h-auto rounded-lg"
                  />
                ) : (
                  <p className="text-center text-gray-500 text-sm">
                    No QR available
                  </p>
                )}
              </div>

              <div
                className={`${bgMain} border ${borderColor} rounded-xl p-4 text-sm`}
              >
                <h6 className={`font-semibold ${headingColor} mb-2`}>
                  Instructions
                </h6>
                <ol className="list-decimal list-inside space-y-1 text-gray-500">
                  <li>Scan the QR code above</li>
                  <li>Pay the desired amount</li>
                  <li>Enter amount & transaction ID</li>
                  <li>Click on “Verify Transaction”</li>
                </ol>
              </div>
            </div>

            {/* UTR */}
            <div>
              <label className="block font-semibold mb-2">Enter UTR</label>
              <input
                type="text"
                className={`w-full ${bgMain} border ${borderColor} rounded-lg px-3 py-2 ${textColor} focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base`}
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block font-semibold mb-2">Amount</label>
              <input
                type="number"
                className={`w-full ${bgMain} border ${borderColor} rounded-lg px-3 py-2 ${textColor} focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 sm:py-3 rounded-xl font-bold text-black bg-yellow-400 hover:bg-yellow-500 active:scale-95 transition-all ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Verifying..." : "Verify Transaction"}
            </button>
          </form>
        </div>

        {/* ✅ Right Box - Transaction History */}
        <div
          className={`${bgCard} border ${borderColor} rounded-2xl shadow-lg p-5 md:p-8`}
        >
          <h5
            className={`text-2xl font-bold ${headingColor} mb-4 text-center md:text-left`}
          >
            Transaction History
          </h5>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className={`${headingColor} border-b ${borderColor}`}>
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
                      className="py-5 text-center text-gray-400 italic"
                    >
                      No transactions yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx, i) => (
                    <tr
                      key={i}
                      className={`border-b ${borderColor} hover:${
                        darkMode ? "bg-[#1c1c1e]" : "bg-gray-100"
                      } transition`}
                    >
                      <td className="py-2 px-3">{tx.utr}</td>
                      <td className="py-2 px-3">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 capitalize">{tx.payment_type}</td>
                      <td className="py-2 px-3 text-yellow-500 font-semibold">
                        ₹{tx.payment_amount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ Popup */}
      {popup.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div
            className={`${bgCard} border ${borderColor} rounded-2xl p-6 max-w-sm w-full text-center`}
          >
            <div
              className={`mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full ${
                popup.success ? "bg-green-600" : "bg-red-600"
              }`}
            >
              <span className="text-white text-2xl">
                {popup.success ? "✅" : "❌"}
              </span>
            </div>

            <h2
              className={`text-xl sm:text-2xl font-bold mb-2 ${
                popup.success ? "text-green-400" : "text-red-400"
              }`}
            >
              {popup.success ? "Payment Successful" : "Transaction Failed"}
            </h2>

            <p className="mb-4 text-sm sm:text-base">{popup.message}</p>

            {popup.transaction && (
              <div
                className={`${bgMain} border ${borderColor} rounded-xl p-3 mb-4 text-sm`}
              >
                <p>
                  <strong>UTR:</strong> {popup.transaction.utr}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{popup.transaction.payment_amount}
                </p>
                <p>
                  <strong>Type:</strong> {popup.transaction.payment_type}
                </p>
              </div>
            )}

            <button
              onClick={() => setPopup({ ...popup, visible: false })}
              className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl transition active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
