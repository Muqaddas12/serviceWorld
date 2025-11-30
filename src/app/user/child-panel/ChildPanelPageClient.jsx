"use client";

import { useState, useTransition } from "react";
import { createChildPanel } from "@/lib/adminServices";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ChildPanelPageClient({ settings, balance }) {
  const { currency, symbol, convert } = useCurrency();

  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  // NEW STATES
  const [domainType, setDomainType] = useState("subdomain"); 
  const [subdomain, setSubdomain] = useState("");
  const [ownDomain, setOwnDomain] = useState("");

  // Password toggle
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const adminDomain = settings?.domain || "yourpaneldomain.com";

  // PRICE BASED ON DOMAIN TYPE
  const basePriceRaw =
    domainType === "subdomain"
      ? Number(settings?.subdomainprice || 800)
      : Number(settings?.owndomainprice || 1200);

  const convertedPrice = Math.round(convert(basePriceRaw));
  const convertedBalance = Math.round(convert(balance));

  const isLowBalance = convertedBalance < convertedPrice;

  // Handle subdomain input
  const handleDomainChange = (e) => {
    let value = e.target.value.trim();
    if (value.endsWith("." + adminDomain)) {
      value = value.replace("." + adminDomain, "");
    }
    value = value.replace(/[^a-zA-Z0-9-]/g, "");
    setSubdomain(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLowBalance) return;

    const formData = new FormData(e.target);

    // SET CORRECT DOMAIN
    if (domainType === "subdomain") {
      formData.set("domain", `${subdomain}.${adminDomain}`);
    } else {
      formData.set("domain", ownDomain);
    }

    formData.set("domaintype", domainType);

    startTransition(async () => {
      const res = await createChildPanel({ formData });

      if (res.error) setMessage("❌ " + res.error);
      else setMessage("✔ " + res.message);
    });
  };

return (
  <div className="min-h-screen bg-gray-100 dark:bg-[#0F1117] text-gray-700 dark:text-gray-300 p-6">
    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-300">Create Your Child Panel</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Fill out the details below to generate your own SMM child panel.
        </p>
      </div>

      {/* CONTAINER */}
      <div className="bg-white dark:bg-[#1A1F2B] border border-gray-300 dark:border-[#2B3143] rounded-2xl p-6 shadow-md dark:shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">Panel Details</h2>

        {/* LOW BALANCE ALERT */}
        {isLowBalance && (
          <div className="md:col-span-2 mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-sm">
            <p>
              ⚠ Your balance is too low. You need{" "}
              <strong>{symbol}{convertedPrice - convertedBalance}</strong> more to create this panel.
            </p>
            <p className="mt-1 text-xs">
              Your Balance: <strong>{symbol}{convertedBalance}</strong> | Price:{" "}
              <strong>{symbol}{convertedPrice}</strong>
            </p>
            <Link
              href="/user/addfunds"
              className="inline-block mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Add Balance
            </Link>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* DOMAIN TYPE */}
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Choose Domain Type
            </label>

            <div className="flex gap-6 text-gray-700 dark:text-gray-300">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="subdomain"
                  checked={domainType === "subdomain"}
                  onChange={() => setDomainType("subdomain")}
                />
                Subdomain
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="owndomain"
                  checked={domainType === "owndomain"}
                  onChange={() => setDomainType("owndomain")}
                />
                Your Domain
              </label>
            </div>
          </div>

          {/* SUBDOMAIN */}
          {domainType === "subdomain" && (
            <div>
              <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Subdomain
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={subdomain}
                  onChange={handleDomainChange}
                  placeholder="mypanel"
                  className="w-full bg-gray-100 dark:bg-[#0F1117] border border-gray-300 dark:border-[#2B3143] rounded-lg px-3 py-2 pr-32"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  .{adminDomain}
                </span>
              </div>
            </div>
          )}

          {/* OWN DOMAIN */}
          {domainType === "owndomain" && (
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Your Own Domain
              </label>
              <input
                type="text"
                value={ownDomain}
                onChange={(e) => setOwnDomain(e.target.value.trim())}
                placeholder="example.com"
                className="w-full bg-gray-100 dark:bg-[#0F1117] border border-gray-300 dark:border-[#2B3143] rounded-lg px-3 py-2"
                required
              />

              {/* DNS INSTRUCTIONS */}
              <div className="mt-3 p-3 bg-gray-200 dark:bg-[#2B3143] rounded-lg border border-gray-300 dark:border-gray-600">
                <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Use this DNS in your Name Server:
                </p>
               <ul className="mt-1 w-[50%] text-sm text-gray-600 dark:text-gray-400    whitespace-normal">
  {settings?.nameserver
    ?.split(/[\s,]+/)  // handles spaces & commas
  // split into array
    .map((ns, i) => (
      <li key={i}>• {ns}</li>
    ))}
</ul>

              </div>
            </div>
          )}

          {/* CURRENCY */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Currency</label>
            <select
              name="currency"
              defaultValue={currency}
              className="w-full bg-gray-100 dark:bg-[#0F1117] border border-gray-300 dark:border-[#2B3143] rounded-lg px-3 py-2"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          {/* USERNAME */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Admin Username</label>
            <input
              type="text"
              name="username"
              placeholder="admin123"
              className="w-full bg-gray-100 dark:bg-[#0F1117] border border-gray-300 dark:border-[#2B3143] rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Admin Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="w-full bg-gray-100 dark:bg-[#0F1117] border border-gray-300 dark:border-[#2B3143] rounded-lg px-3 py-2"
                required
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
              Confirm Admin Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                className="w-full bg-gray-100 dark:bg-[#0F1117] border border-gray-300 dark:border-[#2B3143] rounded-lg px-3 py-2"
                required
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* PRICE */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Price</label>
            <input
              type="text"
              readOnly
              value={`${symbol}${convertedPrice}`}
              className="w-full bg-gray-100 dark:bg-[#0F1117] border border-gray-300 dark:border-[#2B3143] rounded-lg px-3 py-2"
            />
          </div>

          {/* SUBMIT */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isPending || isLowBalance}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                isLowBalance
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600"
              }`}
            >
              {isPending
                ? "Submitting..."
                : isLowBalance
                ? "Low Balance — Cannot Submit"
                : "Submit Order"}
            </button>

            {message && (
              <p
                className={`text-center mt-3 text-sm ${
                  message.startsWith("✔") ? "text-green-500" : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  </div>
);

}
