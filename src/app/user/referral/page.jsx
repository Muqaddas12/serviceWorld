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

  // 🧠 Load live settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getAffiliateSettings();
        setCommissionRate(data.commission_rate || 5);
        setMinimumPayout(data.minimum_payout || 50);
      } catch (err) {
        console.error("Failed to load affiliate settings:", err);
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
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0f] text-gray-300 px-6 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">
          Affiliate Program
        </h1>
        <p className="text-gray-400">
          Share your referral link and earn commission on every referral.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Card - Referral Info */}
        <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <MdLink className="text-yellow-400 w-5 h-5" />
            <h2 className="text-lg font-semibold text-yellow-400">
              Referral Link
            </h2>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full bg-[#0e0e0f] border border-yellow-500/20 rounded-lg p-3 text-gray-300 focus:outline-none"
            />
            <button
              onClick={copyLink}
              className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-lg hover:bg-yellow-400 hover:shadow-[0_0_15px_rgba(234,179,8,0.6)] transition"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {/* Commission Rate */}
            <div className="flex justify-between items-center bg-[#0e0e0f] border border-yellow-500/10 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2 text-gray-300">
                <MdPercent className="text-yellow-400" />
                <span>Commission rate</span>
              </div>
              <span className="text-yellow-400 font-semibold">
                {loading ? "..." : `${commissionRate}%`}
              </span>
            </div>

            {/* Minimum Payout */}
            <div className="flex justify-between items-center bg-[#0e0e0f] border border-yellow-500/10 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2 text-gray-300">
                <MdAttachMoney className="text-yellow-400" />
                <span>Minimum payout</span>
              </div>
              <span className="text-yellow-400 font-semibold">
                {loading ? "..." : `$${minimumPayout}`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card - Affiliate Stats */}
        <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <MdLink className="text-yellow-400 w-5 h-5" />
            <h2 className="text-lg font-semibold text-yellow-400">
              Affiliate Statistics
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[
              { icon: <MdTouchApp />, label: "Visits", value: "0" },
              { icon: <MdPersonAddAlt />, label: "Registrations", value: "0" },
              { icon: <MdPayments />, label: "Referrals", value: "0%" },
              { icon: <MdVerifiedUser />, label: "Conversion rate", value: "0.00" },
              { icon: <MdMonetizationOn />, label: "Total earnings", value: "$0.00" },
              { icon: <MdAttachMoney />, label: "Available earnings", value: "$0.00" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-[#0e0e0f] border border-yellow-500/10 rounded-lg p-4"
              >
                <div className="text-yellow-400 text-xl">{stat.icon}</div>
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <h4 className="text-lg font-semibold text-yellow-400">
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
