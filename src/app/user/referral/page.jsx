"use client";

import React, { useState, useEffect } from "react";
import {
  MdLink,
  MdPercent,
  MdAttachMoney,
  MdPersonAddAlt,
  MdPayments,
  MdVerifiedUser,
  MdMonetizationOn,
  MdTouchApp,
  MdHistory,
} from "react-icons/md";

import {
  getUserBalance,
  refferalWidrawn,
  getUserWithdrawRequests,
} from "@/lib/userActions";

import { getAffiliateSettings } from "@/lib/adminServices";
import { useCurrency } from "@/context/CurrencyContext";

export default function Referral() {
  const [copied, setCopied] = useState(false);
  const [commissionRate, setCommissionRate] = useState('');
  const [minimumPayout, setMinimumPayout] = useState('');
  const [loading, setLoading] = useState(true);
  const [userBal, setUserBal] = useState(0);
  const [requests, setRequests] = useState([]); // ✅ withdraw history from DB

  const { symbol, convert } = useCurrency();
const [referralLink, setReferralLink] = useState("");

useEffect(() => {
  if (typeof window !== "undefined") {
    setReferralLink(`${window.location.origin}/affiliates?ref=2a5afb`);
  }
}, []);


  const [withdrawAmount, setWithdrawAmount] = useState("");

  // ============================
  // LOAD settings, balance, requests
  // ============================
  useEffect(() => {
    async function loadData() {
      try {
        const settings = await getAffiliateSettings();
        const bal = await getUserBalance();
        const req = await getUserWithdrawRequests();

        if (settings) {
          setCommissionRate(settings.commission_rate );
          setMinimumPayout(settings.minimum_payout );
        }

        if (bal.success) {
          setUserBal(bal.balance ?? 0);
        }

        if (req.success) {
          setRequests(req.withdrawals || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ============================
  // COPY LINK
  // ============================
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // ============================
  // WITHDRAW MONEY
  // ============================
  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);

    if (!amount || amount <= 0) return alert("Enter valid amount.");
    if (amount < minimumPayout)
      return alert(`Minimum withdraw is ${symbol}${convert(minimumPayout).toFixed(2)}`);
    if (amount > userBal) return alert("Insufficient balance.");

    const formData = new FormData();
    formData.append("amount", amount);

    const res = await refferalWidrawn(formData);

    if (!res.success) return alert(res.message);

    alert("Withdrawal request submitted!");

    setUserBal((prev) => prev - amount);
    setWithdrawAmount("");

    // reload requests
    const req = await getUserWithdrawRequests();
    if (req.success) setRequests(req.data || []);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0F1117] text-gray-800 dark:text-gray-200 px-6 py-10">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Affiliate Program</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Share your link and earn commission.
        </p>
      </div>

      {/* ============================= */}
      {/* TOP 3 CARD GRID               */}
      {/* ============================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT – REFERRAL LINK */}
        <div className="bg-white dark:bg-[#1A1F2B] border border-gray-300 dark:border-[#2B3143]
         rounded-2xl p-6 shadow-md">

          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <MdLink className="w-5 h-5" /> Referral Link
          </h2>

          <input
            type="text"
            readOnly
            value={referralLink}
            className="w-full bg-gray-100 dark:bg-[#0F1117]
            border border-gray-300 dark:border-[#2B3143]
            rounded-lg p-3"
          />

          <button
            onClick={copyLink}
            className="w-full py-2 mt-4 rounded-lg bg-gray-800 dark:bg-gray-700 
          text-white hover:bg-gray-700"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>

          {/* SETTINGS */}
          <div className="mt-6 space-y-4">

            <div className="flex justify-between items-center 
            bg-gray-100 dark:bg-[#0F1117] border border-gray-300 dark:border-[#2B3143] 
            rounded-lg px-4 py-2">
              <span className="flex items-center gap-2">
                <MdPercent /> Commission Rate
              </span>
              <span>{commissionRate}%</span>
            </div>

            <div className="flex justify-between items-center 
            bg-gray-100 dark:bg-[#0F1117] border border-gray-300 dark:border-[#2B3143] 
            rounded-lg px-4 py-2">
              <span className="flex items-center gap-2">
                <MdAttachMoney /> Minimum Payout
              </span>
              <span>{symbol}{convert(minimumPayout).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* MIDDLE – STATS */}
        <div className="bg-white dark:bg-[#1A1F2B] border border-gray-300 
        dark:border-[#2B3143] rounded-2xl p-6 shadow-md">

          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MdMonetizationOn className="w-5 h-5" /> Affiliate Statistics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[
              { icon: <MdTouchApp />, label: "Visits", value: "0" },
              { icon: <MdPersonAddAlt />, label: "Registrations", value: "0" },
              { icon: <MdPayments />, label: "Referrals", value: "0%" },
              { icon: <MdVerifiedUser />, label: "Conversion Rate", value: "0.00%" },
              { icon: <MdMonetizationOn />, label: "Total Earnings", value: `${symbol}${convert(0).toFixed(2)}` },
              { icon: <MdAttachMoney />, label: "Available Earnings", value: `${symbol}${convert(userBal).toFixed(2)}` },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-100 dark:bg-[#0F1117]
                 border border-gray-300 dark:border-[#2B3143] rounded-lg p-4"
              >
                <div className="text-xl">{stat.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <h4 className="text-lg font-semibold">{stat.value}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT – WITHDRAW */}
        <div className="bg-white dark:bg-[#1A1F2B] border border-gray-300 
        dark:border-[#2B3143] rounded-2xl p-6 shadow-md">

          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <MdPayments className="w-5 h-5" /> Withdraw Balance
          </h2>

          <div className="bg-gray-100 dark:bg-[#0F1117]
           border border-gray-300 dark:border-[#2B3143]
           p-4 rounded-lg mb-4">
            <p className="text-gray-500">Available Earnings</p>
            <h3 className="text-2xl font-bold">
              {symbol}{convert(userBal).toFixed(2)}
            </h3>
          </div>

          <input
            type="number"
            placeholder={`Enter amount (${symbol})`}
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-[#0F1117] border 
            border-gray-300 dark:border-[#2B3143]"
          />

          <button
            onClick={handleWithdraw}
            className="w-full py-2 mt-4 rounded-lg bg-green-600 text-white 
            hover:bg-green-700"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* ============================= */}
      {/* FULL WIDTH WITHDRAW HISTORY  */}
      {/* ============================= */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <MdHistory className="w-5 h-5" /> Withdrawal Requests
        </h2>

        <div className="bg-white dark:bg-[#1A1F2B] border border-gray-300 
        dark:border-[#2B3143] rounded-2xl p-6 shadow-md overflow-x-auto">

          <table className="w-full text-sm">
            <thead className="bg-gray-200 dark:bg-[#161A23]">
              <tr>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {requests.length > 0 ? (
                requests.map((req, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-300 dark:border-[#2B3143]"
                  >
                    <td className="p-3">
                      {symbol}{convert(req.amount).toFixed(2)}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          req.status === "Pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {new Date(req.date).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-4 text-gray-500"
                  >
                    No withdrawal requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
