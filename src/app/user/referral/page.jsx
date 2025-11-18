"use client";

import { useState, useEffect } from "react";
import {
  MdLink,
  MdPercent,
  MdAttachMoney,
  MdPersonAddAlt,
  MdPayments,
  MdVerifiedUser,
  MdMonetizationOn,
  MdTouchApp,
} from "react-icons/md";

import { getAffiliateSettings } from "@/lib/adminServices";

export default function Referral() {
  const [copied, setCopied] = useState(false);
  const [commissionRate, setCommissionRate] = useState(5);
  const [minimumPayout, setMinimumPayout] = useState(50);
  const [loading, setLoading] = useState(true);

  const referralLink = "https://website.com/affiliates?ref=2a5afb";

  // Load affiliate settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getAffiliateSettings();
        setCommissionRate(data.commission_rate || 5);
        setMinimumPayout(data.minimum_payout || 50);
      } catch (err) {
        console.error("Affiliate settings load error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0F1117] text-gray-800 dark:text-gray-200 px-6 py-10">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Affiliate Program
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your referral link and earn commission on successful referrals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LEFT CARD – Referral Link & Settings */}
        <div className="bg-white dark:bg-[#1A1F2B] border border-gray-300 dark:border-[#2B3143] rounded-2xl p-6 shadow-md dark:shadow-lg">

          {/* Title */}
          <div className="flex items-center gap-2 mb-4">
            <MdLink className="text-gray-700 dark:text-gray-300 w-5 h-5" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Referral Link
            </h2>
          </div>

          {/* Link Input */}
          <div className="space-y-4">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="
                w-full 
                bg-gray-100 dark:bg-[#0F1117] 
                border border-gray-300 dark:border-[#2B3143] 
                rounded-lg p-3 
                text-gray-800 dark:text-gray-200
                outline-none
              "
            />

            <button
              onClick={copyLink}
              className="
                w-full py-2 rounded-lg font-semibold 
                bg-gray-800 dark:bg-gray-700 text-white
                hover:bg-gray-700 dark:hover:bg-gray-600 
                transition
              "
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>

          {/* Affiliate Settings */}
          <div className="mt-6 space-y-4">

            {/* Commission */}
            <div className="
              flex justify-between items-center 
              bg-gray-100 dark:bg-[#0F1117] 
              border border-gray-300 dark:border-[#2B3143] 
              rounded-lg px-4 py-2
            ">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MdPercent />
                <span>Commission Rate</span>
              </div>

              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {loading ? "..." : `${commissionRate}%`}
              </span>
            </div>

            {/* Minimum Payout */}
            <div className="
              flex justify-between items-center 
              bg-gray-100 dark:bg-[#0F1117] 
              border border-gray-300 dark:border-[#2B3143] 
              rounded-lg px-4 py-2
            ">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MdAttachMoney />
                <span>Minimum Payout</span>
              </div>

              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {loading ? "..." : `$${minimumPayout}`}
              </span>
            </div>

          </div>
        </div>

        {/* RIGHT CARD – Affiliate Stats */}
        <div className="bg-white dark:bg-[#1A1F2B] border border-gray-300 dark:border-[#2B3143] rounded-2xl p-6 shadow-md dark:shadow-lg">

          <div className="flex items-center gap-2 mb-4">
            <MdLink className="text-gray-700 dark:text-gray-300 w-5 h-5" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Affiliate Statistics
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[
              { icon: <MdTouchApp />, label: "Visits", value: "0" },
              { icon: <MdPersonAddAlt />, label: "Registrations", value: "0" },
              { icon: <MdPayments />, label: "Referrals", value: "0%" },
              { icon: <MdVerifiedUser />, label: "Conversion Rate", value: "0.00" },
              { icon: <MdMonetizationOn />, label: "Total Earnings", value: "$0.00" },
              { icon: <MdAttachMoney />, label: "Available Earnings", value: "$0.00" },
            ].map((stat, i) => (
              <div
                key={i}
                className="
                  flex items-center gap-3 
                  bg-gray-100 dark:bg-[#0F1117]
                  border border-gray-300 dark:border-[#2B3143] 
                  rounded-lg p-4
                "
              >
                <div className="text-gray-700 dark:text-gray-300 text-xl">
                  {stat.icon}
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </h4>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
