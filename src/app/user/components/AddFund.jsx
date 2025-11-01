"use client";

import { useEffect, useState } from "react";

export default function AddFund() {
  const [paymentType, setPaymentType] = useState("BharatPe");
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

  // Fetch Payment Methods
  useEffect(() => {
    const getPaymentMethods = async () => {
      try {
        const res = await fetch("/api/payment-methods");
        const data = await res.json();
        setPaymentMethod(data.methods || []);
      } catch (err) {
        console.error("Error fetching payment methods:", err);
      }
    };
    getPaymentMethods();
  }, []);

  // Fetch Transaction History
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

  // Filter QR Image
  useEffect(() => {
    const matched = paymentMethod.find((item) => item.type === paymentType);
    setFilteredPaymentMethod(matched ? matched.qrImage : "");
  }, [paymentType, paymentMethod]);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/services/addFunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_type: paymentType, utr, payment_amount: amount }),
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
    } catch {
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

  return (
    <div className="min-h-screen bg-[#0e0e0f] text-gray-300 flex justify-center px-2 sm:px-4 md:px-6 py-8">
      <div className="w-full max-w-6xl space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
        {/* Left Box - Add Fund Form */}
        <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-6 text-center md:text-left">
            Add Funds
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method */}
            <div>
              <label className="block font-semibold mb-2 text-gray-200">
                Payment Method
              </label>
              <select
                className="w-full bg-[#0e0e0f] border border-yellow-500/20 rounded-lg px-3 py-2 text-gray-200 focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <option value="BharatPe">BharatPe, PhonePe, GPay, Paytm</option>
                <option value="PhonePe">PhonePe [Min ₹10, 3% Bonus]</option>
                <option value="BankTransfer">UPI / Bank Transfer [Min ₹1000, 6% Bonus]</option>
              </select>
            </div>

            {/* QR + Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* QR */}
              <div className="bg-[#0e0e0f] border border-yellow-500/20 p-4 rounded-2xl shadow-inner flex flex-col items-center">
                <h6 className="font-semibold text-yellow-400 mb-3">Scan QR</h6>
                {filteredPaymentMethod ? (
                  <img
                    src={`data:image/png;base64,${filteredPaymentMethod}`}
                    alt="QR Code"
                    className="w-40 sm:w-52 h-auto rounded-lg"
                  />
                ) : (
                  <p className="text-center text-gray-500 text-sm">No QR available</p>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-[#0e0e0f] border border-yellow-500/20 rounded-xl p-4 text-sm">
                <h6 className="font-semibold text-yellow-400 mb-2">Instructions</h6>
                <ol className="list-decimal list-inside space-y-1 text-gray-400">
                  <li>Scan the QR code above</li>
                  <li>Pay the desired amount</li>
                  <li>Enter amount & transaction ID</li>
                  <li>Click on “Verify Transaction”</li>
                </ol>
              </div>
            </div>

            {/* UTR */}
            <div>
              <label className="block font-semibold mb-2 text-gray-200">
                Enter UTR
              </label>
              <input
                type="text"
                className="w-full bg-[#0e0e0f] border border-yellow-500/20 rounded-lg px-3 py-2 text-gray-200 focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block font-semibold mb-2 text-gray-200">
                Amount
              </label>
              <input
                type="number"
                className="w-full bg-[#0e0e0f] border border-yellow-500/20 rounded-lg px-3 py-2 text-gray-200 focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base"
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

        {/* Right Box - Transaction History */}
        <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
          <h5 className="text-2xl font-bold text-yellow-400 mb-4 text-center md:text-left">
            Transaction History
          </h5>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-300 min-w-[500px]">
              <thead className="text-yellow-400 border-b border-yellow-500/20">
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
                    <td colSpan="4" className="py-5 text-center text-gray-500 italic">
                      No transactions yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx, i) => (
                    <tr
                      key={i}
                      className="border-b border-yellow-500/10 hover:bg-[#1c1c1e] transition"
                    >
                      <td className="py-2 px-3">{tx.utr}</td>
                      <td className="py-2 px-3">{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="py-2 px-3 capitalize">{tx.payment_type}</td>
                      <td className="py-2 px-3 text-yellow-400 font-semibold">
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

      {/* Popup */}
      {popup.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl p-6 max-w-sm w-full text-center">
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

            <p className="text-gray-300 mb-4 text-sm sm:text-base">{popup.message}</p>

            {popup.transaction && (
              <div className="text-left bg-[#0e0e0f] border border-yellow-500/20 rounded-xl p-3 mb-4 text-sm">
                <p><strong>UTR:</strong> {popup.transaction.utr}</p>
                <p><strong>Amount:</strong> ₹{popup.transaction.payment_amount}</p>
                <p><strong>Type:</strong> {popup.transaction.payment_type}</p>
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
